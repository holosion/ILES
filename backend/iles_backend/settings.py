"""Settings for the simple ILES Django backend."""  # This file controls the whole backend configuration.

from pathlib import Path  # pathlib helps build file paths that work on Windows, macOS, and Linux.

BASE_DIR = Path(__file__).resolve().parent.parent  # BASE_DIR points to the backend folder.

SECRET_KEY = "beginner-learning-key-change-this-before-real-deployment"  # Django needs a secret key for security features.

DEBUG = True  # True shows helpful errors during development; set False in production.

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]  # These hosts may access the Django server.

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

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"  # Default primary key type for new models.

CORS_ALLOWED_ORIGINS = [  # Frontend origins allowed to call the API from the browser.
    "http://localhost:5173",  # Vite's common development URL.
    "http://127.0.0.1:5173",  # Same Vite server accessed through 127.0.0.1.
]

REST_FRAMEWORK = {  # Simple DRF settings for this teaching project.
    "DEFAULT_RENDERER_CLASSES": [  # Renderers decide how API responses are displayed.
        "rest_framework.renderers.JSONRenderer",  # Return JSON to React.
        "rest_framework.renderers.BrowsableAPIRenderer",  # Show a beginner-friendly web API page in the browser.
    ],
}
