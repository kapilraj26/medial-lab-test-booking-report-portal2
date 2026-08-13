from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_email
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    UserUpdate,
    PasswordChange
)

from app.services.user_service import (
    create_user,
    get_all_users,
    login_user,
    update_user,
    change_password
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(db, user)


@router.get("/", response_model=list[UserResponse])
def view_users(
    db: Session = Depends(get_db)
):
    return get_all_users(db)


@router.post("/login")
def login(
    login: UserLogin,
    db: Session = Depends(get_db)
):
    result = login_user(db, login)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result


# DAY 12 - MY PROFILE
@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user_email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == current_user_email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# DAY 13 - UPDATE MY PROFILE
@router.put("/me", response_model=UserResponse)
def update_my_profile(
    user_data: UserUpdate,
    current_user_email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == current_user_email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    updated_user = update_user(
        db,
        user.user_id,
        user_data
    )

    return updated_user

# DAY 14 - CHANGE PASSWORD
@router.put("/change-password")
def change_my_password(
    password_data: PasswordChange,
    current_user_email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == current_user_email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    updated_user, error = change_password(
        db,
        user.user_id,
        password_data.current_password,
        password_data.new_password
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return {
        "message": "Password changed successfully"
    }