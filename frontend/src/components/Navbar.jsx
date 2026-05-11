import { Bell, CalendarDays, GraduationCap, LogOut, Search } from "lucide-react";
import { courseInfo } from "../data/courseData";

function Navbar({ account, onLogout }) {
  return (
    // Header stays visible at the top so users always know which system they are using.
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">
          <GraduationCap size={24} />
        </span>
        <div>
          <strong>{courseInfo.systemShortName}</strong>
          <span>{courseInfo.code} Frontend Workspace</span>
        </div>
      </div>

      {/* Search is currently visual, ready to be connected to backend filtering later. */}
      <label className="navbar__search" aria-label="Search ILES records">
        <Search size={17} aria-hidden="true" />
        <input type="search" placeholder="Search logs, students, reports" />
      </label>

      {/* Lecture time reminds students which CSC 1202 schedule this frontend follows. */}
      <div className="navbar__actions">
        <span className="navbar__chip">
          <CalendarDays size={16} aria-hidden="true" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="navbar__chip">
          <GraduationCap size={16} aria-hidden="true" />
          {account.display_name}
        </span>
        <button className="icon-button" type="button" aria-label="View notifications">
          <Bell size={18} />
        </button>
        <button className="icon-button" onClick={onLogout} type="button" aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
