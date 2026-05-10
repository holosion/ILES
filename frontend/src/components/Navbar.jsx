import { Bell, CalendarDays, GraduationCap, Search } from "lucide-react";
import { courseInfo } from "../data/courseData";

function Navbar() {
  return (
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

      <label className="navbar__search" aria-label="Search ILES records">
        <Search size={17} aria-hidden="true" />
        <input type="search" placeholder="Search logs, students, reports" />
      </label>

      <div className="navbar__actions">
        <span className="navbar__chip">
          <CalendarDays size={16} aria-hidden="true" />
          {courseInfo.dayLecture}
        </span>
        <button className="icon-button" type="button" aria-label="View notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
