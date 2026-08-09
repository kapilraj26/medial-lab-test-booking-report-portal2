from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id")
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id")
    )

    rating = Column(
        Integer,
        nullable=False
    )

    comments = Column(
        String(255)
    )

    user = relationship("User")