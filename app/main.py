from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as user_router
from app.api.labtests import router as labtest_router
from app.api.booking import router as booking_router
from app.api.reports import router as report_router
from app.api.feedback import router as feedback_router
from app.api.admin import router as admin_router

from app.core.database import Base, engine

from app.models.user import User
from app.models.labtest import LabTest
from app.models.booking import Booking
from app.models.report import Report
from app.models.feedback import Feedback


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Medical Lab Test Booking & Report Portal",
    version="1.0.0",
    description="Backend API for Medical Lab Test Booking & Report Portal"
)


# ==========================================
# STATIC FILES
# ==========================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://medical-lab-frontend-1ztq.onrender.com"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)


# ==========================================
# API ROUTES
# ==========================================

app.include_router(user_router)
app.include_router(labtest_router)
app.include_router(booking_router)
app.include_router(report_router)
app.include_router(feedback_router)
app.include_router(admin_router)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": (
            "Welcome to Medical Lab Test "
            "Booking & Report Portal"
        )
    }