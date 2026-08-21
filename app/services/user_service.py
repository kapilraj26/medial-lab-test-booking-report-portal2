from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from app.models.user import User
from app.core.auth import hash_password, verify_password,validate_password
from app.core.security import create_access_token


def create_user(db: Session, user):

    if not validate_password(user.password):
        return None

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
        role="Patient"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_all_users(db: Session):
    return db.query(User).all()


def update_user(db: Session, user_id: int, user_data):

    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if user is None:
        return None

    user.full_name = user_data.full_name
    user.phone = user_data.phone

    db.commit()
    db.refresh(user)

    return user

def change_password(
    db: Session,
    user_id: int,
    current_password: str,
    new_password: str
):

    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if user is None:
        return None, "User not found"

    # Verify current password
    if not verify_password(
        current_password,
        user.password
    ):
        return None, "Current password is incorrect"

    # Hash new password
    user.password = hash_password(new_password)

    db.commit()
    db.refresh(user)

    return user, None

def forgot_password(db: Session, email: str):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        return None

    # Generate secure random token
    reset_token = secrets.token_urlsafe(32)

    # Token valid for 15 minutes
    reset_token_expiry = datetime.utcnow() + timedelta(
        minutes=15
    )

    user.reset_token = reset_token
    user.reset_token_expiry = reset_token_expiry

    db.commit()
    db.refresh(user)

    return reset_token

def reset_password(
    db: Session,
    reset_token: str,
    new_password: str
):

    user = db.query(User).filter(
        User.reset_token == reset_token
    ).first()

    if user is None:
        return False, "Invalid reset token"

    # Check token expiry
    if (
        user.reset_token_expiry is None
        or user.reset_token_expiry < datetime.utcnow()
    ):
        return False, "Reset token has expired"

    # Hash new password
    user.password = hash_password(new_password)

    # Clear reset token after successful reset
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()
    db.refresh(user)

    return True, "Password reset successfully"


def login_user(db: Session, login):

    print("LOGIN EMAIL:", login.email)

    user = db.query(User).filter(
        User.email == login.email
    ).first()

    if user is None:
        print("USER NOT FOUND")
        return None

    print("USER FOUND:", user.email)

    password_ok = verify_password(
        login.password,
        user.password
    )

    print("PASSWORD OK:", password_ok)

    if not password_ok:
        return None

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "role": user.role
    }

def update_user_role(
    db: Session,
    user_id: int,
    role: str
):
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if user is None:
        return None, "User not found"

    allowed_roles = [
        "Patient",
        "Staff",
        "Admin"
    ]

    if role not in allowed_roles:
        return None, "Invalid role"

    user.role = role

    db.commit()
    db.refresh(user)

    return user, None