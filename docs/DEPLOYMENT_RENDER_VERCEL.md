# ILES Deployment Guide: Render Backend + Vercel Frontend

This guide deploys the Internship Logging & Evaluation System (ILES) from GitHub.

Repository:

```text
https://github.com/holosion/ILES.git
```

## What Will Be Deployed

| Part | Platform | Folder | Purpose |
|---|---|---|---|
| Django backend | Render | `backend` | REST API, database models, login, verification, student profiles, weekly reports, grading |
| PostgreSQL database | Render | managed database | Production database for Django |
| React frontend | Vercel | `frontend` | Browser interface for companies and lecturers |

## Important Files Added

| File | Why it matters |
|---|---|
| `render.yaml` | Render Blueprint for the Django backend and PostgreSQL database |
| `backend/build.sh` | Render build script: installs dependencies, collects static files, runs migrations |
| `backend/requirements.txt` | Adds `gunicorn`, `whitenoise`, `dj-database-url`, and PostgreSQL driver |
| `frontend/vercel.json` | Makes React Router pages work on Vercel refresh/deep links |
| `frontend/.env.example` | Shows the required Vercel API URL variable |
| `frontend/src/api.js` | Uses `VITE_API_BASE_URL` in production and localhost in development |

## Step 1: Push Latest Code to GitHub

From the project root:

```powershell
cd C:\Users\akena\OneDrive\Desktop\groupc
git status
git add .
git commit -m "Prepare Render and Vercel deployment"
git push origin master
```

If Git says there is nothing to commit, the latest deployment files are already pushed.

## Step 2: Deploy the Backend on Render

Render official Django guidance recommends PostgreSQL, WhiteNoise, a build script, and Gunicorn.

1. Open Render: `https://dashboard.render.com`
2. Sign in or create an account.
3. Click **New +**.
4. Choose **Blueprint**.
5. Connect GitHub if Render asks for permission.
6. Select the repository:

```text
holosion/ILES
```

7. Render will read `render.yaml`.
8. Confirm it will create:
   - `iles-backend`
   - `iles-db`
9. Click **Apply**.
10. Wait for the build to finish.

Expected backend URL format:

```text
https://iles-backend.onrender.com
```

Your actual URL may include a different suffix if the name is already taken.

## Step 3: Test the Render Backend

Open this in a browser after Render finishes:

```text
https://YOUR_RENDER_BACKEND_URL/api/dashboard/
```

Example:

```text
https://iles-backend.onrender.com/api/dashboard/
```

You should see JSON like:

```json
{
  "total_students": 0,
  "total_reports": 0
}
```

If you see a Django error:

1. Open the Render service.
2. Click **Logs**.
3. Check whether migrations, static collection, or environment variables failed.

## Step 4: Deploy the Frontend on Vercel

Vercel official Vite guidance uses normal Vite build output and `VITE_` environment variables.

1. Open Vercel: `https://vercel.com/dashboard`
2. Sign in or create an account.
3. Click **Add New...**
4. Choose **Project**.
5. Import the GitHub repository:

```text
holosion/ILES
```

6. Set **Root Directory** to:

```text
frontend
```

7. Use these build settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

8. Add this environment variable:

| Name | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://YOUR_RENDER_BACKEND_URL/api` |

Example:

```text
VITE_API_BASE_URL=https://iles-backend.onrender.com/api
```

9. Click **Deploy**.

Expected frontend URL format:

```text
https://your-project-name.vercel.app
```

## Step 5: Test the Full Live System

Open the Vercel URL.

Test this flow:

1. Create a company account.
2. Copy the demo verification code shown in the app.
3. Verify the account.
4. Add a student profile.
5. Generate a weekly report.
6. Log out.
7. Create a lecturer account.
8. Verify the lecturer account.
9. Open **Reports**.
10. Select a company.
11. Select a student.
12. Enter a mark from `1` to `100`.
13. Confirm the system calculates the Makerere grade and final mark.

## Step 6: If Login Does Not Work

Check these in order:

1. Is the Render backend awake?
   - Open `https://YOUR_RENDER_BACKEND_URL/api/dashboard/`.
2. Is Vercel using the right API URL?
   - Vercel Project > Settings > Environment Variables.
   - Confirm `VITE_API_BASE_URL=https://YOUR_RENDER_BACKEND_URL/api`.
3. Did you redeploy Vercel after changing environment variables?
   - Environment variable changes only affect new deployments.
4. Is CORS blocking the request?
   - The backend allows `*.vercel.app` domains and local development URLs.

## Step 7: Future Updates

After changing code locally:

```powershell
cd C:\Users\akena\OneDrive\Desktop\groupc
git add .
git commit -m "Describe your change"
git push origin master
```

Render and Vercel should automatically redeploy after the push if auto-deploy is enabled.

## Commands for Local Development

Backend:

```powershell
cd C:\Users\akena\OneDrive\Desktop\groupc\backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Frontend:

```powershell
cd C:\Users\akena\OneDrive\Desktop\groupc\frontend
npm install
npm run dev
```

Local URL:

```text
http://127.0.0.1:5173
```

## Official References

- Render Django deployment docs: `https://render.com/docs/deploy-django`
- Render deploy concepts: `https://render.com/docs/deploys/`
- Vercel Vite docs: `https://vercel.com/docs/frameworks/frontend/vite`
- Vercel environment variables docs: `https://vercel.com/docs/projects/environment-variables`
