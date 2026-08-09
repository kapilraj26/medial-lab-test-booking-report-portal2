from pydantic import BaseModel


class LabTestCreate(BaseModel):
    test_name: str
    category: str
    price: float
    description: str


class LabTestResponse(BaseModel):
    test_id: int
    test_name: str
    category: str
    price: float
    description: str

    class Config:
        from_attributes = True