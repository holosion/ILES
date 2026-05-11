"""Serializers convert model objects to JSON and JSON back to model objects."""

from datetime import timedelta

from rest_framework import serializers

from .models import Account, Evaluation, StudentProfile, WeeklyLog, WeeklyReport


class AccountSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Account
        fields = [
            "id",
            "role",
            "name",
            "company_name",
            "email",
            "is_verified",
            "display_name",
            "created_at",
        ]
        read_only_fields = ["id", "is_verified", "display_name", "created_at"]


class StudentProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.display_name", read_only=True)
    report_count = serializers.IntegerField(source="reports.count", read_only=True)
    graded_report_count = serializers.SerializerMethodField()
    final_mark = serializers.IntegerField(read_only=True)
    final_grade = serializers.CharField(read_only=True)
    final_interpretation = serializers.CharField(read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "company",
            "company_name",
            "name",
            "registration_number",
            "university",
            "internship_months",
            "photo",
            "report_count",
            "graded_report_count",
            "final_mark",
            "final_grade",
            "final_interpretation",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "company_name",
            "report_count",
            "graded_report_count",
            "final_mark",
            "final_grade",
            "final_interpretation",
            "created_at",
        ]

    def get_graded_report_count(self, obj):
        return obj.reports.exclude(lecturer_mark__isnull=True).count()


class WeeklyReportSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(source="student", read_only=True)
    company = serializers.IntegerField(source="student.company_id", read_only=True)
    company_name = serializers.CharField(source="student.company.display_name", read_only=True)
    grade = serializers.CharField(read_only=True)
    interpretation = serializers.CharField(read_only=True)

    class Meta:
        model = WeeklyReport
        fields = [
            "id",
            "student",
            "student_profile",
            "company",
            "company_name",
            "week_number",
            "week_start",
            "week_end",
            "attendance_days",
            "activities",
            "company_comments",
            "lecturer_mark",
            "lecturer_comments",
            "grade",
            "interpretation",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "student_profile",
            "company",
            "company_name",
            "grade",
            "interpretation",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {"week_end": {"required": False}}

    def validate_attendance_days(self, value):
        if value > 7:
            raise serializers.ValidationError("Attendance must be between 0 and 7 days.")
        return value

    def validate_lecturer_mark(self, value):
        if value is not None and (value < 1 or value > 100):
            raise serializers.ValidationError("Lecturer mark must be between 1 and 100.")
        return value

    def validate(self, data):
        week_start = data.get("week_start", getattr(self.instance, "week_start", None))
        week_end = data.get("week_end", getattr(self.instance, "week_end", None))

        if week_start and not week_end:
            data["week_end"] = week_start + timedelta(days=6)
        elif week_start and week_end and week_end < week_start:
            raise serializers.ValidationError({"week_end": "Week end cannot be before week start."})
        return data


class WeeklyLogSerializer(serializers.ModelSerializer):  # ModelSerializer builds fields from the model automatically.
    class Meta:  # Meta tells DRF which model and fields to use.
        model = WeeklyLog  # Use the WeeklyLog database model.
        fields = ["id", "week", "activity", "status", "created_at"]  # These fields appear in API JSON.
        read_only_fields = ["id", "created_at"]  # React cannot manually set generated fields.


class EvaluationSerializer(serializers.ModelSerializer):  # This serializer handles evaluation API data.
    class Meta:  # Meta tells DRF which model and fields to use.
        model = Evaluation  # Use the Evaluation database model.
        fields = ["id", "student", "technical", "communication", "attendance", "total", "created_at"]  # API fields.
        read_only_fields = ["id", "total", "created_at"]  # total is calculated by the backend, not typed by users.

    def validate(self, data):  # validate checks incoming JSON before saving it.
        score_fields = ["technical", "communication", "attendance"]  # These fields must be between 0 and 100.
        for field in score_fields:  # Loop through each score field.
            score = data.get(field)  # Read the score from the incoming data.
            if score is not None and (score < 0 or score > 100):  # Check the accepted score range.
                raise serializers.ValidationError({field: "Score must be between 0 and 100."})  # Return a clear error.
        return data  # Return valid data so DRF can save it.
