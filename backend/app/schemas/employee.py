import re
from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class EmployeeStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150, description="Employee full name")
    email: EmailStr = Field(..., description="Unique valid employee email address")
    phone: str = Field(..., min_length=7, max_length=25, description="Valid telephone number")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")
    designation: str = Field(..., min_length=1, max_length=100, description="Job title / designation")
    joining_date: date = Field(..., description="Date of joining (YYYY-MM-DD)")
    status: EmployeeStatus = Field(default=EmployeeStatus.ACTIVE, description="Predefined status (Active or Inactive)")

    @field_validator("name")
    def name_must_not_be_blank(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Employee name cannot be empty or blank")
        return cleaned

    @field_validator("phone")
    def validate_phone(cls, v: str) -> str:
        cleaned = v.strip()
        # Allows digits, spaces, hyphens, plus sign, parentheses. At least 7 digits.
        if not re.match(r"^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,20}$", cleaned):
            raise ValueError("Invalid phone number format. Provide a valid 7 to 20 digit phone number.")
        return cleaned

    @field_validator("department", "designation")
    def string_not_blank(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty or blank")
        return cleaned


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=7, max_length=25)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    designation: Optional[str] = Field(None, min_length=1, max_length=100)
    joining_date: Optional[date] = None
    status: Optional[EmployeeStatus] = None

    @field_validator("name")
    def name_must_not_be_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            if not cleaned:
                raise ValueError("Employee name cannot be empty or blank")
            return cleaned
        return v

    @field_validator("phone")
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            if not re.match(r"^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,20}$", cleaned):
                raise ValueError("Invalid phone number format. Provide a valid 7 to 20 digit phone number.")
            return cleaned
        return v


class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmployeePaginatedResponse(BaseModel):
    items: List[EmployeeOut]
    total: int
    page: int
    limit: int
    total_pages: int

