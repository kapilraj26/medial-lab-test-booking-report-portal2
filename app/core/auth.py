import re
import bcrypt


def validate_password(password: str) -> bool:

    if len(password) < 8:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    if not re.search(r"[0-9]", password):
        return False

    if not re.search(r"[^A-Za-z0-9]", password):
        return False

    return True

def hash_password(password: str) -> str:
    password_bytes=password.encode("utf-8")

    if len(password_bytes) > 72:
        raise ValueError("Password cannot be longer than 72 bytes")

    hashed=bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    password_bytes=plain_password.encode("utf-8")
    hashed_bytes=hashed_password.encode("utf-8")

    if len(password_bytes)>72:
        return False

    return bcrypt.checkpw(
        password_bytes,
        hashed_bytes
    )