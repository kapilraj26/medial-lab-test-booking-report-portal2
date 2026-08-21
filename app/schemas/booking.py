from datetime import date, time
from pydantic import BaseModel


class BookingCreate(BaseModel):
    test_id: int
    booking_date: date
    booking_time: time
    status: str = "Pending"


class BookingResponse(BaseModel):
    booking_id: int
    user_id: int
    test_id: int
    booking_date: date
    booking_time: time
    status: str

    class Config:
        from_attributes = True