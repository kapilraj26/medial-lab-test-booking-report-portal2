# Problem Statement

## 1. Title
Medical Lab Test Booking & Report Portal

## 2. Domain
Healthcare / Medical Diagnostics

## 3. Who is the user?
1. Patient – Books lab tests, views reports, and tracks appointments.
2. Lab Technician – Manages test requests, uploads test results, and updates report status.
3. Admin – Manages users, laboratories, test categories, bookings, and system reports.

## 4. What problem are we solving?
Many diagnostic laboratories still rely on manual appointment booking and paper-based report distribution, which leads to long waiting times, misplaced records, and inefficient management. Patients often need to visit the laboratory multiple times to schedule tests and collect reports. Laboratory staff also spend considerable time maintaining records manually. This project provides a secure web portal where patients can book laboratory tests online, while laboratory staff upload reports digitally, allowing patients to access them anytime.

## 5. Proposed Solution
The application will provide:
- User registration and secure login.
- Search and book medical lab tests online.
- Appointment scheduling with available time slots.
- Test booking confirmation and status tracking.
- Lab technician dashboard to upload test reports.
- Patients can download reports in PDF format.
- Admin dashboard to manage users, tests, appointments, and reports.
- Notification for booking confirmation and report availability.

## 6. Core Entities / Database Tables
1. Users
2. Patients
3. Lab_Tests
4. Appointments
5. Test_Reports
6. Payments
7. Laboratories
8. Notifications

## 7. User Roles & Permissions

### Admin
- Manage users
- Manage lab tests
- Manage laboratories
- View all bookings
- Generate reports

### Patient
- Register/Login
- Book lab tests
- View appointments
- Download reports
- View booking history

### Lab Technician
- View assigned appointments
- Upload test reports
- Update report status

## 8. Success Criteria
- Patients should be able to book a lab test in under one minute.
- Appointment confirmation should be generated instantly.
- Test reports should be securely available online after upload.
- Admin should be able to manage all users and bookings efficiently.
- The system should reduce paperwork and improve appointment management.

## 9. Out of Scope
- Online doctor consultation.
- Pharmacy and medicine ordering.
- Emergency ambulance services.
- AI-based disease prediction.
- Integration with wearable health devices.

## 10. Chosen Track
Python (FastAPI)