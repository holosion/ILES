"""Database models for accounts, interns, weekly reports, logs, and evaluations."""

import random

from django.contrib.auth.hashers import check_password, make_password
from django.db import models


class Account(models.Model):
    ROLE_COMPANY = "company"
    ROLE_LECTURER = "lecturer"

    ROLE_CHOICES = [
        (ROLE_COMPANY, "Company"),
        (ROLE_LECTURER, "Lecturer"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    name = models.CharField(max_length=140)
    company_name = models.CharField(max_length=180, blank=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255, blank=True)
    verification_code = models.CharField(max_length=6, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    @staticmethod
    def generate_code():
        return f"{random.randint(100000, 999999)}"

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

    @property
    def display_name(self):
        return self.company_name if self.role == self.ROLE_COMPANY else self.name

    def __str__(self):
        return f"{self.display_name} ({self.get_role_display()})"


class StudentProfile(models.Model):
    company = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="students")
    name = models.CharField(max_length=140)
    registration_number = models.CharField(max_length=80)
    university = models.CharField(max_length=160)
    internship_months = models.PositiveIntegerField(default=3)
    photo = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        unique_together = ["company", "registration_number"]

    def __str__(self):
        return f"{self.name} - {self.registration_number}"


class WeeklyReport(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="reports")
    week_number = models.PositiveIntegerField()
    week_start = models.DateField()
    week_end = models.DateField()
    attendance_days = models.PositiveIntegerField(default=0)
    activities = models.TextField()
    company_comments = models.TextField(blank=True)
    lecturer_mark = models.PositiveIntegerField(null=True, blank=True)
    lecturer_comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["student__name", "week_number"]
        unique_together = ["student", "week_number"]

    @property
    def grade(self):
        if self.lecturer_mark is None:
            return "Pending"
        if self.lecturer_mark >= 80:
            return "A"
        if self.lecturer_mark >= 70:
            return "B"
        if self.lecturer_mark >= 60:
            return "C"
        if self.lecturer_mark >= 50:
            return "D"
        return "Needs Support"

    def __str__(self):
        return f"{self.student.name} - Week {self.week_number}"


class WeeklyLog(models.Model):  # A model class becomes a database table.
    STATUS_DRAFT = "Draft"  # Constant for the Draft workflow state.
    STATUS_SUBMITTED = "Submitted"  # Constant for the Submitted workflow state.
    STATUS_REVIEWED = "Reviewed"  # Constant for the Reviewed workflow state.
    STATUS_APPROVED = "Approved"  # Constant for the Approved workflow state.

    STATUS_CHOICES = [  # Choices limit status values to the approved workflow names.
        (STATUS_DRAFT, "Draft"),  # Draft means the student can still edit the log.
        (STATUS_SUBMITTED, "Submitted"),  # Submitted means the log waits for review.
        (STATUS_REVIEWED, "Reviewed"),  # Reviewed means a supervisor has checked it.
        (STATUS_APPROVED, "Approved"),  # Approved means the log is accepted.
    ]

    week = models.PositiveIntegerField()  # Stores the internship week number.
    activity = models.TextField()  # Stores the main work/activity description.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)  # Stores workflow state.
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically stores when the row was created.

    class Meta:  # Meta stores optional model settings.
        ordering = ["-created_at"]  # Newest logs appear first in API responses.

    def __str__(self):  # This controls how the object appears in Django admin.
        return f"Week {self.week} - {self.status}"  # Return a readable label.


class Evaluation(models.Model):  # This model becomes the evaluations table.
    student = models.CharField(max_length=120)  # Stores the student intern's name.
    technical = models.PositiveIntegerField()  # Stores the technical score out of 100.
    communication = models.PositiveIntegerField()  # Stores the communication score out of 100.
    attendance = models.PositiveIntegerField()  # Stores the attendance score out of 100.
    total = models.PositiveIntegerField(blank=True, default=0)  # Stores the calculated total score.
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically stores when the row was created.

    class Meta:  # Meta stores optional model settings.
        ordering = ["-created_at"]  # Newest evaluations appear first in API responses.

    def save(self, *args, **kwargs):  # save runs whenever an evaluation is created or updated.
        self.total = self.technical + self.communication + self.attendance  # Calculate total before saving.
        super().save(*args, **kwargs)  # Let Django perform the real database save.

    def __str__(self):  # This controls how the object appears in Django admin.
        return f"{self.student} - {self.total}"  # Return a readable label.
