from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.booking import Booking
from app.models.user import User


# ==========================================
# STAFF / ADMIN - CREATE REPORT
# ==========================================

def create_report(
    db: Session,
    report
):

    # Find booking
    booking = db.query(Booking).filter(
        Booking.booking_id == report.booking_id
    ).first()

    if booking is None:
        return None, "Booking not found"

    # Create report
    new_report = Report(
        booking_id=report.booking_id,
        report_file=report.report_file,
        result=report.result,
        report_date=report.report_date
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report, None


# ==========================================
# PATIENT - GET OWN REPORTS
# ==========================================

def get_reports(
    db: Session,
    user_email: str
):

    # Find logged-in user
    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        return None

    # Find user's bookings
    user_bookings = db.query(Booking).filter(
        Booking.user_id == user.user_id
    ).all()

    booking_ids = [
        booking.booking_id
        for booking in user_bookings
    ]

    # Find reports belonging to those bookings
    if not booking_ids:
        return []

    return db.query(Report).filter(
        Report.booking_id.in_(booking_ids)
    ).all()