from sqlalchemy.orm import Session

from app.models.booking import Booking


def create_booking(db: Session, booking):
    new_booking = Booking(
        user_id=booking.user_id,
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