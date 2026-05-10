import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FilePenLine, RotateCcw, Send, Trash2 } from "lucide-react";
import { courseWeeks, initialLogs, workflowStates } from "../data/courseData";

const emptyLog = {
  // Empty shape used when the form starts or resets after saving.
  week: "",
  focusArea: "",
  hours: "",
  activity: "",
  evidence: "",
  supervisorComment: "",
  status: "Draft",
};

function getSavedLogs() {
  // Browser storage keeps logs available after refresh until the Django backend exists.
  const savedLogs = localStorage.getItem("iles-weekly-logs");
  return savedLogs ? JSON.parse(savedLogs) : initialLogs;
}

function WeeklyLogs() {
  // logs holds all records; form holds the current input values; editId tracks edit mode.
  const [logs, setLogs] = useState(getSavedLogs);
  const [form, setForm] = useState(emptyLog);
  const [editId, setEditId] = useState(null);

  const selectedWeek = useMemo(
    // This finds the selected week so the page can show its expected deliverable.
    () => courseWeeks.find((week) => String(week.week) === String(form.week)),
    [form.week],
  );

  useEffect(() => {
    // Every log change is saved locally so the prototype behaves like a small working system.
    localStorage.setItem("iles-weekly-logs", JSON.stringify(logs));
  }, [logs]);

  function updateForm(field, value) {
    // Update only one form field while preserving the rest of the form.
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    // Return the form to create mode after saving, clearing, or finishing an edit.
    setForm(emptyLog);
    setEditId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // New logs always start as Draft; edited logs keep their existing workflow status.
    const nextLog = {
      ...form,
      id: editId ?? Date.now(),
      status: editId ? form.status : "Draft",
      supervisorComment: form.supervisorComment || "Waiting for supervisor review.",
    };

    // If editId exists, replace that log; otherwise add a fresh log at the top.
    setLogs((currentLogs) =>
      editId
        ? currentLogs.map((log) => (log.id === editId ? nextLog : log))
        : [nextLog, ...currentLogs],
    );
    resetForm();
  }

  function editLog(log) {
    // Load an existing log back into the form so the user can update it.
    setForm(log);
    setEditId(log.id);
  }

  function deleteLog(logId) {
    // Remove only the selected log, leaving all other logs unchanged.
    setLogs((currentLogs) => currentLogs.filter((log) => log.id !== logId));
  }

  function moveStatus(logId, status) {
    // Simulates supervisor workflow transitions before real backend permissions are added.
    setLogs((currentLogs) =>
      currentLogs.map((log) =>
        log.id === logId
          ? {
              ...log,
              status,
              supervisorComment:
                status === "Reviewed"
                  ? "Reviewed by workplace supervisor."
                  : status === "Approved"
                    ? "Approved and locked for final reporting."
                    : log.supervisorComment,
            }
          : log,
      ),
    );
  }

  return (
    <section className="page-stack">
      <div className="page-title">
        <span className="eyebrow">Week 6 practical task</span>
        <h1>Weekly Logbook Module</h1>
        <p>
          Create, edit, submit, review, and approve internship activity logs using the workflow
          states required in the CSC 1202 outline.
        </p>
      </div>

      <div className="workflow-strip">
        {/* Workflow cards explain the allowed state journey for weekly logs. */}
        {workflowStates.map((state) => (
          <div className="workflow-step" key={state.key}>
            <strong>{state.label}</strong>
            <span>{state.description}</span>
          </div>
        ))}
      </div>

      <div className="weekly-layout">
        {/* Left side: data entry form for creating or editing weekly logs. */}
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <span className="section-heading__icon">
              <FilePenLine size={20} />
            </span>
            <div>
              <h2>{editId ? "Edit Log" : "Create Weekly Log"}</h2>
              <p>Logs remain editable while they are in Draft state.</p>
            </div>
          </div>

          <label>
            Week Number
            <select
              required
              value={form.week}
              onChange={(event) => updateForm("week", event.target.value)}
            >
              <option value="">Select week</option>
              {courseWeeks.map((week) => (
                <option key={week.week} value={week.week}>
                  Week {week.week}: {week.title}
                </option>
              ))}
            </select>
          </label>

          {selectedWeek ? (
            <div className="inline-note">
              <strong>Expected deliverable:</strong> {selectedWeek.deliverable}
            </div>
          ) : null}

          <label>
            Focus Area
            <input
              required
              type="text"
              value={form.focusArea}
              onChange={(event) => updateForm("focusArea", event.target.value)}
              placeholder="Example: Supervisor Review Workflow"
            />
          </label>

          <label>
            Hours Worked
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              required
              type="text"
              value={form.hours}
              onChange={(event) => updateForm("hours", event.target.value)}
              placeholder="18"
            />
          </label>

          <label>
            Activity Done
            <textarea
              required
              rows="5"
              value={form.activity}
              onChange={(event) => updateForm("activity", event.target.value)}
              placeholder="Describe the internship work completed this week."
            />
          </label>

          <label>
            Evidence or Output
            <input
              required
              type="text"
              value={form.evidence}
              onChange={(event) => updateForm("evidence", event.target.value)}
              placeholder="Screenshots, Git commit, report, API endpoint, or demo link"
            />
          </label>

          <div className="form-actions">
            <button className="button button--primary" type="submit">
              <Send size={16} />
              {editId ? "Update Log" : "Save Draft"}
            </button>
            <button className="button button--ghost" onClick={resetForm} type="button">
              <RotateCcw size={16} />
              Clear
            </button>
          </div>
        </form>

        {/* Right side: workflow table for submitting, reviewing, approving, editing, and deleting. */}
        <div className="panel table-panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h2>Submitted Logs</h2>
              <p>Use the action buttons to simulate valid workflow transitions.</p>
            </div>
          </div>

          <div className="responsive-table">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Activity</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong>Week {log.week}</strong>
                      <small>{log.focusArea}</small>
                    </td>
                    <td>
                      {log.activity}
                      <small>{log.evidence}</small>
                    </td>
                    <td>{log.hours}</td>
                    <td>
                      <span className={`status status--${log.status.toLowerCase()}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="mini-button"
                          disabled={log.status !== "Draft"}
                          onClick={() => moveStatus(log.id, "Submitted")}
                          type="button"
                        >
                          Submit
                        </button>
                        <button
                          className="mini-button"
                          disabled={log.status !== "Submitted"}
                          onClick={() => moveStatus(log.id, "Reviewed")}
                          type="button"
                        >
                          Review
                        </button>
                        <button
                          className="mini-button"
                          disabled={log.status !== "Reviewed"}
                          onClick={() => moveStatus(log.id, "Approved")}
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          className="icon-button icon-button--table"
                          disabled={log.status === "Approved"}
                          onClick={() => editLog(log)}
                          type="button"
                          aria-label={`Edit week ${log.week} log`}
                        >
                          <FilePenLine size={15} />
                        </button>
                        <button
                          className="icon-button icon-button--danger icon-button--table"
                          onClick={() => deleteLog(log.id)}
                          type="button"
                          aria-label={`Delete week ${log.week} log`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklyLogs;
