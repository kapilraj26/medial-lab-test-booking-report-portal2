from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import User
from app.models.booking import Booking
from app.models.report import Report
from app.models.feedback import Feedback
router = APIRouter(prefix="/admin",tags=["Admin"])

@router.get("/dashboard")
def admin_dashboard(
    db: Session=Depends(get_db),
    current_user=Depends(require_role("Admin"))
):
    total_users=db.query(User).count()
    total_patients=db.query(User).filter( User.role=="Patient").count()
    total_staff=db.query(User).filter(User.role=="Staff").count()
    total_admins=db.query(User).filter(User.role=="Admin").count()
    total_bookings=db.query(Booking).count()
    pending_bookings=db.query(Booking).filter(Booking.status=="Pending").count()
    confirmed_bookings=db.query(Booking).filter(Booking.status=="Confirmed").count()
    completed_bookings=db.query(Booking).filter(Booking.status=="Completed").count()
    cancelled_bookings=db.query(Booking).filter(Booking.status=="Cancelled").count()
    total_reports=db.query(Report).count()
    total_feedback=db.query(Feedback).count()
    return {
        "users": {
            "total": total_users,
            "patients": total_patients,
            "staff": total_staff,
            "admins": total_admins
        },
        "bookings": {
            "total": total_bookings,
            "pending": pending_bookings,
            "confirmed": confirmed_bookings,
            "completed": completed_bookings,
            "cancelled": cancelled_bookings
        },
        "reports": {
            "total": total_reports
        },
        "feedback": {
            "total": total_feedback
        }
    }