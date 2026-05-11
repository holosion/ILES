"""Small API tests for the beginner ILES backend."""  # Tests prove important backend behavior works.

from django.test import TestCase  # TestCase gives each test a clean test database.
from rest_framework.test import APIClient  # APIClient lets tests call DRF endpoints.

from .models import Evaluation, WeeklyLog  # Import models used by the tests.


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
