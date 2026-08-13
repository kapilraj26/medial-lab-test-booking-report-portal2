from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services.user_service import (
    create_user,
    get_all_users,
    login_user
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)


@router.get("/", response_model=list[UserResponse])
def view_users(db: Session = Depends(get_db)):
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