from sqlalchemy.orm import Session
from app.models.feedback import Feedback


def create_feedback(db: Session, feedback):
    new_feedback = Feedback(
        user_id=feedback.user_id,
        rating=feedback.rating,
        comments=feedback.comments
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


def get_feedbacks(db: Session):
    return db.query(Feedback).all()