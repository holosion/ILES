"""Small API tests for the beginner ILES backend."""  # Tests prove important backend behavior works.

from django.test import TestCase  # TestCase gives each test a clean test database.
from rest_framework.test import APIClient  # APIClient lets tests call DRF endpoints.

from .models import Account, Evaluation, StudentProfile, WeeklyLog, WeeklyReport  # Import models used by the tests.


class InternshipApiTests(TestCase):  # Group related API tests in one class.
    def setUp(self):  # setUp runs before each test method.
        self.client = APIClient()  # Create a fake API client.

    def test_create_weekly_log(self):  # Test that a weekly log can be created through the API.
        response = self.client.post("/api/logs/", {"week": 1, "activity": "Built API", "status": "Draft"}, format="json")  # POST JSON.
        self.assertEqual(response.status_code, 201)  # 201 means the object was created.
        self.assertEqual(WeeklyLog.objects.count(), 1)  # Confirm one row exists in the database.

    def test_create_evaluation_calculates_total(self):  # Test that the backend calculates totals.
        response = self.client.post(  # POST an evaluation request.
            "/api/evaluations/",  # Evaluations endpoint.
            {"student": "Demo Student", "technical": 80, "communication": 70, "attendance": 90},  # Input scores.
            format="json",  # Tell DRF this is JSON data.
        )
        self.assertEqual(response.status_code, 201)  # 201 means the object was created.
        self.assertEqual(Evaluation.objects.first().total, 240)  # Total should equal 80 + 70 + 90.

    def test_unverified_login_returns_verification_code(self):
        account = Account(role=Account.ROLE_LECTURER, name="Demo Lecturer", email="lecturer@example.com")
        account.set_password("secret123")
        account.verification_code = "123456"
        account.save()

        response = self.client.post(
            "/api/auth/login/",
            {"email": "lecturer@example.com", "password": "secret123"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertIn("verification_code", response.data)

    def test_weekly_report_uses_makerere_grade_and_final_mark(self):
        company = Account.objects.create(
            role=Account.ROLE_COMPANY,
            name="Demo Company",
            company_name="Demo Company",
            email="company@example.com",
            is_verified=True,
        )
        student = StudentProfile.objects.create(
            company=company,
            name="Demo Student",
            registration_number="REG-001",
            university="Makerere University",
            internship_months=3,
        )
        WeeklyReport.objects.create(
            student=student,
            week_number=1,
            week_start="2026-05-11",
            week_end="2026-05-17",
            attendance_days=6,
            activities="Completed weekly tasks.",
            lecturer_mark=92,
        )
        WeeklyReport.objects.create(
            student=student,
            week_number=2,
            week_start="2026-05-18",
            week_end="2026-05-24",
            attendance_days=5,
            activities="Prepared documentation.",
            lecturer_mark=78,
        )

        self.assertEqual(student.final_mark, 85)
        self.assertEqual(student.final_grade, "A")
