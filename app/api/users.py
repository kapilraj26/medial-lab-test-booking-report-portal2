from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.core.database import get_db
from app.core.security import get_current_user_email

from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    UserUpdate,
    PasswordChange,
    ForgotPassword,
    ResetPassword,
    RoleUpdate
)

from app.services.user_service import (
    create_user,
    get_all_users,
    login_user,
    update_user,
    change_password,
    forgot_password,
    reset_password,
    update_user_role
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ==========================================
# REGISTER USER
# ==========================================

@router.post(
    "/",
    response_model=UserResponse
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    result = create_user(
        db,
        user
    )

    if result is None:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain at least 8 characters, "
                "one uppercase letter, one lowercase letter, "
                "one number, and one special character"
            )
        )

    return result


# ==========================================
# ADMIN - VIEW ALL USERS
# ==========================================

@router.get(
    "/",
    response_model=list[UserResponse]
)
def view_users(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin")
    )
):

    return get_all_users(db)


# ==========================================
# LOGIN
# ==========================================

@router.post(
    "/login"
)
def login(
    login: UserLogin,
    db: Session = Depends(get_db)
):

    result = login_user(
        db,
        login
    )

    if result is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result


# ==========================================
# MY PROFILE
# ==========================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user_email: str = Depends(
        get_current_user_email
    ),
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


# ==========================================
# UPDATE MY PROFILE
# ==========================================

@router.put(
    "/me",
    response_model=UserResponse
)
def update_my_profile(
    user_data: UserUpdate,
    current_user_email: str = Depends(
        get_current_user_email
    ),
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


# ==========================================
# CHANGE PASSWORD
# ==========================================

@router.put(
    "/change-password"
)
def change_my_password(
    password_data: PasswordChange,
    current_user_email: str = Depends(
        get_current_user_email
    ),
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


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post(
    "/forgot-password"
)
def forgot_password_request(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):

    reset_token = forgot_password(
        db,
        data.email
    )

    if reset_token is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Reset token generated",
        "reset_token": reset_token
    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post(
    "/reset-password"
)
def reset_password_request(
    data: ResetPassword,
    db: Session = Depends(get_db)
):

    success, message = reset_password(
        db,
        data.reset_token,
        data.new_password
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail=message
        )

    return {
        "message": message
    }


# ==========================================
# ADMIN - CHANGE USER ROLE
# ==========================================

@router.put(
    "/{user_id}/role",
    response_model=UserResponse
)
def change_user_role(
    user_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin")
    )
):

    user, error = update_user_role(
        db,
        user_id,
        role_data.role
    )

    if error:

        if error == "User not found":

            raise HTTPException(
                status_code=404,
                detail=error
            )

        raise HTTPException(
            status_code=400,
            detail=error
        )

    return user