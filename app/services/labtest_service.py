from sqlalchemy.orm import Session

from app.models.labtest import LabTest


def create_lab_test(db: Session, lab_test):
    new_test = LabTest(
        test_name=lab_test.test_name,
        category=lab_test.category,
        price=lab_test.price,
        description=lab_test.description
    )

    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    return new_test


def get_all_lab_tests(db: Session):
    return db.query(LabTest).all()