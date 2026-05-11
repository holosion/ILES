# ILES Backend Tutorial and Implementation Guide

This document teaches the backend step by step for a beginner computer science student.

The project is intentionally simple:

- Django is the backend framework.
- Django REST Framework creates JSON APIs.
- SQLite stores data in one local file.
- React + Vite calls the backend using Axios.

## Final Folder Structure

```text
groupc/
├── backend/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt
│   ├── README.md
│   ├── docs/
│   │   └── BACKEND_TUTORIAL.md
│   ├── iles_backend/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── internship/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── tests.py
│       ├── urls.py
│       ├── views.py
│       └── migrations/
│           ├── __init__.py
│           └── 0001_initial.py
└── frontend/
    └── src/
        ├── api.js
        └── pages/
            ├── Evaluations.jsx
            ├── Home.jsx
            ├── Reports.jsx
            └── WeeklyLogs.jsx
```

## Why Each Backend File Exists

`manage.py` is the command file. You use it to run commands such as migrations, tests, and the development server.

`iles_backend/settings.py` contains project settings: installed apps, database configuration, CORS, timezone, and DRF settings.

`iles_backend/urls.py` is the main routing file. It sends `/api/` requests to the internship app and `/admin/` requests to Django admin.

`iles_backend/asgi.py` and `iles_backend/wsgi.py` are server entry points. Beginners rarely edit them, but deployment tools use them.

`internship/models.py` defines database tables using Python classes.

`internship/serializers.py` converts model objects into JSON and validates incoming JSON.

`internship/views.py` contains the API logic for CRUD operations and dashboard statistics.

`internship/urls.py` maps API URLs to views.

`internship/admin.py` makes models visible in Django admin.

`internship/tests.py` checks that important API behavior works.

`requirements.txt` lists Python packages needed by the backend.

`db.sqlite3` is the SQLite database file created by migrations.

## Step 1: Installation

Goal: install the backend libraries.

Concept: Python packages give Django extra features. DRF gives API tools. CORS allows React and Django to talk across different ports.

Commands:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python -m pip install -r requirements.txt
```

`requirements.txt`:

```text
Django==6.0.2
djangorestframework==3.17.0
django-cors-headers==4.9.0
```

Data flow: no app data flows yet. This step only prepares the backend tools.

## Step 2: Django Project Setup

Goal: create the project configuration.

Concept: a Django project is the control center. It knows installed apps, database settings, and top-level URLs.

Important files:

- `manage.py`
- `iles_backend/settings.py`
- `iles_backend/urls.py`
- `iles_backend/asgi.py`
- `iles_backend/wsgi.py`

Data flow:

1. A browser sends a request to Django.
2. Django reads `settings.py`.
3. Django checks `iles_backend/urls.py`.
4. Matching URLs are sent to the correct app.

## Step 3: Django App Setup

Goal: create the `internship` app.

Concept: an app groups related features. In this project, weekly logs and evaluations belong together in one beginner-friendly app.

Important files:

- `internship/apps.py`
- `internship/models.py`
- `internship/serializers.py`
- `internship/views.py`
- `internship/urls.py`
- `internship/admin.py`

Data flow:

1. `/api/logs/` reaches `internship/urls.py`.
2. The URL router chooses `WeeklyLogViewSet`.
3. The view reads or writes the `WeeklyLog` model.
4. The serializer converts data to JSON.

## Step 4: Models

Goal: create database tables.

Concept: a Django model is a Python class that becomes a database table.

`WeeklyLog` fields:

- `week`: internship week number.
- `activity`: work done during the week.
- `status`: Draft, Submitted, Reviewed, or Approved.
- `created_at`: creation date and time.

`Evaluation` fields:

- `student`: student name.
- `technical`: technical score.
- `communication`: communication score.
- `attendance`: attendance score.
- `total`: calculated total.
- `created_at`: creation date and time.

Data flow:

1. React sends JSON to Django.
2. DRF validates the JSON.
3. Django model saves a row in SQLite.
4. SQLite stores the row in `db.sqlite3`.

## Step 5: Migrations

Goal: create database tables from the model classes.

Concept: migrations are Django's database change history.

Commands:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python manage.py makemigrations internship
python manage.py migrate
```

What happens:

- `makemigrations` creates `internship/migrations/0001_initial.py`.
- `migrate` applies that migration to SQLite.
- `db.sqlite3` is created or updated.

## Step 6: Serializers

Goal: convert between Python objects and JSON.

Concept: React understands JSON, but Django models are Python objects. Serializers sit between them.

Example request JSON:

```json
{
  "week": 1,
  "activity": "Designed the weekly log form",
  "status": "Draft"
}
```

Example response JSON:

```json
{
  "id": 1,
  "week": 1,
  "activity": "Designed the weekly log form",
  "status": "Draft",
  "created_at": "2026-05-11T08:45:00+03:00"
}
```

Data flow:

1. React sends JSON.
2. Serializer checks required fields.
3. Serializer creates or updates a model.
4. Serializer returns JSON back to React.

## Step 7: Views and CRUD

Goal: create endpoints for Create, Read, Update, and Delete.

Concept: DRF `ModelViewSet` gives beginner-friendly CRUD behavior from a model and serializer.

Weekly log CRUD:

```text
GET    /api/logs/       Read all logs
POST   /api/logs/       Create one log
PUT    /api/logs/1/     Update log with id 1
DELETE /api/logs/1/     Delete log with id 1
```

Evaluation CRUD:

```text
GET    /api/evaluations/       Read all evaluations
POST   /api/evaluations/       Create one evaluation
PUT    /api/evaluations/1/     Update evaluation with id 1
DELETE /api/evaluations/1/     Delete evaluation with id 1
```

Dashboard:

```text
GET /api/dashboard/
```

Data flow for POST:

1. React form submits data.
2. Axios sends POST JSON to Django.
3. DRF view receives request.
4. Serializer validates data.
5. Model saves data to SQLite.
6. DRF returns the new object as JSON.
7. React refreshes the table.

Data flow for PUT:

1. React sends all fields for one record.
2. Django finds the record by `id`.
3. Serializer validates new data.
4. Model updates the row.
5. React reloads the list.

Data flow for DELETE:

1. React sends DELETE to `/api/resource/id/`.
2. Django finds the row.
3. Django removes it from SQLite.
4. React reloads the list.

## Step 8: URLs

Goal: connect readable URLs to API views.

Concept: URL routing is like a map. It tells Django which code handles each path.

Main project route:

```python
path("api/", include("internship.urls"))
```

This means every API URL starts with `/api/`.

App router:

```python
router.register("logs", WeeklyLogViewSet, basename="logs")
router.register("evaluations", EvaluationViewSet, basename="evaluations")
```

This automatically creates the required CRUD endpoints.

## Step 9: CORS

Goal: allow React to call Django.

Concept: the browser blocks requests between different origins unless the backend allows them.

React usually runs here:

```text
http://localhost:5173
```

Django usually runs here:

```text
http://127.0.0.1:8000
```

The backend allows React using:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## Step 10: Frontend Integration

Goal: connect React forms and tables to Django APIs.

Concept: Axios sends HTTP requests from React to Django.

`frontend/src/api.js` contains:

```javascript
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
```

Weekly log helpers:

```javascript
export const getLogs = () => api.get("/logs/");
export const createLog = (log) => api.post("/logs/", log);
export const updateLog = (id, log) => api.put(`/logs/${id}/`, log);
export const deleteLog = (id) => api.delete(`/logs/${id}/`);
```

Evaluation helpers:

```javascript
export const getEvaluations = () => api.get("/evaluations/");
export const createEvaluation = (evaluation) => api.post("/evaluations/", evaluation);
export const updateEvaluation = (id, evaluation) => api.put(`/evaluations/${id}/`, evaluation);
export const deleteEvaluation = (id) => api.delete(`/evaluations/${id}/`);
```

Data flow:

1. User types into a React form.
2. React stores the input in component state.
3. User clicks submit.
4. Axios sends the state object to Django.
5. Django saves to SQLite.
6. React calls GET again and redraws the table.

## API Testing Instructions

Start Django:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python manage.py runserver
```

Open the browsable API:

```text
http://127.0.0.1:8000/api/logs/
http://127.0.0.1:8000/api/evaluations/
http://127.0.0.1:8000/api/dashboard/
```

Test with PowerShell:

```powershell
Invoke-RestMethod -Method Get -Uri http://127.0.0.1:8000/api/logs/
```

Create a weekly log:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/logs/ -ContentType "application/json" -Body '{"week":1,"activity":"Created Django backend","status":"Draft"}'
```

Update a weekly log:

```powershell
Invoke-RestMethod -Method Put -Uri http://127.0.0.1:8000/api/logs/1/ -ContentType "application/json" -Body '{"week":1,"activity":"Submitted Django backend","status":"Submitted"}'
```

Delete a weekly log:

```powershell
Invoke-RestMethod -Method Delete -Uri http://127.0.0.1:8000/api/logs/1/
```

Create an evaluation:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/evaluations/ -ContentType "application/json" -Body '{"student":"Akena Student","technical":80,"communication":75,"attendance":90}'
```

## How Django REST Framework Works Here

DRF has four important pieces in this project:

- Model: defines the database table.
- Serializer: validates JSON and converts data.
- ViewSet: provides CRUD behavior.
- Router: creates URLs automatically.

Request/response flow:

```text
React form
↓
Axios request
↓
Django URL route
↓
DRF ViewSet
↓
Serializer validation
↓
Django Model
↓
SQLite database
↓
JSON response
↓
React table update
```

## Line-by-Line Learning Map

The backend source files include comments beside important lines. Use this map while reading them:

`manage.py`

- Imports `os` and `sys`.
- Sets `DJANGO_SETTINGS_MODULE`.
- Runs `execute_from_command_line`.
- This is why commands such as `python manage.py runserver` work.

`settings.py`

- `BASE_DIR` points to the backend folder.
- `INSTALLED_APPS` turns on Django, DRF, CORS, and the internship app.
- `MIDDLEWARE` processes every request.
- `DATABASES` selects SQLite.
- `CORS_ALLOWED_ORIGINS` allows the Vite frontend.
- `REST_FRAMEWORK` enables JSON and the browsable API.

`models.py`

- `WeeklyLog` becomes the weekly log table.
- `STATUS_CHOICES` restricts workflow states.
- `Evaluation` becomes the evaluation table.
- `save()` calculates `total` before saving.

`serializers.py`

- `ModelSerializer` creates JSON fields from models.
- `read_only_fields` protects generated fields.
- `validate()` blocks scores below 0 or above 100.

`views.py`

- `ModelViewSet` gives GET, POST, PUT, and DELETE.
- `dashboard_stats()` calculates counts and averages.
- `Response(data)` returns JSON to React.

`urls.py`

- `DefaultRouter` creates CRUD URLs.
- `/api/dashboard/` is a custom statistics endpoint.

`admin.py`

- `@admin.register(...)` adds models to Django admin.
- `list_display` controls table columns in admin.
- `search_fields` enables admin searching.

## Running the Full System

Terminal 1:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python manage.py runserver
```

Terminal 2:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Verification Commands

Backend checks:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python manage.py check
python manage.py test
```

Frontend checks:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\frontend
npm run lint
npm run build
```

## Troubleshooting

Problem: React says it cannot load logs.

Fix: make sure Django is running at `http://127.0.0.1:8000`.

Problem: CORS error in browser console.

Fix: check `CORS_ALLOWED_ORIGINS` in `settings.py` and confirm Vite is running on port `5173`.

Problem: database table does not exist.

Fix:

```bash
python manage.py makemigrations internship
python manage.py migrate
```

Problem: API returns validation errors for scores.

Fix: use numbers from 0 to 100 for `technical`, `communication`, and `attendance`.

Problem: frontend build fails because Axios is missing.

Fix:

```bash
cd C:\Users\akena\OneDrive\Desktop\groupc\frontend
npm install
```

## Final System Summary

ILES now has a simple backend with:

- Weekly log CRUD.
- Evaluation CRUD.
- Dashboard statistics.
- SQLite persistence.
- Django admin support.
- CORS for frontend communication.
- Axios integration in React.
- Beginner-friendly documentation and code comments.

The frontend and backend communicate through REST APIs, and all created records are stored in SQLite instead of browser `localStorage`.
