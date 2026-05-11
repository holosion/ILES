"""WSGI entry point for standard Django servers."""  # WSGI is the classic Python web server interface.

import os  # os reads environment variables.

from django.core.wsgi import get_wsgi_application  # Imports Django's WSGI application builder.

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "iles_backend.settings")  # Tell Django where settings live.

application = get_wsgi_application()  # Build the WSGI application object.
