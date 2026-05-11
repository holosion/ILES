"""Application configuration for the internship app."""  # Django reads this app metadata.

from django.apps import AppConfig  # AppConfig is Django's base class for app settings.


class InternshipConfig(AppConfig):  # This class describes our app to Django.
    default_auto_field = "django.db.models.BigAutoField"  # Use large integer IDs by default.
    name = "internship"  # This is the Python path to the app.
    verbose_name = "Internship Logging and Evaluation"  # This friendly name appears in the admin.
