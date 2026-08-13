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