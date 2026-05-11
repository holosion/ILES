"""Project-level URL routes for ILES."""  # This file connects top-level URLs to apps.

from django.contrib import admin  # Import Django's admin site.
from django.urls import include, path  # include joins app URLs; path defines routes.

urlpatterns = [  # Django checks these routes from top to bottom.
    path("admin/", admin.site.urls),  # /admin/ opens Django's built-in admin dashboard.
    path("api/", include("internship.urls")),  # /api/ sends API requests to the internship app.
]
