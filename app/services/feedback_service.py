from sqlalchemy.orm import Session

from app.models.feedback import Feedback
from app.models.user import User
from app.models.booking import Booking


def create_feedback(
    db: Session,
    feedback,
    user_email: str
):

    # =========================
    # FIND LOGGED-IN USER
    # =========================

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        return None, "User not found"


    # =========================
    # FIND BOOKING
    # =========================

    booking = db.query(Booking).filter(
        Booking.booking_id == feedback.booking_id
    ).first()

    if booking is None:
        return None, "Booking not found"


    # =========================
    # CHECK BOOKING OWNERSHIP
    # =========================

    if booking.user_id != user.user_id:

        return (
            None,
            "You can only submit feedback for your own booking"
        )


    # =========================
    # CHECK DUPLICATE FEEDBACK
    # =========================

    existing_feedback = db.query(
        Feedback
    ).filter(
        Feedback.booking_id == feedback.booking_id
    ).first()

    if existing_feedback is not None:

        return (
            None,
            "Feedback already submitted for this booking"
        )


    # =========================
    # CREATE FEEDBACK
    # =========================

    new_feedback = Feedback(
        user_id=user.user_id,
        booking_id=feedback.booking_id,
        rating=feedback.rating,
        comments=feedback.comments
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback, None


def get_feedbacks(
    db: Session,
    user_email: str
):

    # =========================
    # FIND LOGGED-IN USER
    # =========================

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        return None


    # =========================
    # GET ONLY USER'S FEEDBACK
    # =========================

    return db.query(
        Feedback
    ).filter(
        Feedback.user_id == user.user_id
    ).all()