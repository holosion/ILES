"""App-level API routes for internship records."""  # This file defines URLs owned by the internship app.

from django.urls import path  # path defines simple URL patterns.
from rest_framework.routers import DefaultRouter  # Router automatically creates CRUD routes for ViewSets.

from .views import (
    AccountViewSet,
    EvaluationViewSet,
    StudentProfileViewSet,
    WeeklyLogViewSet,
    WeeklyReportViewSet,
    dashboard_stats,
    login_account,
    register_account,
    verify_account,
)

router = DefaultRouter()  # Create a DRF router for beginner-friendly CRUD routing.
router.register("accounts", AccountViewSet, basename="accounts")
router.register("students", StudentProfileViewSet, basename="students")
router.register("weekly-reports", WeeklyReportViewSet, basename="weekly-reports")
router.register("logs", WeeklyLogViewSet, basename="logs")  # Creates /logs/ and /logs/<id>/ routes.
router.register("evaluations", EvaluationViewSet, basename="evaluations")  # Creates /evaluations/ and /evaluations/<id>/ routes.

urlpatterns = [  # Extra routes that are not created by the router.
    path("dashboard/", dashboard_stats, name="dashboard-stats"),  # /api/dashboard/ returns summary statistics.
    path("auth/register/", register_account, name="register-account"),
    path("auth/verify/", verify_account, name="verify-account"),
    path("auth/login/", login_account, name="login-account"),
]

urlpatterns += router.urls  # Add router-generated CRUD URLs to urlpatterns.
