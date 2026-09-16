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

    # ==========================================
    # FIND BOOKING
    # ==========================================

    booking = db.query(Booking).filter(
        Booking.booking_id == report.booking_id
    ).first()

    if booking is None:
        return None, "Booking not found"


    # ==========================================
    # REPORT ONLY AFTER BOOKING IS COMPLETED
    # ==========================================

    if booking.status != "Completed":
        return (
            None,
            "Report can only be uploaded for a completed booking"
        )


    # ==========================================
    # CHECK DUPLICATE REPORT
    # ==========================================

    existing_report = db.query(Report).filter(
        Report.booking_id == report.booking_id
    ).first()

    if existing_report is not None:
        return (
            None,
            "Report already exists for this booking"
        )


    # ==========================================
    # CREATE REPORT
    # ==========================================

    new_report = Report(
        booking_id=report.booking_id,
        report_file=report.report_file,
        result=report.result,
        report_date=report.report_date,
        status="Uploaded"
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

    # ==========================================
    # FIND LOGGED-IN USER
    # ==========================================

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        return None


    # ==========================================
    # FIND USER'S BOOKINGS
    # ==========================================

    user_bookings = db.query(Booking).filter(
        Booking.user_id == user.user_id
    ).all()

    booking_ids = [
        booking.booking_id
        for booking in user_bookings
    ]


    # ==========================================
    # NO BOOKINGS
    # ==========================================

    if not booking_ids:
        return []


    # ==========================================
    # GET USER'S REPORTS ONLY
    # ==========================================

    return db.query(Report).filter(
        Report.booking_id.in_(booking_ids)
    ).all()


# ==========================================
# STAFF / ADMIN - GET ALL REPORTS
# ==========================================

def get_all_reports(
    db: Session
):

    return db.query(Report).all()