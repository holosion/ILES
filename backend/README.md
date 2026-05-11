# Internship Logging & Evaluation System Backend

This folder contains the Django + Django REST Framework backend for ILES.

## Quick Start

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at:

```text
http://127.0.0.1:8000/api/
```

The React frontend runs separately from the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

## Main Endpoints

```text
GET    /api/logs/
POST   /api/logs/
PUT    /api/logs/id/
DELETE /api/logs/id/

GET    /api/evaluations/
POST   /api/evaluations/
PUT    /api/evaluations/id/
DELETE /api/evaluations/id/

GET    /api/dashboard/
```

Full beginner documentation is in:

```text
backend/docs/BACKEND_TUTORIAL.md
```
