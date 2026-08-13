from sqlalchemy import Column, Integer, Date, Time, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True,autoincrement=True)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    test_id = Column(Integer, ForeignKey("lab_tests.test_id"))

    booking_date = Column(Date, nullable=False)
    booking_time = Column(Time, nullable=False)

    status = Column(String(20), default="Pending")

    user = relationship("User")
    lab_test = relationship("LabTest")