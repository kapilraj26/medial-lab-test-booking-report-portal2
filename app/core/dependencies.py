from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError

from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import security


def get_current_user(
    credentials=Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        role = payload.get("role")

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Role not found in token"
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# ==========================================
# ROLE BASED ACCESS CONTROL
# ==========================================

def require_role(required_role: str):

    def role_checker(
        current_user=Depends(get_current_user)
    ):

        user_role = current_user.get("role")

        if user_role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return current_user

    return role_checker


# ==========================================
# ALLOW MULTIPLE ROLES
# ==========================================

def require_roles(*allowed_roles: str):

    def role_checker(
        current_user=Depends(get_current_user)
    ):

        user_role = current_user.get("role")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return current_user

    return role_checker