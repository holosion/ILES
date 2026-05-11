import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckSquare, ClipboardCheck, FilePenLine, Trash2, Trophy } from "lucide-react";
import {
  createEvaluation,
  deleteEvaluation,
  getEvaluations,
  updateEvaluation,
} from "../api";

const emptyEvaluation = {
  // Empty shape used to reset the evaluation form after a record is saved.
  student: "",
  technical: "",
  communication: "",
  attendance: "",
};

function calculateGrade(total) {
  // Converts the computed percentage into a simple grade label for reports.
  const percentage = total > 100 ? Math.round(total / 3) : total;
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "Needs Support";
}

function calculateTotal(evaluation) {
  // The beginner backend adds the three required marks together.
  return (
    Number(evaluation.technical || 0) +
    Number(evaluation.communication || 0) +
    Number(evaluation.attendance || 0)
  );
}

function Evaluations() {
  // evaluations stores backend records; form stores the values currently being entered.
  const [evaluations, setEvaluations] = useState([]);
  const [form, setForm] = useState(emptyEvaluation);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const liveTotal = useMemo(() => calculateTotal(form), [form]);
  // The live grade changes as the user types scores, before the form is submitted.
  const liveGrade = calculateGrade(liveTotal);

  useEffect(() => {
    // Load evaluations from Django when the page first opens.
    loadEvaluations();
  }, []);

  async function loadEvaluations() {
    // GET /api/evaluations/ reads all evaluations from SQLite.
    try {
      setLoading(true);
      const response = await getEvaluations();
      setEvaluations(response.data);
      setError("");
    } catch {
      setError("Could not load evaluations. Make sure the Django server is running.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    // Update one input field without erasing the other fields.
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // The backend recalculates total, so React sends only the raw scores.
    const nextEvaluation = {
      student: form.student,
      technical: Number(form.technical),
      communication: Number(form.communication),
      attendance: Number(form.attendance),
    };

    try {
      // PUT updates an existing evaluation; POST creates a new one.
      if (editId) {
        await updateEvaluation(editId, nextEvaluation);
      } else {
        await createEvaluation(nextEvaluation);
      }
      await loadEvaluations();
      setForm(emptyEvaluation);
      setEditId(null);
    } catch {
      setError("Could not save the evaluation. Scores must be between 0 and 100.");
    }
  }

  function editEvaluation(evaluation) {
    // Load a saved backend record into the form for editing.
    setForm({
      student: evaluation.student,
      technical: evaluation.technical,
      communication: evaluation.communication,
      attendance: evaluation.attendance,
    });
    setEditId(evaluation.id);
  }

  async function removeEvaluation(id) {
    // DELETE /api/evaluations/id/ removes one evaluation from SQLite.
    try {
      await deleteEvaluation(id);
      await loadEvaluations();
    } catch {
      setError("Could not delete the evaluation.");
    }
  }

  return (
    <section className="page-stack">
      <div className="page-title">
        <span className="eyebrow">Week 9 practical task</span>
        <h1>Academic Evaluation & Weighted Scoring</h1>
        <p>
          Compute final marks from technical ability, communication, and attendance scores stored
          in the Django backend.
        </p>
      </div>

      <div className="cards-container">
        {/* Weight cards make the scoring formula visible before data entry. */}
        <article className="weight-card">
          <span>Technical</span>
          <strong>{form.technical || 0}</strong>
        </article>
        <article className="weight-card">
          <span>Communication</span>
          <strong>{form.communication || 0}</strong>
        </article>
        <article className="weight-card">
          <span>Attendance</span>
          <strong>{form.attendance || 0}</strong>
        </article>
        <article className="weight-card weight-card--total">
          <span>Live Total</span>
          <strong>{liveTotal}</strong>
          <small>{liveGrade}</small>
        </article>
      </div>

      <div className="section-grid">
        {/* The form collects raw marks; calculation happens in JavaScript. */}
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <span className="section-heading__icon">
              <Calculator size={20} />
            </span>
            <div>
              <h2>{editId ? "Edit Evaluation" : "New Evaluation"}</h2>
              <p>Each score is entered out of 100 and added automatically by Django.</p>
            </div>
          </div>

          <label>
            Student Name
            <input
              required
              type="text"
              value={form.student}
              onChange={(event) => updateForm("student", event.target.value)}
              placeholder="Student intern name"
            />
          </label>

          <label>
            Technical Score
            <input
              inputMode="numeric"
              max="100"
              min="0"
              required
              type="number"
              value={form.technical}
              onChange={(event) => updateForm("technical", event.target.value)}
              placeholder="0 - 100"
            />
          </label>

          <label>
            Communication Score
            <input
              inputMode="numeric"
              max="100"
              min="0"
              required
              type="number"
              value={form.communication}
              onChange={(event) => updateForm("communication", event.target.value)}
              placeholder="0 - 100"
            />
          </label>

          <label>
            Attendance Score
            <input
              inputMode="numeric"
              max="100"
              min="0"
              required
              type="number"
              value={form.attendance}
              onChange={(event) => updateForm("attendance", event.target.value)}
              placeholder="0 - 100"
            />
          </label>

          <button className="button button--primary" type="submit">
            <ClipboardCheck size={16} />
            {editId ? "Update Evaluation" : "Submit Evaluation"}
          </button>
          {error ? <div className="inline-note">{error}</div> : null}
        </form>

        {/* Formula panel helps during technical defence and code walkthroughs. */}
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--amber">
              <Trophy size={20} />
            </span>
            <div>
              <h2>Score Formula</h2>
              <p>Transparent computation for technical defense.</p>
            </div>
          </div>
          <div className="formula-box">
            <strong>Total score</strong>
            <span>Technical + Communication + Attendance</span>
          </div>
          <ul className="check-list">
            <li>
              <CheckSquare size={17} />
              Prevents manual total entry mistakes.
            </li>
            <li>
              <CheckSquare size={17} />
              Shows grade immediately before submission.
            </li>
            <li>
              <CheckSquare size={17} />
              Stores computed results for reports.
            </li>
          </ul>
        </article>
      </div>

      {/* Saved results table shows the final computed evaluation records. */}
      <article className="panel table-panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--green">
            <ClipboardCheck size={20} />
          </span>
          <div>
            <h2>Evaluation Records</h2>
            <p>Saved results are persisted in the SQLite database through Django APIs.</p>
          </div>
        </div>

        <div className="responsive-table">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Technical</th>
                <th>Communication</th>
                <th>Attendance</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading evaluations from Django...</td>
                </tr>
              ) : evaluations.length === 0 ? (
                <tr>
                  <td colSpan="7">No evaluations yet. Submit the first evaluation above.</td>
                </tr>
              ) : evaluations.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>
                    <strong>{evaluation.student}</strong>
                    <small>{new Date(evaluation.created_at).toLocaleDateString()}</small>
                  </td>
                  <td>{evaluation.technical}</td>
                  <td>{evaluation.communication}</td>
                  <td>{evaluation.attendance}</td>
                  <td>{evaluation.total}</td>
                  <td>
                    <span className="status status--approved">{calculateGrade(evaluation.total)}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button icon-button--table"
                        onClick={() => editEvaluation(evaluation)}
                        type="button"
                        aria-label={`Edit ${evaluation.student} evaluation`}
                      >
                        <FilePenLine size={15} />
                      </button>
                      <button
                        className="icon-button icon-button--danger icon-button--table"
                        onClick={() => removeEvaluation(evaluation.id)}
                        type="button"
                        aria-label={`Delete ${evaluation.student} evaluation`}
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
      </article>
    </section>
  );
}

export default Evaluations;
