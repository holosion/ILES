import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckSquare, ClipboardCheck, Trophy } from "lucide-react";
import { evaluationWeights, initialEvaluations } from "../data/courseData";

const emptyEvaluation = {
  // Empty shape used to reset the evaluation form after a record is saved.
  student: "",
  workplace: "",
  academic: "",
  logbook: "",
  recommendation: "",
};

function getSavedEvaluations() {
  // Browser storage keeps evaluation records while the frontend has no API connection.
  const savedEvaluations = localStorage.getItem("iles-evaluations");
  return savedEvaluations ? JSON.parse(savedEvaluations) : initialEvaluations;
}

function calculateGrade(total) {
  // Converts the computed percentage into a simple grade label for reports.
  if (total >= 80) return "A";
  if (total >= 70) return "B";
  if (total >= 60) return "C";
  if (total >= 50) return "D";
  return "Needs Support";
}

function calculateTotal(evaluation) {
  // Applies the 40/30/30 weighting from the course outline.
  return Math.round(
    evaluationWeights.reduce((sum, item) => {
      const rawScore = Number(evaluation[item.key] || 0);
      return sum + (rawScore * item.weight) / 100;
    }, 0),
  );
}

function Evaluations() {
  // evaluations stores saved records; form stores the values currently being entered.
  const [evaluations, setEvaluations] = useState(getSavedEvaluations);
  const [form, setForm] = useState(emptyEvaluation);

  const liveTotal = useMemo(() => calculateTotal(form), [form]);
  // The live grade changes as the user types scores, before the form is submitted.
  const liveGrade = calculateGrade(liveTotal);

  useEffect(() => {
    // Save evaluation records locally until Django APIs replace localStorage.
    localStorage.setItem("iles-evaluations", JSON.stringify(evaluations));
  }, [evaluations]);

  function updateForm(field, value) {
    // Update one input field without erasing the other fields.
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Compute total and grade here so users cannot type an incorrect final mark.
    const total = calculateTotal(form);
    const newEvaluation = {
      ...form,
      id: Date.now(),
      workplace: Number(form.workplace),
      academic: Number(form.academic),
      logbook: Number(form.logbook),
      total,
      grade: calculateGrade(total),
    };

    setEvaluations((currentEvaluations) => [newEvaluation, ...currentEvaluations]);
    setForm(emptyEvaluation);
  }

  return (
    <section className="page-stack">
      <div className="page-title">
        <span className="eyebrow">Week 9 practical task</span>
        <h1>Academic Evaluation & Weighted Scoring</h1>
        <p>
          Compute final marks using the course-outline model: workplace supervisor 40 percent,
          academic supervisor 30 percent, and weekly logbook 30 percent.
        </p>
      </div>

      <div className="cards-container">
        {/* Weight cards make the scoring formula visible before data entry. */}
        {evaluationWeights.map((item) => (
          <article className="weight-card" key={item.key}>
            <span>{item.label}</span>
            <strong>{item.weight}%</strong>
          </article>
        ))}
        <article className="weight-card weight-card--total">
          <span>Live Total</span>
          <strong>{liveTotal}%</strong>
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
              <h2>New Evaluation</h2>
              <p>Each score is entered out of 100 and weighted automatically.</p>
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

          {evaluationWeights.map((item) => (
            <label key={item.key}>
              {item.label} Score
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                required
                type="text"
                value={form[item.key]}
                onChange={(event) => updateForm(item.key, event.target.value)}
                placeholder={`0 - 100, weighted at ${item.weight}%`}
              />
            </label>
          ))}

          <label>
            Recommendation
            <textarea
              required
              rows="4"
              value={form.recommendation}
              onChange={(event) => updateForm("recommendation", event.target.value)}
              placeholder="Short academic feedback for the final report."
            />
          </label>

          <button className="button button--primary" type="submit">
            <ClipboardCheck size={16} />
            Submit Evaluation
          </button>
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
            <span>(Workplace x 0.40) + (Academic x 0.30) + (Logbook x 0.30)</span>
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
            <p>Saved results are persisted in browser storage for this frontend prototype.</p>
          </div>
        </div>

        <div className="responsive-table">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Workplace</th>
                <th>Academic</th>
                <th>Logbook</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>
                    <strong>{evaluation.student}</strong>
                    <small>{evaluation.recommendation}</small>
                  </td>
                  <td>{evaluation.workplace}</td>
                  <td>{evaluation.academic}</td>
                  <td>{evaluation.logbook}</td>
                  <td>{evaluation.total}%</td>
                  <td>
                    <span className="status status--approved">{evaluation.grade}</span>
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
