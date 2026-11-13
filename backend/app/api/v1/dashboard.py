from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.dashboard import DashboardStatsResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve real-time dynamic dashboard statistics:
    - Total Employees
    - Active Employees
    - Inactive Employees
    - Breakdown of employees by department
    """
    total_employees = db.query(Employee).count()
    active_employees = db.query(Employee).filter(Employee.status == "Active").count()
    inactive_employees = db.query(Employee).filter(Employee.status == "Inactive").count()

    dept_rows = (
        db.query(Employee.department, func.count(Employee.id))
        .group_by(Employee.department)
        .all()
    )
    department_counts = {row[0]: row[1] for row in dept_rows}

    return DashboardStatsResponse(
        total_employees=total_employees,
        active_employees=active_employees,
        inactive_employees=inactive_employees,
        department_counts=department_counts,
    )

