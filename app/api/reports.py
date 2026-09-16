from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session
from pathlib import Path
from fastapi.responses import Response
from datetime import date

from app.core.database import get_db
from app.core.security import get_current_user_email
from app.core.dependencies import require_roles
from app.schemas.report import ReportResponse

from app.services.report_service import (
    create_report,
    get_reports,
    get_all_reports
)

from app.models.user import User
from app.models.booking import Booking
from app.models.report import Report


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


UPLOAD_DIR = Path("uploads/reports")
UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# STAFF / ADMIN - UPLOAD REPORT
# =========================================================

@router.post(
    "/",
    response_model=ReportResponse
)
async def add_report(
    booking_id: int = Form(...),
    result: str = Form(...),
    report_date: date = Form(...),
    report_file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles("Staff", "Admin")
    )
):

    # Check PDF
    if report_file.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )


    # Check filename
    if not report_file.filename:

        raise HTTPException(
            status_code=400,
            detail="Please select a PDF file"
        )


    # Create filename
    file_name = (
        f"booking_{booking_id}_"
        f"{report_file.filename}"
    )

    file_path = UPLOAD_DIR / file_name


    # Read uploaded file
    file_content = await report_file.read()


    # Save file
    with open(
        file_path,
        "wb"
    ) as file:

        file.write(file_content)


    # Create report data
    report_data = type(
        "ReportData",
        (),
        {
            "booking_id": booking_id,
            "report_file": str(
                file_path
            ).replace("\\", "/"),
            "result": result,
            "report_date": report_date
        }
    )()


    # Save database record
    result_data, error = create_report(
        db,
        report_data
    )


    # Booking not found
    if error == "Booking not found":

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=404,
            detail=error
        )


    # Other errors
    if error:

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=400,
            detail=error
        )


    return result_data


# =========================================================
# PATIENT - VIEW OWN REPORTS
# =========================================================

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

    user = db.query(User).filter(
        User.email == current_user_email
    ).first()


    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # Patient gets only own reports
    if user.role == "Patient":

        reports = get_reports(
            db,
            current_user_email
        )

        return reports


    # Staff/Admin gets all reports
    return get_all_reports(db)


# =========================================================
# STAFF / ADMIN - VIEW ALL REPORTS
# =========================================================

@router.get(
    "/all",
    response_model=list[ReportResponse]
)
def view_all_reports(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles("Staff", "Admin")
    )

):

    return get_all_reports(db)


# =========================================================
# VIEW / DOWNLOAD PDF REPORT
# =========================================================

@router.get(
    "/file/{filename}"
)
def view_report_file(

    filename: str,

    db: Session = Depends(get_db),

    current_user_email: str = Depends(
        get_current_user_email
    )

):

    # =====================================================
    # GET CURRENT USER
    # =====================================================

    user = db.query(User).filter(
        User.email == current_user_email
    ).first()


    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # =====================================================
    # SAFE FILE PATH
    # =====================================================

    safe_filename = Path(
        filename
    ).name

    file_path = (
        UPLOAD_DIR / safe_filename
    )


    # =====================================================
    # FIND REPORT
    # =====================================================

    report = db.query(Report).filter(
        (
            Report.report_file ==
            safe_filename
        )
        |
        (
            Report.report_file ==
            str(file_path).replace(
                "\\",
                "/"
            )
        )
    ).first()


    if report is None:

        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )


    # =====================================================
    # FIND BOOKING
    # =====================================================

    booking = db.query(Booking).filter(
        Booking.booking_id ==
        report.booking_id
    ).first()


    if booking is None:

        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )


    print(
        "PDF SECURITY:",
        "current_user_id =",
        user.user_id,
        "role =",
        user.role,
        "booking_user_id =",
        booking.user_id,
        "report_id =",
        report.report_id
    )


    # =====================================================
    # ACCESS CONTROL
    # =====================================================

    # Patient can access ONLY own report
    if user.role == "Patient":

        if booking.user_id != user.user_id:

            raise HTTPException(
                status_code=403,
                detail=(
                    "You are not allowed "
                    "to access this report"
                )
            )


    # Staff/Admin can access reports
    elif user.role in [
        "Staff",
        "Admin"
    ]:

        pass


    # Unknown role
    else:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )


    # =====================================================
    # CHECK PHYSICAL FILE
    # =====================================================

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Report file not found"
        )


    # =====================================================
    # READ PDF
    # =====================================================

    with open(
        file_path,
        "rb"
    ) as file:

        pdf_data = file.read()


    # =====================================================
    # RETURN PDF
    # =====================================================

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'inline; filename="{safe_filename}"'
        }
    )