from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id")
    )

    report_file = Column(String(255))
    result = Column(String(255))
    report_date = Column(Date)
    status = Column(
        String(20),
        default="Uploaded"
    )

    booking = relationship("Booking")