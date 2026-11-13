import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.core.database import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeOut,
    EmployeePaginatedResponse,
    EmployeeStatus,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=EmployeePaginatedResponse)
def list_employees(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for employee name or email"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status: Optional[str] = Query(None, description="Filter by status (Active or Inactive)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve paginated employee list with combined search and filtering capabilities.
    Example: GET /employees?page=1&limit=10&search=john&department=IT&status=Active
    """
    query = db.query(Employee)

    # Search filter: Employee Name OR Email
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Employee.name.ilike(term),
                Employee.email.ilike(term)
            )
        )

    # Department filter
    if department and department.strip() and department.strip().lower() != "all":
        query = query.filter(Employee.department == department.strip())

    # Status filter
    if status and status.strip() and status.strip().lower() != "all":
        valid_statuses = [e.value for e in EmployeeStatus]
        cleaned_status = status.strip().capitalize()
        if cleaned_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status filter '{status}'. Allowed values: {', '.join(valid_statuses)}",
            )
        query = query.filter(Employee.status == cleaned_status)

    total = query.count()
    total_pages = math.ceil(total / limit) if total > 0 else 1

    # Order newest first for consistent display
    employees = (
        query.order_by(Employee.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return EmployeePaginatedResponse(
        items=employees,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.get("/{id}", response_model=EmployeeOut)
def get_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve single employee details by ID.
    Returns 404 if not found.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {id} not found."
        )
    return employee


@router.post("", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee_in: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new employee record.
    Returns 409 Conflict if email is already registered.
    """
    existing_employee = db.query(Employee).filter(
        func.lower(Employee.email) == employee_in.email.lower()
    ).first()

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An employee with email '{employee_in.email}' already exists."
        )

    employee = Employee(
        name=employee_in.name,
        email=employee_in.email.lower(),
        phone=employee_in.phone,
        department=employee_in.department,
        designation=employee_in.designation,
        joining_date=employee_in.joining_date,
        status=employee_in.status.value,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{id}", response_model=EmployeeOut)
def update_employee(
    id: int,
    employee_in: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing employee's details.
    Returns 404 if employee does not exist.
    Returns 409 if new email collides with another employee.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {id} not found."
        )

    if employee_in.email and employee_in.email.lower() != employee.email.lower():
        existing_conflict = db.query(Employee).filter(
            func.lower(Employee.email) == employee_in.email.lower(),
            Employee.id != id
        ).first()
        if existing_conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"An employee with email '{employee_in.email}' already exists."
            )

    update_data = employee_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "email" and value:
            setattr(employee, field, value.lower())
        elif field == "status" and value:
            setattr(employee, field, value.value if hasattr(value, "value") else str(value))
        else:
            setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete an employee record by ID.
    Returns 404 if employee is not found.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {id} not found."
        )

    db.delete(employee)
    db.commit()
    return {
        "message": "Employee deleted successfully.",
        "id": id,
        "name": employee.name
    }

