from sqlalchemy.orm import Session
from app.models.report import Report


def create_report(db: Session, report):
    new_report=Report(
        booking_id=report.booking_id,
        report_file=report.report_file,
        result=report.result,
        report_date=report.report_date
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


def get_reports(db: Session):
    return db.query(Report).all()