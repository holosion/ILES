import axios from "axios"; // Axios is the small library React uses here to call the Django API.

const api = axios.create({
  // baseURL is the shared beginning of every backend endpoint.
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

export const registerAccount = (account) => api.post("/auth/register/", account);
export const verifyAccount = (payload) => api.post("/auth/verify/", payload);
export const loginAccount = (credentials) => api.post("/auth/login/", credentials);

export const getCompanies = () => api.get("/accounts/?role=company");

export const getStudents = (companyId) =>
  api.get(companyId ? `/students/?company=${companyId}` : "/students/");
export const createStudent = (student) => api.post("/students/", student);
export const updateStudent = (id, student) => api.put(`/students/${id}/`, student);
export const deleteStudent = (id) => api.delete(`/students/${id}/`);

export const getWeeklyReports = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/weekly-reports/${params ? `?${params}` : ""}`);
};
export const createWeeklyReport = (report) => api.post("/weekly-reports/", report);
export const updateWeeklyReport = (id, report) => api.put(`/weekly-reports/${id}/`, report);
export const deleteWeeklyReport = (id) => api.delete(`/weekly-reports/${id}/`);

// Weekly log API helpers keep page components beginner-friendly.
export const getLogs = () => api.get("/logs/");
export const createLog = (log) => api.post("/logs/", log);
export const updateLog = (id, log) => api.put(`/logs/${id}/`, log);
export const deleteLog = (id) => api.delete(`/logs/${id}/`);

// Evaluation API helpers match the CRUD endpoints from the Django backend.
export const getEvaluations = () => api.get("/evaluations/");
export const createEvaluation = (evaluation) => api.post("/evaluations/", evaluation);
export const updateEvaluation = (id, evaluation) => api.put(`/evaluations/${id}/`, evaluation);
export const deleteEvaluation = (id) => api.delete(`/evaluations/${id}/`);

// Dashboard helper reads summary numbers calculated by Django.
export const getDashboardStats = () => api.get("/dashboard/");

export default api;
