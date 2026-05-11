"""API views for ILES CRUD operations, account verification, and dashboard statistics."""

from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Account, Evaluation, StudentProfile, WeeklyLog, WeeklyReport
from .serializers import (
    AccountSerializer,
    EvaluationSerializer,
    StudentProfileSerializer,
    WeeklyLogSerializer,
    WeeklyReportSerializer,
)


class AccountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get("role")
        if role:
            queryset = queryset.filter(role=role)
        return queryset

    @action(detail=True, methods=["get"])
    def students(self, request, pk=None):
        company = self.get_object()
        students = StudentProfile.objects.filter(company=company)
        return Response(StudentProfileSerializer(students, many=True).data)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.select_related("company").prefetch_related("reports")
    serializer_class = StudentProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        company = self.request.query_params.get("company")
        if company:
            queryset = queryset.filter(company_id=company)
        return queryset


class WeeklyReportViewSet(viewsets.ModelViewSet):
    queryset = WeeklyReport.objects.select_related("student", "student__company")
    serializer_class = WeeklyReportSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        student = self.request.query_params.get("student")
        company = self.request.query_params.get("company")
        if student:
            queryset = queryset.filter(student_id=student)
        if company:
            queryset = queryset.filter(student__company_id=company)
        return queryset


class WeeklyLogViewSet(viewsets.ModelViewSet):  # ModelViewSet provides full CRUD for weekly logs.
    queryset = WeeklyLog.objects.all()  # Start with all weekly log rows from SQLite.
    serializer_class = WeeklyLogSerializer  # Use this serializer to convert logs to/from JSON.


class EvaluationViewSet(viewsets.ModelViewSet):  # ModelViewSet provides full CRUD for evaluations.
    queryset = Evaluation.objects.all()  # Start with all evaluation rows from SQLite.
    serializer_class = EvaluationSerializer  # Use this serializer to convert evaluations to/from JSON.


@api_view(["POST"])
def register_account(request):
    role = request.data.get("role")
    name = request.data.get("name", "").strip()
    company_name = request.data.get("company_name", "").strip()
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")
    google_signup = request.data.get("google_signup", False)

    if role not in [Account.ROLE_COMPANY, Account.ROLE_LECTURER]:
        return Response({"detail": "Choose whether this account is for a company or lecturer."}, status=400)
    if not email:
        return Response({"detail": "Email address is required."}, status=400)
    if not password and not google_signup:
        return Response({"detail": "Password is required unless Google signup is selected."}, status=400)
    if role == Account.ROLE_COMPANY and not company_name:
        return Response({"detail": "Company name is required for company accounts."}, status=400)
    if role == Account.ROLE_LECTURER and not name:
        return Response({"detail": "Lecturer name is required for lecturer accounts."}, status=400)
    if Account.objects.filter(email=email).exists():
        return Response({"detail": "An account with this email already exists."}, status=400)

    account = Account(
        role=role,
        name=name or company_name,
        company_name=company_name,
        email=email,
        verification_code=Account.generate_code(),
    )
    account.set_password(password or account.verification_code)
    account.save()

    data = AccountSerializer(account).data
    data["verification_code"] = account.verification_code
    data["message"] = "Verification code sent to email. Use the code to activate this account."
    return Response(data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def verify_account(request):
    email = request.data.get("email", "").strip().lower()
    code = request.data.get("code", "").strip()

    try:
        account = Account.objects.get(email=email)
    except Account.DoesNotExist:
        return Response({"detail": "Account not found."}, status=404)

    if account.verification_code != code:
        return Response({"detail": "Incorrect verification code."}, status=400)

    account.is_verified = True
    account.save(update_fields=["is_verified"])
    return Response(AccountSerializer(account).data)


@api_view(["POST"])
def login_account(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    try:
        account = Account.objects.get(email=email)
    except Account.DoesNotExist:
        return Response({"detail": "Account not found."}, status=404)

    if not account.is_verified:
        return Response({"detail": "Please verify your email before logging in."}, status=403)
    if not account.check_password(password):
        return Response({"detail": "Incorrect password."}, status=400)

    return Response(AccountSerializer(account).data)


@api_view(["GET"])  # This endpoint only accepts GET because it only reads dashboard data.
def dashboard_stats(request):  # request contains details about the browser/API call.
    logs = WeeklyLog.objects.all()  # Read all logs for summary counts.
    evaluations = Evaluation.objects.all()  # Read all evaluations for average score.
    students = StudentProfile.objects.all()
    reports = WeeklyReport.objects.all()
    evaluation_count = evaluations.count()  # Count evaluations once so division is safe.
    total_score = sum(evaluation.total for evaluation in evaluations)  # Add all evaluation totals.
    average_score = round((total_score / evaluation_count) / 3) if evaluation_count else 0  # Convert 300-point totals to a percentage.

    data = {  # Build one JSON object for the dashboard.
        "total_logs": logs.count(),  # Count all logs.
        "draft_logs": logs.filter(status=WeeklyLog.STATUS_DRAFT).count(),  # Count Draft logs.
        "submitted_logs": logs.filter(status=WeeklyLog.STATUS_SUBMITTED).count(),  # Count Submitted logs.
        "reviewed_logs": logs.filter(status=WeeklyLog.STATUS_REVIEWED).count(),  # Count Reviewed logs.
        "approved_logs": logs.filter(status=WeeklyLog.STATUS_APPROVED).count(),  # Count Approved logs.
        "total_evaluations": evaluation_count,  # Count all evaluations.
        "average_score": average_score,  # Send the calculated average score.
        "total_companies": Account.objects.filter(role=Account.ROLE_COMPANY).count(),
        "total_lecturers": Account.objects.filter(role=Account.ROLE_LECTURER).count(),
        "total_students": students.count(),
        "total_reports": reports.count(),
        "graded_reports": reports.exclude(lecturer_mark__isnull=True).count(),
    }
    return Response(data)  # Return the dictionary as JSON.
