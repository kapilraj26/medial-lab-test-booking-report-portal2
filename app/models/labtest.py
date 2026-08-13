from sqlalchemy import Column, Integer, String, Float

from app.core.database import Base


class LabTest(Base):
    __tablename__ = "lab_tests"

    test_id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    test_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(255))