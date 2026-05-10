import { BarChart3, Download, FileText, PieChart, Printer } from "lucide-react";
import {
  courseWeeks,
  evaluationWeights,
  initialEvaluations,
  initialLogs,
  placements,
} from "../data/courseData";

function readStoredData(key, fallback) {
  // Reports should reflect user-created data when it exists, otherwise use demo data.
  const savedData = localStorage.getItem(key);
  return savedData ? JSON.parse(savedData) : fallback;
}

function Reports() {
  // Pull current prototype data from localStorage so reports update after form actions.
  const logs = readStoredData("iles-weekly-logs", initialLogs);
  const evaluations = readStoredData("iles-evaluations", initialEvaluations);
  const approvedLogs = logs.filter((log) => log.status === "Approved").length;
  const submittedLogs = logs.filter((log) => log.status !== "Draft").length;
  const averageScore = Math.round(
    // Average all saved evaluation totals for the headline report card.
    evaluations.reduce((sum, evaluation) => sum + evaluation.total, 0) / evaluations.length,
  );

  return (
    <section className="page-stack">
      <div className="page-title page-title--row">
        <div>
          <span className="eyebrow">Week 10 practical task</span>
          <h1>Dashboards & Reporting</h1>
          <p>
            Aggregated views for student progress, supervisor pending reviews, administrator
            statistics, and final documentation readiness.
          </p>
        </div>
        <div className="form-actions">
          <button className="button button--secondary" type="button">
            <Printer size={16} />
            Print
          </button>
          <button className="button button--primary" type="button">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="cards-container">
        {/* Summary cards give administrators the key statistics at a glance. */}
        <article className="report-stat">
          <span>Active Placements</span>
          <strong>{placements.length}</strong>
        </article>
        <article className="report-stat">
          <span>Submitted Logs</span>
          <strong>{submittedLogs}</strong>
        </article>
        <article className="report-stat">
          <span>Approved Logs</span>
          <strong>{approvedLogs}</strong>
        </article>
        <article className="report-stat">
          <span>Average Score</span>
          <strong>{averageScore}%</strong>
        </article>
      </div>

      <div className="section-grid">
        {/* Bar chart uses CSS widths based on the evaluation weight percentages. */}
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon">
              <BarChart3 size={20} />
            </span>
            <div>
              <h2>Evaluation Distribution</h2>
              <p>Weighted score breakdown across the three required criteria.</p>
            </div>
          </div>
          <div className="bar-list">
            {evaluationWeights.map((item) => (
              <div className="bar-row" key={item.key}>
                <span>{item.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${item.weight}%` }} />
                </div>
                <strong>{item.weight}%</strong>
              </div>
            ))}
          </div>
        </article>

        {/* Workflow health counts how many logs are in each state. */}
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <PieChart size={20} />
            </span>
            <div>
              <h2>Workflow Health</h2>
              <p>Logbook state counts help supervisors see what needs attention.</p>
            </div>
          </div>
          <div className="status-grid">
            {["Draft", "Submitted", "Reviewed", "Approved"].map((status) => (
              <div className="status-tile" key={status}>
                <span>{status}</span>
                <strong>{logs.filter((log) => log.status === status).length}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* This table links course deliverables to the frontend evidence already built. */}
      <article className="panel table-panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--amber">
            <FileText size={20} />
          </span>
          <div>
            <h2>Final Deliverable Tracker</h2>
            <p>Matches the timeline in the CSC 1202 course outline.</p>
          </div>
        </div>
        <div className="responsive-table">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Topic</th>
                <th>Expected Deliverable</th>
                <th>Frontend Evidence</th>
              </tr>
            </thead>
            <tbody>
              {courseWeeks.map((week) => (
                <tr key={week.week}>
                  <td>Week {week.week}</td>
                  <td>{week.title}</td>
                  <td>{week.deliverable}</td>
                  <td>
                    {week.week < 6
                      ? "Dashboard and placement screens"
                      : week.week < 10
                        ? "Logbook, review, and evaluation screens"
                        : "Reports, documentation, and deployment readiness"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default Reports;
