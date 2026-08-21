from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
    require_roles
)

from app.schemas.labtest import (
    LabTestCreate,
    LabTestResponse
)

from app.services.labtest_service import (
    create_lab_test,
    get_all_lab_tests
)


router = APIRouter(
    prefix="/labtests",
    tags=["LabTests"]
)


# ==========================================
# STAFF / ADMIN - CREATE LAB TEST
# ==========================================

@router.post(
    "/",
    response_model=LabTestResponse
)
def add_lab_test(
    lab_test: LabTestCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("Staff", "Admin")
    )
):

    return create_lab_test(
        db,
        lab_test
    )


# ==========================================
# ALL AUTHENTICATED USERS - VIEW LAB TESTS
# ==========================================

@router.get(
    "/",
    response_model=list[LabTestResponse]
)
def view_lab_tests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_all_lab_tests(db)