from sqlalchemy.orm import Session

from app.models.user import User
from app.core.auth import hash_password, verify_password
from app.core.security import create_access_token


def create_user(db: Session, user):

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
        role=user.role
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
        "user_id": user.user_id
    }