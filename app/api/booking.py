from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import create_booking, get_all_bookings

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.post("/", response_model=BookingResponse)
def add_booking(
    booking: BookingCreate,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_booking(db, booking)


@router.get("/", response_model=list[BookingResponse])
def view_bookings(
    db: Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_bookings(db)