// This file is the frontend's single source of truth for information taken from the CSC 1202 PDF.
// Keeping this data here prevents every page from repeating the same course, role, and workflow text.
export const courseInfo = {
  code: "CSC 1202",
  title: "Software Development Project",
  year: "2026",
  systemName: "Internship Logging & Evaluation System",
  systemShortName: "ILES",
  lecturer: "Dr. Peter Khisa Wakholi",
  email: "pwakholi@cit.ac.ug",
  dayLecture: "Friday 8:00 - 11:00 AM",
  eveningLecture: "Friday 17:00 - 20:00",
};

export const roles = [
  // These are the four core system users listed in the course outline.
  {
    name: "Student Intern",
    summary: "Creates placements, writes weekly logs, and submits work for review.",
    permissions: ["Draft logs", "Submit weekly logs", "View scores"],
  },
  {
    name: "Workplace Supervisor",
    summary: "Reviews field activity, confirms attendance, and gives practical feedback.",
    permissions: ["Review logs", "Add comments", "Approve workplace progress"],
  },
  {
    name: "Academic Supervisor",
    summary: "Evaluates academic quality, verifies learning outcomes, and scores students.",
    permissions: ["Evaluate students", "Track progress", "Validate final score"],
  },
  {
    name: "Internship Administrator",
    summary: "Manages placements, users, reports, and institutional dashboards.",
    permissions: ["Assign placements", "Manage roles", "Export reports"],
  },
];

export const workflowStates = [
  // Logs move through these states as the student and supervisors work on them.
  {
    key: "Draft",
    label: "Draft",
    description: "The student can still edit the weekly activity log.",
  },
  {
    key: "Submitted",
    label: "Submitted",
    description: "The log is waiting for supervisor review.",
  },
  {
    key: "Reviewed",
    label: "Reviewed",
    description: "The supervisor has checked the log and added feedback.",
  },
  {
    key: "Approved",
    label: "Approved",
    description: "The log is locked and counted in final progress.",
  },
];

export const modules = [
  // Core ILES modules expected in the final course project.
  "User & Role Management",
  "Internship Placement Module",
  "Weekly Logbook Module",
  "Supervisor Review Workflow",
  "Academic Evaluation Module",
  "Weighted Score Computation",
  "Dashboards & Reporting",
];

export const evaluationWeights = [
  // The weighted scoring model comes from the evaluation and score computation week.
  { key: "workplace", label: "Workplace Supervisor", weight: 40 },
  { key: "academic", label: "Academic Supervisor", weight: 30 },
  { key: "logbook", label: "Weekly Logbook", weight: 30 },
];

export const courseWeeks = [
  // The 12-week timeline is used by the dashboard, logbook form, and reports page.
  { week: 1, title: "Introduction & SDLC", deliverable: "Project setup and Git branches" },
  { week: 2, title: "Requirements Engineering", deliverable: "User stories and workflow states" },
  { week: 3, title: "Database Design & ERD", deliverable: "ERD and workflow diagram" },
  { week: 4, title: "Authentication & RBAC", deliverable: "Role-based login and dashboards" },
  { week: 5, title: "Internship Placement", deliverable: "Placement validation and UI" },
  { week: 6, title: "Weekly Logbook", deliverable: "Create, edit, and submit logs" },
  { week: 7, title: "Supervisor Review", deliverable: "Comments and status history" },
  { week: 8, title: "Midterm Prototype", deliverable: "Integrated prototype presentation" },
  { week: 9, title: "Evaluation & Scoring", deliverable: "Weighted score computation" },
  { week: 10, title: "Dashboards & Aggregation", deliverable: "Student and admin dashboards" },
  { week: 11, title: "Testing & Validation", deliverable: "Coverage report and bug fixes" },
  { week: 12, title: "Deployment & Defence", deliverable: "Deployed, documented final system" },
];

export const initialLogs = [
  // Sample logs make the frontend useful before it is connected to a Django backend.
  {
    id: 1,
    week: "4",
    focusArea: "Authentication & RBAC",
    hours: "16",
    activity:
      "Mapped the login screens for Student Intern, Workplace Supervisor, Academic Supervisor, and Administrator roles.",
    evidence: "Route guard sketch and role matrix",
    status: "Reviewed",
    supervisorComment: "Good role separation. Add clearer admin permissions next.",
  },
  {
    id: 2,
    week: "6",
    focusArea: "Weekly Logbook Module",
    hours: "18",
    activity:
      "Built the weekly log form with draft and submitted states, including local validation.",
    evidence: "React form prototype",
    status: "Submitted",
    supervisorComment: "Awaiting review.",
  },
  {
    id: 3,
    week: "9",
    focusArea: "Evaluation & Score Computation",
    hours: "12",
    activity:
      "Prepared the weighted score model using 40 percent workplace, 30 percent academic, and 30 percent logbook scores.",
    evidence: "Scoring spreadsheet",
    status: "Draft",
    supervisorComment: "Not submitted yet.",
  },
];

export const initialEvaluations = [
  // Sample evaluations demonstrate the score table and reporting views immediately.
  {
    id: 1,
    student: "Akena Student",
    workplace: 82,
    academic: 78,
    logbook: 88,
    total: 82,
    grade: "A",
    recommendation: "Ready for final technical defence.",
  },
  {
    id: 2,
    student: "Demo Intern",
    workplace: 74,
    academic: 69,
    logbook: 80,
    total: 74,
    grade: "B",
    recommendation: "Improve academic reflection before final submission.",
  },
];

export const placements = [
  // Sample placements represent the Internship Placement Module from the PDF.
  {
    student: "Akena Student",
    organization: "Community Health IT Office",
    supervisor: "Ms. Namusisi Grace",
    period: "May - August 2026",
    status: "Active",
  },
  {
    student: "Demo Intern",
    organization: "Campus Systems Lab",
    supervisor: "Mr. Okello Brian",
    period: "May - August 2026",
    status: "Active",
  },
];
