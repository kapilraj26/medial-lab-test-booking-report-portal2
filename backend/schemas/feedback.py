from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    user_id: int
    rating: int
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