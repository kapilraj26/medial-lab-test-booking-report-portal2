from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_email
from app.core.dependencies import (
    get_current_user,
    require_roles
)

from app.schemas.report import (
    ReportCreate,
    ReportResponse
)

from app.services.report_service import (
    create_report,
    get_reports
)


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ==========================================
# STAFF / ADMIN - UPLOAD REPORT
# ==========================================

@router.post(
    "/",
    response_model=ReportResponse
)
def add_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("Staff", "Admin")
    )
):

    result, error = create_report(
        db,
        report
    )

    if error == "Booking not found":
        raise HTTPException(
            status_code=404,
            detail=error
        )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return result


# ==========================================
# PATIENT / AUTHENTICATED USER - OWN REPORTS
# ==========================================

@router.get(
    "/",
    response_model=list[ReportResponse]
)
def view_reports(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(
        get_current_user_email
    )
):

    reports = get_reports(
        db,
        current_user_email
    )

    if reports is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return reports