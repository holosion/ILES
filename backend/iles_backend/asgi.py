"""ASGI entry point for async-capable Django servers."""  # ASGI supports async web servers.

import os  # os reads environment variables.

from django.core.asgi import get_asgi_application  # Imports Django's ASGI application builder.

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "iles_backend.settings")  # Tell Django where settings live.

application = get_asgi_application()  # Build the ASGI application object.
