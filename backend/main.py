from fastapi import FastAPI
from app.api.users import router as user_router
from app.core.database import Base, engine
from app.models.user import User
from app.models.labtest import LabTest
from app.models.booking import Booking
from app.models.report import Report
from app.models.feedback import Feedback
from app.api.labtests import router as labtest_router
from app.api.booking import router as booking_router
from app.api.reports import router as report_router
from app.api.feedback import router as feedback_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical Lab Test Booking & Report Portal",
    version="1.0.0",
    description="Backend API for Medical Lab Test Booking & Report Portal"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router)
app.include_router(labtest_router)
app.include_router(booking_router)
app.include_router(report_router)
app.include_router(feedback_router)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Welcome to Medical Lab Test Booking & Report Portal"
    }