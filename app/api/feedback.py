from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_email

from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse
)

from app.services.feedback_service import (
    create_feedback,
    get_feedbacks
)


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


@router.post(
    "/",
    response_model=FeedbackResponse
)
def add_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(
        get_current_user_email
    )
):

    result, error = create_feedback(
        db,
        feedback,
        current_user_email
    )

    if error == "User not found":
        raise HTTPException(
            status_code=404,
            detail=error
        )

    if error == "Booking not found":
        raise HTTPException(
            status_code=404,
            detail=error
        )

    if error == "Feedback already submitted for this booking":
        raise HTTPException(
            status_code=400,
            detail=error
        )

    if error:
        raise HTTPException(
            status_code=403,
            detail=error
        )

    return result


@router.get(
    "/",
    response_model=list[FeedbackResponse]
)
def view_feedback(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(
        get_current_user_email
    )
):

    feedbacks = get_feedbacks(
        db,
        current_user_email
    )

    if feedbacks is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return feedbacks