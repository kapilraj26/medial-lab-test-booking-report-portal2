from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services.feedback_service import create_feedback, get_feedbacks


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


@router.post("/", response_model=FeedbackResponse)
def add_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db)
):
    return create_feedback(db, feedback)


@router.get("/", response_model=list[FeedbackResponse])
def view_feedback(db: Session = Depends(get_db)):
    return get_feedbacks(db)