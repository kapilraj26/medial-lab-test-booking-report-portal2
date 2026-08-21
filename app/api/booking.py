from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_roles
)

from app.core.database import get_db

from app.schemas.booking import (
    BookingCreate,
    BookingResponse
)

from app.services.booking_service import (
    create_booking,
    get_all_bookings,
    get_user_bookings,
    update_booking_status
)

from app.models.user import User


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


# ==========================================
# CREATE BOOKING
# ==========================================

@router.post(
    "/",
    response_model=BookingResponse
)
def add_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user_email = current_user.get("sub")

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return create_booking(
        db,
        booking,
        user.user_id
    )


# ==========================================
# PATIENT - MY BOOKINGS
# ==========================================

@router.get(
    "/",
    response_model=list[BookingResponse]
)
def view_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user_email = current_user.get("sub")

    user = db.query(User).filter(
        User.email == user_email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return get_user_bookings(
        db,
        user.user_id
    )

# ==========================================
# STAFF / ADMIN - VIEW ALL BOOKINGS
# ==========================================

@router.get(
    "/all",
    response_model=list[BookingResponse]
)
def view_all_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("Staff", "Admin")
    )
):
    return get_all_bookings(db)
# ==========================================
# STAFF / ADMIN - UPDATE BOOKING STATUS
# ==========================================

@router.put(
    "/{booking_id}/status",
    response_model=BookingResponse
)
def change_booking_status(
    booking_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("Staff", "Admin")
    )
):

    booking, error = update_booking_status(
        db,
        booking_id,
        new_status
    )

    if error == "Booking not found":
        raise HTTPException(
            status_code=404,
            detail=error
        )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return booking