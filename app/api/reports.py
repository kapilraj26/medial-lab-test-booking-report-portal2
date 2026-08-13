from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.report import ReportCreate, ReportResponse
from app.services.report_service import create_report, get_reports

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post("/", response_model=ReportResponse)
def add_report(report: ReportCreate, db: Session = Depends(get_db)):
    return create_report(db, report)


@router.get("/", response_model=list[ReportResponse])
def view_reports(db: Session = Depends(get_db)):
    return get_reports(db)