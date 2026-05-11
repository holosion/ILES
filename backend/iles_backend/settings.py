"""Settings for the ILES Django backend."""

import os
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent  # BASE_DIR points to the backend folder.

SECRET_KEY = os.environ.get("SECRET_KEY", "beginner-learning-key-change-this-before-real-deployment")

DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
render_hostname = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if render_hostname:
    ALLOWED_HOSTS.append(render_hostname)
extra_allowed_hosts = os.environ.get("ALLOWED_HOSTS", "")
if extra_allowed_hosts:
    ALLOWED_HOSTS.extend([host.strip() for host in extra_allowed_hosts.split(",") if host.strip()])

INSTALLED_APPS = [  # Installed apps tell Django which features are active.
    "django.contrib.admin",  # Enables the built-in admin dashboard.
    "django.contrib.auth",  # Enables users, passwords, and permissions.
    "django.contrib.contenttypes",  # Tracks model types inside Django.
    "django.contrib.sessions",  # Enables browser sessions.
    "django.contrib.messages",  # Enables temporary messages in admin pages.
    "django.contrib.staticfiles",  # Serves CSS, JavaScript, and images for admin/static files.
    "rest_framework",  # Adds Django REST Framework for building APIs.
    "corsheaders",  # Allows the React frontend to call this backend from another port.
    "internship",  # Registers our custom ILES app.
]

MIDDLEWARE = [  # Middleware runs on every request and response.
    "corsheaders.middleware.CorsMiddleware",  # Adds CORS headers before other middleware handles the response.
    "django.middleware.security.SecurityMiddleware",  # Adds basic security protections.
    "whitenoise.middleware.WhiteNoiseMiddleware",  # Serves static files correctly on Render.
    "django.contrib.sessions.middleware.SessionMiddleware",  # Reads and writes session data.
    "django.middleware.common.CommonMiddleware",  # Handles common web behavior such as URL normalization.
    "django.middleware.csrf.CsrfViewMiddleware",  # Protects normal Django forms from CSRF attacks.
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Attaches logged-in user data to requests.
    "django.contrib.messages.middleware.MessageMiddleware",  # Supports one-time messages.
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Helps block clickjacking attacks.
]

ROOT_URLCONF = "iles_backend.urls"  # This tells Django which urls.py starts URL routing.

TEMPLATES = [  # Template settings are needed by the Django admin.
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",  # Use Django's built-in template engine.
        "DIRS": [],  # No custom template folder is needed for this beginner backend.
        "APP_DIRS": True,  # Let Django find templates inside installed apps.
        "OPTIONS": {
            "context_processors": [  # Context processors add useful data to templates.
                "django.template.context_processors.request",  # Adds the current request to templates.
                "django.contrib.auth.context_processors.auth",  # Adds user/auth information.
                "django.contrib.messages.context_processors.messages",  # Adds admin messages.
            ],
        },
    },
]

WSGI_APPLICATION = "iles_backend.wsgi.application"  # WSGI is used by traditional Python web servers.

DATABASES = {  # Database settings tell Django where to store data.
    "default": {
        "ENGINE": "django.db.backends.sqlite3",  # SQLite is simple and stores data in one file.
        "NAME": BASE_DIR / "db.sqlite3",  # The database file will be backend/db.sqlite3.
    }
}

if os.environ.get("DATABASE_URL"):
    DATABASES["default"] = dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )

AUTH_PASSWORD_VALIDATORS = [  # These validators are used if you create admin users.
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},  # Blocks passwords too similar to user info.
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},  # Requires a minimum password length.
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},  # Blocks very common passwords.
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},  # Blocks all-number passwords.
]

LANGUAGE_CODE = "en-us"  # Default language for Django messages.

TIME_ZONE = "Africa/Kampala"  # Matches the user's local timezone.

USE_I18N = True  # Enables Django translation support.

USE_TZ = True  # Stores datetimes in a timezone-aware format.

STATIC_URL = "static/"  # URL prefix for static files.

STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"  # Default primary key type for new models.

CORS_ALLOWED_ORIGINS = [  # Frontend origins allowed to call the API from the browser.
    "http://localhost:5173",  # Vite's common development URL.
    "http://127.0.0.1:5173",  # Same Vite server accessed through 127.0.0.1.
]

extra_cors_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "")
if extra_cors_origins:
    CORS_ALLOWED_ORIGINS.extend(
        [origin.strip() for origin in extra_cors_origins.split(",") if origin.strip()]
    )

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]
extra_cors_regexes = os.environ.get("CORS_ALLOWED_ORIGIN_REGEXES", "")
if extra_cors_regexes:
    CORS_ALLOWED_ORIGIN_REGEXES.extend(
        [origin.strip() for origin in extra_cors_regexes.split(",") if origin.strip()]
    )

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

REST_FRAMEWORK = {  # Simple DRF settings for this teaching project.
    "DEFAULT_RENDERER_CLASSES": [  # Renderers decide how API responses are displayed.
        "rest_framework.renderers.JSONRenderer",  # Return JSON to React.
        "rest_framework.renderers.BrowsableAPIRenderer",  # Show a beginner-friendly web API page in the browser.
    ],
}
