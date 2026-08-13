from sqlalchemy.orm import Session

from app.models.feedback import Feedback
from app.models.user import User


def create_feedback(db: Session, feedback, user_email: str):

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        return None

    new_feedback = Feedback(
        user_id=user.user_id,
        booking_id=feedback.booking_id,
        rating=feedback.rating,
        comments=feedback.comments
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


def get_feedbacks(db: Session):
    return db.query(Feedback).all()