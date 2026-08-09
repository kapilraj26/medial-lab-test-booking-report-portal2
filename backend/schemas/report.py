from datetime import date
from pydantic import BaseModel


class ReportCreate(BaseModel):
    booking_id: int
    report_file: str
    result: str
    report_date: date


class ReportResponse(ReportCreate):
    report_id: int

    model_config = {
        "from_attributes": True
    }