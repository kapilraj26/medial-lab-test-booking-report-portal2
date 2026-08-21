from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str

    model_config = {
        "from_attributes": True
    }


class UserUpdate(BaseModel):
    full_name: str
    phone: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    reset_token: str
    new_password: str

class RoleUpdate(BaseModel):
    role: str