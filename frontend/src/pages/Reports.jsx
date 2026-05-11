import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, Building2, FileText, Save, UserRound } from "lucide-react";
import { getCompanies, getDashboardStats, getStudents, getWeeklyReports, updateWeeklyReport } from "../api";

const makerereScale = [
  { range: "90 - 100", grade: "A+", interpretation: "Exceptional" },
  { range: "80 - 89", grade: "A", interpretation: "Excellent" },
  { range: "75 - 79", grade: "B+", interpretation: "Very Good" },
  { range: "70 - 74", grade: "B", interpretation: "Good" },
  { range: "65 - 69", grade: "C+", interpretation: "Fairly Good" },
  { range: "60 - 64", grade: "C", interpretation: "Fair" },
  { range: "55 - 59", grade: "D+", interpretation: "Pass" },
  { range: "50 - 54", grade: "D", interpretation: "Marginal Pass" },
  { range: "45 - 49", grade: "E", interpretation: "Marginal Fail" },
  { range: "40 - 44", grade: "E-", interpretation: "Clear Fail" },
  { range: "1 - 39", grade: "F", interpretation: "Bad Fail" },
];

function makerereGrade(mark) {
  const numericMark = Number(mark);
  if (!numericMark) return "Pending";
  if (numericMark >= 90) return "A+";
  if (numericMark >= 80) return "A";
  if (numericMark >= 75) return "B+";
  if (numericMark >= 70) return "B";
  if (numericMark >= 65) return "C+";
  if (numericMark >= 60) return "C";
  if (numericMark >= 55) return "D+";
  if (numericMark >= 50) return "D";
  if (numericMark >= 45) return "E";
  if (numericMark >= 40) return "E-";
  return "F";
}

function Reports({ account }) {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total_companies: 0,
    total_students: 0,
    total_reports: 0,
    graded_reports: 0,
  });
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [gradeForms, setGradeForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeStudent = useMemo(
    () => students.find((student) => String(student.id) === String(selectedStudent)),
    [selectedStudent, students],
  );

  const loadLecturerData = useCallback(async () => {
    try {
      setLoading(true);
      const [companiesResponse, statsResponse] = await Promise.all([
        getCompanies(),
        getDashboardStats(),
      ]);
      setCompanies(companiesResponse.data);
      setStats(statsResponse.data);
      setError("");
    } catch {
      setError("Could not load lecturer report data. Make sure the Django server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompanyStudents = useCallback(async (companyId) => {
    try {
      const response = await getStudents(companyId);
      setStudents(response.data);
      setSelectedStudent("");
      setReports([]);
    } catch {
      setError("Could not load students for this company.");
    }
  }, []);

  const loadStudentReports = useCallback(async (studentId) => {
    try {
      const response = await getWeeklyReports({ student: studentId });
      setReports(response.data);
      setGradeForms(
        response.data.reduce((forms, report) => {
          forms[report.id] = {
            lecturer_mark: report.lecturer_mark ?? "",
            lecturer_comments: report.lecturer_comments || "",
          };
          return forms;
        }, {}),
      );
    } catch {
      setError("Could not load the selected student's reports.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadLecturerData();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadLecturerData]);

  useEffect(() => {
    if (selectedCompany) {
      const timeoutId = setTimeout(() => {
        loadCompanyStudents(selectedCompany);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [loadCompanyStudents, selectedCompany]);

  useEffect(() => {
    if (selectedStudent) {
      const timeoutId = setTimeout(() => {
        loadStudentReports(selectedStudent);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [loadStudentReports, selectedStudent]);

  function chooseCompany(companyId) {
    setSelectedCompany(companyId);
    setSelectedStudent("");
    setStudents([]);
    setReports([]);
  }

  function chooseStudent(studentId) {
    setSelectedStudent(studentId);
    setReports([]);
  }

  function updateGradeForm(reportId, field, value) {
    setGradeForms((currentForms) => ({
      ...currentForms,
      [reportId]: {
        ...currentForms[reportId],
        [field]: field === "lecturer_mark" ? value.replace(/\D/g, "").slice(0, 3) : value,
      },
    }));
  }

  async function saveGrade(report) {
    const gradeForm = gradeForms[report.id];
    const lecturerMark = Number(gradeForm.lecturer_mark);
    if (lecturerMark < 1 || lecturerMark > 100) {
      setError("Enter a lecturer mark between 1 and 100 before saving.");
      return;
    }

    try {
      await updateWeeklyReport(report.id, {
        student: report.student,
        week_number: report.week_number,
        week_start: report.week_start,
        week_end: report.week_end,
        attendance_days: report.attendance_days,
        activities: report.activities,
        company_comments: report.company_comments,
        lecturer_mark: lecturerMark,
        lecturer_comments: gradeForm.lecturer_comments,
      });
      const studentsResponse = await getStudents(selectedCompany);
      setStudents(studentsResponse.data);
      await Promise.all([loadStudentReports(selectedStudent), loadLecturerData()]);
    } catch {
      setError("Could not save the lecturer mark. Marks must be between 1 and 100.");
    }
  }

  return (
    <section className="page-stack">
      <div className="page-title page-title--row">
        <div>
          <span className="eyebrow">Lecturer workspace</span>
          <h1>Company Reports & Student Grading</h1>
          <p>
            Select a company, open a student profile, review weekly generated reports, and assign
            marks from the attendance, activities, and company comments.
          </p>
        </div>
        <div className="lecturer-badge">
          <UserRound size={18} />
          {account.display_name}
        </div>
      </div>

      <div className="cards-container">
        <article className="report-stat">
          <span>Companies</span>
          <strong>{stats.total_companies}</strong>
        </article>
        <article className="report-stat">
          <span>Students</span>
          <strong>{stats.total_students}</strong>
        </article>
        <article className="report-stat">
          <span>Weekly Reports</span>
          <strong>{stats.total_reports}</strong>
        </article>
        <article className="report-stat">
          <span>Graded</span>
          <strong>{stats.graded_reports}</strong>
        </article>
      </div>

      <div className="section-grid">
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon">
              <Building2 size={20} />
            </span>
            <div>
              <h2>Companies</h2>
              <p>Lecturers can view report data without entering the company workspace.</p>
            </div>
          </div>
          <div className="selection-list">
            {loading ? <div className="inline-note">Loading companies...</div> : null}
            {companies.map((company) => (
              <button
                className={String(selectedCompany) === String(company.id) ? "selection-item active" : "selection-item"}
                key={company.id}
                onClick={() => chooseCompany(company.id)}
                type="button"
              >
                <Building2 size={18} />
                <span>
                  <strong>{company.display_name}</strong>
                  <small>{company.email}</small>
                </span>
              </button>
            ))}
            {!loading && companies.length === 0 ? (
              <div className="inline-note">No company accounts have been verified yet.</div>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <UserRound size={20} />
            </span>
            <div>
              <h2>Students</h2>
              <p>Choose a student to open the generated weekly reports.</p>
            </div>
          </div>
          <div className="selection-list">
            {students.map((student) => (
              <button
                className={String(selectedStudent) === String(student.id) ? "selection-item active" : "selection-item"}
                key={student.id}
                onClick={() => chooseStudent(student.id)}
                type="button"
              >
                {student.photo ? <img src={student.photo} alt={student.name} /> : <UserRound size={18} />}
                <span>
                  <strong>{student.name}</strong>
                  <small>{student.registration_number} / {student.university}</small>
                </span>
              </button>
            ))}
            {selectedCompany && students.length === 0 ? (
              <div className="inline-note">This company has not added students yet.</div>
            ) : null}
          </div>
        </article>
      </div>

      {activeStudent ? (
        <article className="panel student-profile-panel">
          {activeStudent.photo ? (
            <img src={activeStudent.photo} alt={activeStudent.name} />
          ) : (
            <div className="student-profile-panel__avatar">
              {activeStudent.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <span className="eyebrow">Student profile</span>
            <h2>{activeStudent.name}</h2>
            <p>{activeStudent.registration_number} / {activeStudent.university}</p>
            <small>{activeStudent.internship_months} month internship</small>
          </div>
          <div className="final-mark-card">
            <span>Final Mark</span>
            <strong>{activeStudent.final_mark ?? "Pending"}</strong>
            <small>
              {activeStudent.final_mark
                ? `${activeStudent.final_grade} / ${activeStudent.final_interpretation}`
                : "No lecturer marks saved yet"}
            </small>
          </div>
        </article>
      ) : null}

      <article className="panel table-panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--amber">
            <FileText size={20} />
          </span>
          <div>
            <h2>Weekly Reports</h2>
            <p>The lecturer enters each weekly mark manually in the range of 1 to 100.</p>
          </div>
        </div>

        {error ? <div className="inline-note">{error}</div> : null}

        <div className="responsive-table">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Attendance</th>
                <th>Activities</th>
                <th>Company Comment</th>
                <th>Grade</th>
                <th>Lecturer Mark</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6">Select a company and student to view generated weekly reports.</td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>Week {report.week_number}</strong>
                    <small>{report.week_start} to {report.week_end}</small>
                  </td>
                  <td>{report.attendance_days} / 7 days</td>
                  <td>{report.activities}</td>
                  <td>{report.company_comments || "No comment added"}</td>
                  <td>
                    <span className="status status--approved">
                      {report.lecturer_mark === null ? "Pending" : report.grade}
                    </span>
                    <small>{report.interpretation}</small>
                  </td>
                  <td>
                    <div className="grade-controls">
                      <input
                        inputMode="numeric"
                        type="text"
                        value={gradeForms[report.id]?.lecturer_mark ?? ""}
                        onChange={(event) =>
                          updateGradeForm(report.id, "lecturer_mark", event.target.value)
                        }
                        placeholder="1 - 100"
                      />
                      <span className="inline-note">
                        {makerereGrade(gradeForms[report.id]?.lecturer_mark)} grade
                      </span>
                      <textarea
                        rows="2"
                        value={gradeForms[report.id]?.lecturer_comments ?? ""}
                        onChange={(event) =>
                          updateGradeForm(report.id, "lecturer_comments", event.target.value)
                        }
                        placeholder="Lecturer comments"
                      />
                      <button className="button button--primary" onClick={() => saveGrade(report)} type="button">
                        <Save size={16} />
                        Save Mark
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel">
        <div className="section-heading">
          <span className="section-heading__icon">
            <Award size={20} />
          </span>
          <div>
            <h2>Makerere Grading System</h2>
            <p>Final mark is the average of all lecturer-entered weekly marks, kept out of 100.</p>
          </div>
        </div>
        <div className="grade-scale">
          {makerereScale.map((item) => (
            <div className="grade-scale__item" key={item.grade}>
              <strong>{item.grade}</strong>
              <span>{item.range}</span>
              <small>{item.interpretation}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Reports;
