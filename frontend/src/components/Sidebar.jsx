import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { courseInfo, workflowStates } from "../data/courseData";

const links = [
  // Sidebar links define the main pages in one place so navigation is easy to update.
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/weeklyLogs", label: "Weekly Logs", icon: FileText },
  { to: "/Evaluations", label: "Evaluations", icon: ClipboardCheck },
  { to: "/Reports", label: "Reports", icon: BarChart3 },
  { to: "/Settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    // Aside is used because this is supporting navigation beside the main page content.
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__mark" aria-hidden="true">
          <ShieldCheck size={22} />
        </span>
        <div>
          <strong>{courseInfo.systemName}</strong>
          <span>Workflow control panel</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          // NavLink automatically tells us when the current URL matches this link.
          <NavLink
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
            key={to}
            to={to}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* This mini guide helps users remember the correct weekly-log workflow order. */}
      <div className="sidebar__workflow">
        <span>Workflow states</span>
        {workflowStates.map((state) => (
          <small key={state.key}>{state.label}</small>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
