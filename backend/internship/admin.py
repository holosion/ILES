"""Django admin configuration for ILES models."""  # Admin settings control the /admin/ interface.

from django.contrib import admin  # Import Django admin tools.

from .models import Account, Evaluation, StudentProfile, WeeklyLog, WeeklyReport


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ["id", "display_name", "role", "email", "is_verified", "created_at"]
    list_filter = ["role", "is_verified", "created_at"]
    search_fields = ["name", "company_name", "email"]
    readonly_fields = ["created_at"]


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "registration_number", "university", "company", "internship_months"]
    list_filter = ["university", "company"]
    search_fields = ["name", "registration_number", "university", "company__name", "company__company_name"]


@admin.register(WeeklyReport)
class WeeklyReportAdmin(admin.ModelAdmin):
    list_display = ["id", "student", "week_number", "attendance_days", "lecturer_mark", "grade", "week_start"]
    list_filter = ["week_start", "lecturer_mark"]
    search_fields = ["student__name", "student__registration_number", "activities", "company_comments"]
    readonly_fields = ["grade", "created_at", "updated_at"]


@admin.register(WeeklyLog)  # Register WeeklyLog so it appears in the admin dashboard.
class WeeklyLogAdmin(admin.ModelAdmin):  # This class customizes WeeklyLog admin behavior.
    list_display = ["id", "week", "status", "created_at"]  # Columns shown in the admin list page.
    list_filter = ["status", "created_at"]  # Sidebar filters for quick searching.
    search_fields = ["activity"]  # Search box checks activity text.


@admin.register(Evaluation)  # Register Evaluation so it appears in the admin dashboard.
class EvaluationAdmin(admin.ModelAdmin):  # This class customizes Evaluation admin behavior.
    list_display = ["id", "student", "technical", "communication", "attendance", "total", "created_at"]  # Admin columns.
    search_fields = ["student"]  # Search box checks student names.
    readonly_fields = ["total", "created_at"]  # Admin users can see but not directly edit calculated fields.
