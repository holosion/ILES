import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  ImagePlus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  createStudent,
  createWeeklyReport,
  deleteWeeklyReport,
  getStudents,
  getWeeklyReports,
} from "../api";

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = formatDateInput(new Date());

const emptyStudent = {
  name: "",
  registration_number: "",
  university: "",
  internship_months: 3,
  photo: "",
};

const emptyReport = {
  student: "",
  week_number: 1,
  week_start: today,
  attendance_days: 5,
  activities: "",
  company_comments: "",
};

function addDays(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateInput(date);
}

function WeeklyLogs({ account }) {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [reportForm, setReportForm] = useState(emptyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedStudent = useMemo(
    () => students.find((student) => String(student.id) === String(reportForm.student)),
    [reportForm.student, students],
  );
  const weekEnd = useMemo(() => addDays(reportForm.week_start, 6), [reportForm.week_start]);

  const loadWorkspace = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsResponse, reportsResponse] = await Promise.all([
        getStudents(account.id),
        getWeeklyReports({ company: account.id }),
      ]);
      setStudents(studentsResponse.data);
      setReports(reportsResponse.data);
      setError("");
    } catch {
      setError("Could not load company workspace data. Make sure the Django server is running.");
    } finally {
      setLoading(false);
    }
  }, [account.id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadWorkspace();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadWorkspace]);

  function updateStudentForm(field, value) {
    setStudentForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateReportForm(field, value) {
    setReportForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) {
      updateStudentForm("photo", "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateStudentForm("photo", reader.result);
    reader.readAsDataURL(file);
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();

    try {
      await createStudent({
        ...studentForm,
        company: account.id,
        internship_months: Number(studentForm.internship_months),
      });
      setStudentForm(emptyStudent);
      await loadWorkspace();
    } catch {
      setError("Could not save the student profile. Check the registration number and try again.");
    }
  }

  async function handleReportSubmit(event) {
    event.preventDefault();

    try {
      await createWeeklyReport({
        ...reportForm,
        week_number: Number(reportForm.week_number),
        attendance_days: Number(reportForm.attendance_days),
        week_end: weekEnd,
      });
      setReportForm({
        ...emptyReport,
        student: reportForm.student,
        week_number: Number(reportForm.week_number) + 1,
        week_start: addDays(reportForm.week_start, 7),
      });
      await loadWorkspace();
    } catch {
      setError("Could not generate the weekly report. Each student can have one report per week number.");
    }
  }

  async function removeReport(id) {
    try {
      await deleteWeeklyReport(id);
      await loadWorkspace();
    } catch {
      setError("Could not delete the weekly report.");
    }
  }

  return (
    <section className="page-stack">
      <div className="page-title">
        <span className="eyebrow">Company workspace</span>
        <h1>Intern Student Progress Tracking</h1>
        <p>
          Add intern profiles, select internship duration, record weekly attendance, list
          activities, and submit company comments for lecturer review.
        </p>
      </div>

      <div className="section-grid">
        <form className="panel form-panel" onSubmit={handleStudentSubmit}>
          <div className="section-heading">
            <span className="section-heading__icon">
              <UserPlus size={20} />
            </span>
            <div>
              <h2>Add Student Profile</h2>
              <p>Photo is optional and can be added from the device.</p>
            </div>
          </div>

          <label>
            Student Name
            <input
              required
              type="text"
              value={studentForm.name}
              onChange={(event) => updateStudentForm("name", event.target.value)}
              placeholder="Full name"
            />
          </label>
          <label>
            Registration Number
            <input
              required
              type="text"
              value={studentForm.registration_number}
              onChange={(event) => updateStudentForm("registration_number", event.target.value)}
              placeholder="University registration number"
            />
          </label>
          <label>
            University
            <input
              required
              type="text"
              value={studentForm.university}
              onChange={(event) => updateStudentForm("university", event.target.value)}
              placeholder="University name"
            />
          </label>
          <label>
            Internship Months
            <input
              inputMode="numeric"
              min="1"
              required
              type="number"
              value={studentForm.internship_months}
              onChange={(event) => updateStudentForm("internship_months", event.target.value)}
            />
          </label>
          <label>
            Student Photo
            <input accept="image/*" onChange={handlePhoto} type="file" />
          </label>
          {studentForm.photo ? (
            <img className="profile-preview" src={studentForm.photo} alt="Selected student" />
          ) : (
            <div className="photo-placeholder">
              <ImagePlus size={22} />
              Optional photo
            </div>
          )}
          <button className="button button--primary" type="submit">
            <Save size={16} />
            Save Student
          </button>
        </form>

        <form className="panel form-panel" onSubmit={handleReportSubmit}>
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <FileText size={20} />
            </span>
            <div>
              <h2>Generate Weekly Report</h2>
              <p>Week end is calculated from the selected calendar date.</p>
            </div>
          </div>

          <label>
            Student
            <select
              required
              value={reportForm.student}
              onChange={(event) => updateReportForm("student", event.target.value)}
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} / {student.registration_number}
                </option>
              ))}
            </select>
          </label>

          {selectedStudent ? (
            <div className="student-summary">
              {selectedStudent.photo ? (
                <img src={selectedStudent.photo} alt={selectedStudent.name} />
              ) : (
                <span>{selectedStudent.name.slice(0, 1).toUpperCase()}</span>
              )}
              <div>
                <strong>{selectedStudent.name}</strong>
                <small>{selectedStudent.registration_number}</small>
                <small>{selectedStudent.university}</small>
              </div>
            </div>
          ) : null}

          <div className="form-row">
            <label>
              Week Number
              <input
                inputMode="numeric"
                min="1"
                required
                type="number"
                value={reportForm.week_number}
                onChange={(event) => updateReportForm("week_number", event.target.value)}
              />
            </label>
            <label>
              Attendance
              <input
                inputMode="numeric"
                max="7"
                min="0"
                required
                type="number"
                value={reportForm.attendance_days}
                onChange={(event) => updateReportForm("attendance_days", event.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Week Start
              <input
                required
                type="date"
                value={reportForm.week_start}
                onChange={(event) => updateReportForm("week_start", event.target.value)}
              />
            </label>
            <label>
              Week End
              <input readOnly type="date" value={weekEnd} />
            </label>
          </div>

          <label>
            Activities Done This Week
            <textarea
              required
              rows="5"
              value={reportForm.activities}
              onChange={(event) => updateReportForm("activities", event.target.value)}
              placeholder="List the activities completed by the intern."
            />
          </label>
          <label>
            Company Comments
            <textarea
              rows="4"
              value={reportForm.company_comments}
              onChange={(event) => updateReportForm("company_comments", event.target.value)}
              placeholder="Add the company supervisor's final comment."
            />
          </label>

          <div className="form-actions">
            <button className="button button--primary" disabled={students.length === 0} type="submit">
              <Send size={16} />
              Generate Report
            </button>
            <button className="button button--ghost" onClick={() => setReportForm(emptyReport)} type="button">
              <RotateCcw size={16} />
              Clear
            </button>
          </div>
        </form>
      </div>

      <article className="panel table-panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--amber">
            <CalendarDays size={20} />
          </span>
          <div>
            <h2>Generated Weekly Reports</h2>
            <p>These reports contain the full student profile and are ready for lecturer grading.</p>
          </div>
        </div>

        {error ? <div className="inline-note">{error}</div> : null}

        <div className="responsive-table">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Week</th>
                <th>Attendance</th>
                <th>Activities</th>
                <th>Company Comment</th>
                <th>Lecturer Mark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7">No weekly reports yet. Add a student and generate the first report.</td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.student_profile.name}</strong>
                    <small>{report.student_profile.registration_number}</small>
                    <small>{report.student_profile.university}</small>
                  </td>
                  <td>
                    <strong>Week {report.week_number}</strong>
                    <small>{report.week_start} to {report.week_end}</small>
                  </td>
                  <td>{report.attendance_days} / 7 days</td>
                  <td>{report.activities}</td>
                  <td>{report.company_comments || "No comment added"}</td>
                  <td>
                    <span className="status status--reviewed">
                      {report.lecturer_mark === null ? "Pending" : `${report.lecturer_mark}% / ${report.grade}`}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-button icon-button--danger icon-button--table"
                      onClick={() => removeReport(report.id)}
                      type="button"
                      aria-label={`Delete week ${report.week_number} report`}
                    >
                      <Trash2 size={15} />
                    </button>
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

export default WeeklyLogs;
