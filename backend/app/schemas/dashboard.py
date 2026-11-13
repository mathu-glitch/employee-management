from typing import Dict
from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_employees: int
    active_employees: int
    inactive_employees: int
    department_counts: Dict[str, int]

