# ILES Frontend Documentation

This document explains the React frontend built for **CSC 1202: Software Development Project (2026)** using the supplied course outline. The frontend implements a working prototype of the **Internship Logging & Evaluation System (ILES)**.

## 1. Source Document Alignment

The PDF describes a full-stack Django and React project. This repository currently contains the React frontend only, so the frontend was designed as a polished, browser-persistent prototype that can later connect to Django REST Framework APIs.

The frontend covers these PDF requirements:

- User and role management through the Settings screen.
- Internship placement visibility through the Dashboard screen.
- Weekly logbook creation, editing, submission, review, and approval through the Weekly Logs screen.
- Supervisor workflow states: Draft, Submitted, Reviewed, and Approved.
- Academic evaluation and weighted score computation through the Evaluations screen.
- Aggregated dashboards and reports through the Reports screen.
- Documentation and technical-defence readiness through this file.

## 2. How the Frontend Was Built Step by Step

1. The Vite React app was kept as the base project so the existing setup remained familiar.
2. `lucide-react` was added for clear icons in navigation, buttons, cards, and dashboard panels.
3. A shared data file, `src/data/courseData.js`, was created from the course outline so pages use one source of truth for course information, roles, workflow states, modules, evaluation weights, weekly timeline items, sample logs, sample evaluations, and placements.
4. `App.jsx` was simplified into a route shell with Navbar, Sidebar, and page routes.
5. `Navbar.jsx` was rebuilt as a professional top bar with branding, search, lecture time, and notification action.
6. `Sidebar.jsx` was rebuilt with active route highlighting and workflow-state hints.
7. `DashboardCard.jsx` was upgraded from a simple title/value box into a reusable metric card with icons and color tones.
8. `Home.jsx` became the main ILES dashboard with a hero section, metrics, modules, placements, and 12-week timeline.
9. `WeeklyLogs.jsx` became a full local workflow module with create, edit, delete, submit, review, and approve actions.
10. `Evaluations.jsx` became a weighted scoring screen using the 40/30/30 model from the outline.
11. `Reports.jsx` became an aggregation dashboard for placements, logs, workflow health, scoring distribution, and final deliverables.
12. `Settings.jsx` became a role-management and workflow-control screen.
13. `index.css` was replaced with a complete responsive design system.
14. The app was verified with `npm run lint`, `npm run build`, and browser checks on `http://127.0.0.1:5173`.

## 3. Project Structure

```text
frontend/
  docs/
    FRONTEND_DOCUMENTATION.md
  src/
    components/
      DashboardCard.jsx
      Navbar.jsx
      Sidebar.jsx
    data/
      courseData.js
    pages/
      Evaluations.jsx
      Home.jsx
      Reports.jsx
      Settings.jsx
      WeeklyLogs.jsx
    App.jsx
    index.css
    main.jsx
```

## 4. Screen-by-Screen Explanation

### Dashboard

The dashboard is the first page users see. It introduces ILES, shows the lecturer and lecture times, summarizes roles, workflow states, weekly logs, and average evaluation score, then displays the core modules, active placements, and the 12-week course timeline.

### Weekly Logs

The Weekly Logs page implements the course requirement for Draft versus Submitted state. It also extends the workflow to Reviewed and Approved so the supervisor review process is visible. Logs are saved to `localStorage`, making the prototype usable after refresh without a backend.

### Evaluations

The Evaluations page implements weighted score computation:

```text
Total = (Workplace x 0.40) + (Academic x 0.30) + (Logbook x 0.30)
```

The total and grade are calculated automatically so users cannot manually enter an incorrect total.

### Reports

The Reports page aggregates the prototype data into statistics, scoring distribution, workflow health, and a deliverable tracker matching the course timeline.

### Settings

The Settings page explains the four core roles and contains workflow-control switches for validation, editing locks, supervisor comments, and automatic score computation.

## 5. File-by-File Code Guide

### `src/main.jsx`

- Lines 1-3 import React, ReactDOM, the global stylesheet, and the main app component.
- Line 5 finds the `root` element in `index.html`.
- Lines 5-9 render the app inside `StrictMode` so React can warn about unsafe code during development.

### `src/App.jsx`

- Lines 1-2 import the layout components used on every page.
- Lines 3-7 import the five route pages.
- Line 8 imports React Router tools.
- Line 10 declares the `App` component.
- Lines 12-26 wrap the application in `BrowserRouter`, render the Navbar and Sidebar, and switch page content using `Routes`.
- Line 29 exports `App` so `main.jsx` can render it.

### `src/data/courseData.js`

- `courseInfo` stores the course code, title, year, system name, lecturer, email, and lecture hours.
- `roles` stores the four core roles from the PDF and the permissions each role needs.
- `workflowStates` stores Draft, Submitted, Reviewed, and Approved plus short explanations for each state.
- `modules` stores the seven core ILES modules from the outline.
- `evaluationWeights` stores the 40/30/30 weighted scoring model.
- `courseWeeks` stores the 12-week teaching and deliverable timeline.
- `initialLogs` stores sample weekly logs for the prototype.
- `initialEvaluations` stores sample evaluation records for the prototype.
- `placements` stores sample internship placements shown on the dashboard.

### `src/components/Navbar.jsx`

- The imports bring in icons and the shared course information.
- `Navbar` returns a sticky top header.
- The brand section displays the ILES identity and course code.
- The search label contains an accessible search input for future filtering.
- The actions section displays lecture time and a notification button.
- The component is exported for use in `App.jsx`.

### `src/components/Sidebar.jsx`

- The imports bring in icons, `NavLink`, and shared course/workflow data.
- The `links` array defines every sidebar route in one place.
- `Sidebar` returns an `aside` element because it is secondary navigation.
- The header identifies the system and workflow control panel.
- The navigation maps over `links` and uses `NavLink` to apply active styling.
- The workflow box lists each workflow state from the PDF.
- The component is exported for use in `App.jsx`.

### `src/components/DashboardCard.jsx`

- `DashboardCard` accepts `title`, `value`, `detail`, `icon`, and `tone`.
- The card uses a dynamic class so different cards can use different color tones.
- The icon is rendered only when an icon component is passed.
- The value is emphasized with a `strong` element.
- The detail paragraph is optional.
- The component is exported and reused on the dashboard.

### `src/pages/Home.jsx`

- The imports bring in icons, the reusable card component, and course data.
- `Home` calculates reviewed logs and average score from the sample data.
- The hero panel introduces the system and provides quick actions.
- The summary card lists lecturer details and lecture hours from the PDF.
- Dashboard cards summarize core roles, workflow states, weekly logs, and average score.
- The modules panel maps over the PDF module list.
- The placements panel maps over the sample placement data.
- The timeline panel maps over all 12 course weeks.
- The component is exported as the Dashboard route.

### `src/pages/WeeklyLogs.jsx`

- The imports bring in React state tools, icons, course weeks, sample logs, and workflow states.
- `emptyLog` defines the form reset shape.
- `getSavedLogs` loads logs from browser storage or falls back to sample logs.
- `WeeklyLogs` stores logs, form state, and the current edit id.
- `selectedWeek` finds the selected course-week object so the page can show its expected deliverable.
- `useEffect` persists log changes to `localStorage`.
- `updateForm` updates one form field while keeping the others unchanged.
- `resetForm` clears the form and exits edit mode.
- `handleSubmit` creates or updates a log.
- `editLog` loads an existing log into the form.
- `deleteLog` removes a log by id.
- `moveStatus` simulates valid workflow movement between Draft, Submitted, Reviewed, and Approved.
- The returned JSX renders the page title, workflow strip, log form, and log table.
- The component is exported as the Weekly Logs route.

### `src/pages/Evaluations.jsx`

- The imports bring in React state tools, icons, evaluation weights, and sample evaluations.
- `emptyEvaluation` defines the form reset shape.
- `getSavedEvaluations` loads browser-stored evaluations or sample records.
- `calculateGrade` converts a numeric total into a grade label.
- `calculateTotal` applies the 40/30/30 weighted scoring formula.
- `Evaluations` stores records and the current form state.
- `liveTotal` and `liveGrade` preview the score before submission.
- `useEffect` persists evaluation records to `localStorage`.
- `updateForm` changes one field in the form.
- `handleSubmit` computes the total, assigns a grade, saves the record, and clears the form.
- The returned JSX renders score weights, the evaluation form, the formula explanation, and records table.
- The component is exported as the Evaluations route.

### `src/pages/Reports.jsx`

- The imports bring in reporting icons and shared prototype data.
- `readStoredData` reads logs and evaluations from `localStorage` when available.
- `Reports` calculates approved logs, submitted logs, and average score.
- The page title includes Print and Export buttons for a realistic reporting interface.
- Stat cards show placements, submitted logs, approved logs, and average score.
- The evaluation distribution panel visualizes the weighted score percentages.
- The workflow health panel counts logs by status.
- The deliverable tracker maps the 12-week course timeline to frontend evidence.
- The component is exported as the Reports route.

### `src/pages/Settings.jsx`

- The imports bring in state, icons, course information, and roles.
- `defaultSettings` defines initial workflow controls.
- `Settings` loads saved settings or uses defaults.
- `toggleSetting` flips a selected workflow switch.
- `saveSettings` persists settings to `localStorage`.
- The roles panel maps the four core roles and their permissions.
- The workflow controls panel maps settings into checkbox toggles.
- The defence notes panel summarizes RBAC readiness, workflow awareness, and browser persistence.
- The component is exported as the Settings route.

### `src/index.css`

- The `:root` block defines the base font, colors, rendering, and background.
- The universal selector applies predictable box sizing.
- The `body` block creates the soft dashboard background.
- Form controls inherit the same font as the rest of the app.
- Navbar classes create the sticky top bar, brand area, search input, lecture chip, and action button.
- Sidebar classes create the left navigation, active route state, and workflow-state list.
- Layout classes define the main grid, content area, page stack, hero panel, cards, panels, and grids.
- Form classes style labels, inputs, selects, textareas, buttons, and validation-friendly focus states.
- Table classes style responsive log and report tables.
- Status classes color Draft, Submitted, Reviewed, and Approved states.
- Report and evaluation classes style weight cards, bars, workflow tiles, roles, toggles, and defence notes.
- Media queries progressively adapt the layout for tablets and phones.

## 6. Local Storage Keys

The prototype uses browser storage until the Django backend is connected.

- `iles-weekly-logs`: weekly logbook records.
- `iles-evaluations`: academic evaluation records.
- `iles-settings`: workflow-control settings.

## 7. Commands

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

## 8. Backend Integration Plan

When the Django backend is ready, replace the local-storage functions with API calls:

- Replace `getSavedLogs` with `GET /api/logs/`.
- Replace weekly log creation with `POST /api/logs/`.
- Replace status changes with `PATCH /api/logs/:id/status/`.
- Replace `getSavedEvaluations` with `GET /api/evaluations/`.
- Replace evaluation creation with `POST /api/evaluations/`.
- Replace the hard-coded placements with `GET /api/placements/`.
- Add authenticated route guards using the user role returned by the backend.

## 9. Verification Results

The frontend was checked with:

```bash
npm run lint
npm run build
```

Both commands completed successfully. The app was also opened in the browser at `http://127.0.0.1:5173`, and the dashboard, reports page, and weekly log form were verified.
