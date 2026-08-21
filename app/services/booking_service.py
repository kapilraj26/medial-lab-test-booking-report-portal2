from sqlalchemy.orm import Session

from app.models.booking import Booking


def create_booking(
    db: Session,
    booking,
    user_id: int
):
    new_booking = Booking(
        user_id=user_id,
        test_id=booking.test_id,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        status=booking.status
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


def get_all_bookings(db: Session):
    return db.query(Booking).all()


def get_user_bookings(
    db: Session,
    user_id: int
):
    return db.query(Booking).filter(
        Booking.user_id == user_id
    ).all()

def update_booking_status(
    db: Session,
    booking_id: int,
    new_status: str
):
    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if booking is None:
        return None, "Booking not found"

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ]

    if new_status not in allowed_statuses:
        return None, "Invalid booking status"

    booking.status = new_status

    db.commit()
    db.refresh(booking)

    return booking, None