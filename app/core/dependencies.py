from fastapi import Depends, HTTPException
from jose import jwt, JWTError

from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import security


def get_current_user(
    credentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )