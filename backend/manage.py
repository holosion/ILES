"""Command-line helper for the Django project."""  # This comment explains the file purpose.

import os  # os lets Python read and set environment variables.
import sys  # sys gives access to command-line arguments.


def main():  # Django starts here when we run commands such as "python manage.py runserver".
    """Run Django administrative tasks."""  # A docstring describes what this function does.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "iles_backend.settings")  # Tell Django where settings.py lives.
    from django.core.management import execute_from_command_line  # Import Django's command runner.

    execute_from_command_line(sys.argv)  # Pass the typed terminal command into Django.


if __name__ == "__main__":  # This runs main() only when this file is executed directly.
    main()  # Start Django's command-line program.
