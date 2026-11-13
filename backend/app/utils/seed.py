from datetime import date
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User
from app.models.employee import Employee

SAMPLE_EMPLOYEES = [
    {
        "name": "Sarah Connor",
        "email": "sarah.connor@example.com",
        "phone": "+1-555-0101",
        "department": "Engineering",
        "designation": "Staff Software Engineer",
        "joining_date": date(2022, 3, 15),
        "status": "Active"
    },
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0102",
        "department": "Engineering",
        "designation": "Backend Developer",
        "joining_date": date(2023, 1, 10),
        "status": "Active"
    },
    {
        "name": "Emma Watson",
        "email": "emma.watson@example.com",
        "phone": "+1-555-0103",
        "department": "Human Resources",
        "designation": "HR Manager",
        "joining_date": date(2021, 6, 1),
        "status": "Active"
    },
    {
        "name": "Michael Scott",
        "email": "michael.scott@dundermifflin.com",
        "phone": "+1-555-0104",
        "department": "Sales",
        "designation": "Regional Manager",
        "joining_date": date(2020, 4, 1),
        "status": "Inactive"
    },
    {
        "name": "Jim Halpert",
        "email": "jim.halpert@dundermifflin.com",
        "phone": "+1-555-0105",
        "department": "Sales",
        "designation": "Senior Sales Executive",
        "joining_date": date(2021, 8, 12),
        "status": "Active"
    },
    {
        "name": "Pam Beesly",
        "email": "pam.beesly@dundermifflin.com",
        "phone": "+1-555-0106",
        "department": "Operations",
        "designation": "Office Administrator",
        "joining_date": date(2021, 9, 5),
        "status": "Active"
    },
    {
        "name": "Alex Morgan",
        "email": "alex.morgan@example.com",
        "phone": "+1-555-0107",
        "department": "Marketing",
        "designation": "Marketing Lead",
        "joining_date": date(2022, 11, 20),
        "status": "Active"
    },
    {
        "name": "David Wallace",
        "email": "david.wallace@example.com",
        "phone": "+1-555-0108",
        "department": "Finance",
        "designation": "Chief Financial Officer",
        "joining_date": date(2019, 2, 14),
        "status": "Active"
    },
    {
        "name": "Dwight Schrute",
        "email": "dwight.schrute@dundermifflin.com",
        "phone": "+1-555-0109",
        "department": "Sales",
        "designation": "Assistant to the Regional Manager",
        "joining_date": date(2020, 5, 10),
        "status": "Active"
    },
    {
        "name": "Angela Martin",
        "email": "angela.martin@example.com",
        "phone": "+1-555-0110",
        "department": "Finance",
        "designation": "Senior Accountant",
        "joining_date": date(2021, 1, 18),
        "status": "Inactive"
    },
    {
        "name": "Toby Flenderson",
        "email": "toby.flenderson@example.com",
        "phone": "+1-555-0111",
        "department": "Human Resources",
        "designation": "HR Representative",
        "joining_date": date(2018, 7, 23),
        "status": "Inactive"
    },
    {
        "name": "Ryan Howard",
        "email": "ryan.howard@example.com",
        "phone": "+1-555-0112",
        "department": "Product",
        "designation": "Product Manager",
        "joining_date": date(2023, 9, 1),
        "status": "Active"
    }
]


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        admin = db.query(User).filter(User.email == settings.INITIAL_ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.INITIAL_ADMIN_EMAIL,
                username=settings.INITIAL_ADMIN_USERNAME,
                hashed_password=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print(f"[Seed] Created initial admin: {settings.INITIAL_ADMIN_EMAIL}")

        if db.query(Employee).count() == 0:
            for emp_data in SAMPLE_EMPLOYEES:
                emp = Employee(**emp_data)
                db.add(emp)
            db.commit()
            print(f"[Seed] Successfully seeded {len(SAMPLE_EMPLOYEES)} sample employees.")
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    print("Running database seed script...")
    seed_database()
    print("Database seeding completed.")

