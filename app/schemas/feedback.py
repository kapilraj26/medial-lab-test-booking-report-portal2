from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    booking_id: int
    rating: int = Field(
        ge=1,
        le=5
    )
    comments: str


class FeedbackResponse(BaseModel):
    feedback_id: int
    user_id: int
    booking_id: int
    rating: int
    comments: str

    model_config = {
        "from_attributes": True
    }