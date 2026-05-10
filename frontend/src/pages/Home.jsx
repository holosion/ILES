import {
  BookOpenCheck,
  ClipboardList,
  Gauge,
  GitBranch,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import {
  courseInfo,
  courseWeeks,
  initialEvaluations,
  initialLogs,
  modules,
  placements,
  roles,
  workflowStates,
} from "../data/courseData";

function Home() {
  const approvedLogs = initialLogs.filter((log) => log.status === "Reviewed").length;
  const averageScore = Math.round(
    initialEvaluations.reduce((sum, evaluation) => sum + evaluation.total, 0) /
      initialEvaluations.length,
  );

  return (
    <section className="page-stack">
      <div className="hero-panel">
        <div className="hero-panel__content">
          <span className="eyebrow">{courseInfo.code} / {courseInfo.year}</span>
          <h1>{courseInfo.systemName}</h1>
          <p>
            A practical React frontend for managing internship placements, weekly logbooks,
            supervisor reviews, academic evaluations, weighted scoring, and institutional
            dashboards.
          </p>
          <div className="hero-panel__actions">
            <a className="button button--primary" href="/weeklyLogs">
              Open Logbook
            </a>
            <a className="button button--secondary" href="/Reports">
              View Reports
            </a>
          </div>
        </div>

        <div className="hero-panel__summary" aria-label="Course summary">
          <span>Lecturer</span>
          <strong>{courseInfo.lecturer}</strong>
          <span>Email</span>
          <strong>{courseInfo.email}</strong>
          <span>Lecture hours</span>
          <strong>{courseInfo.dayLecture}</strong>
          <strong>{courseInfo.eveningLecture}</strong>
        </div>
      </div>

      <div className="cards-container">
        <DashboardCard
          detail="Student, workplace, academic, and administrator views"
          icon={UsersRound}
          title="Core Roles"
          tone="teal"
          value={roles.length}
        />
        <DashboardCard
          detail="Draft to approved logbook workflow"
          icon={GitBranch}
          title="Workflow States"
          tone="blue"
          value={workflowStates.length}
        />
        <DashboardCard
          detail={`${approvedLogs} reviewed in the prototype dataset`}
          icon={ClipboardList}
          title="Weekly Logs"
          tone="amber"
          value={initialLogs.length}
        />
        <DashboardCard
          detail="Weighted from workplace, academic, and logbook marks"
          icon={Gauge}
          title="Average Score"
          tone="green"
          value={`${averageScore}%`}
        />
      </div>

      <div className="section-grid section-grid--wide-left">
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon">
              <LayoutDashboard size={20} />
            </span>
            <div>
              <h2>ILES Core Modules</h2>
              <p>Built from the project modules listed in the course outline.</p>
            </div>
          </div>
          <div className="module-grid">
            {modules.map((module) => (
              <span className="module-pill" key={module}>
                {module}
              </span>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <BookOpenCheck size={20} />
            </span>
            <div>
              <h2>Active Placements</h2>
              <p>Current internship assignments prepared for dashboard tracking.</p>
            </div>
          </div>
          <div className="placement-list">
            {placements.map((placement) => (
              <div className="placement-item" key={placement.student}>
                <strong>{placement.student}</strong>
                <span>{placement.organization}</span>
                <small>{placement.supervisor} / {placement.period}</small>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--amber">
            <ClipboardList size={20} />
          </span>
          <div>
            <h2>Course Build Timeline</h2>
            <p>Each frontend screen maps to a practical milestone from the 12-week plan.</p>
          </div>
        </div>
        <div className="timeline">
          {courseWeeks.map((item) => (
            <div className="timeline__item" key={item.week}>
              <span>Week {item.week}</span>
              <strong>{item.title}</strong>
              <small>{item.deliverable}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Home;
