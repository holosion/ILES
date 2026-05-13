import { useState } from "react";
import { LockKeyhole, Save, ShieldCheck, SlidersHorizontal, UserCog } from "lucide-react";
import { courseInfo, roles } from "../data/courseData";

const defaultSettings = {
  // Prototype toggles represent business rules that a Django backend would later enforce.
  editingLock: true,
  deadlineAlerts: true,
  supervisorComments: true,
  scoreAutoCompute: true,
};

function Settings() {
  // Load previously saved settings so the switches keep their values after refresh.
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("iles-settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  function toggleSetting(key) {
    // Flip one setting while keeping the other switches unchanged.
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: !currentSettings[key],
    }));
  }

  function saveSettings() {
    // Store workflow-control choices in the browser for this frontend prototype.
    localStorage.setItem("iles-settings", JSON.stringify(settings));
  }

  return (
    <section className="page-stack">
      <div className="page-title">
        <span className="eyebrow">Week 4 and production readiness</span>
        <h1>Role Management & System Settings</h1>
        <p>
          Configure the frontend behaviours that support RBAC, workflow transitions, validation,
          automated score computation, and final defence preparation.
        </p>
      </div>

      <div className="section-grid">
        {/* Role cards explain who uses the system and what each person can do. */}
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon">
              <UserCog size={20} />
            </span>
            <div>
              <h2>Core Roles</h2>
              <p>Permissions reflect the multi-role workflow required by ILES.</p>
            </div>
          </div>
          <div className="role-list">
            {roles.map((role) => (
              <div className="role-card" key={role.name}>
                <strong>{role.name}</strong>
                <span>{role.summary}</span>
                <div>
                  {role.permissions.map((permission) => (
                    <small key={permission}>{permission}</small>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Settings switches model validation and workflow rules before backend integration. */}
        <article className="panel">
          <div className="section-heading">
            <span className="section-heading__icon section-heading__icon--green">
              <SlidersHorizontal size={20} />
            </span>
            <div>
              <h2>Workflow Controls</h2>
              <p>Prototype switches for validation and business rules.</p>
            </div>
          </div>
          <div className="settings-list">
            {Object.entries(settings).map(([key, value]) => (
              <label className="toggle-row" key={key}>
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <input
                  checked={value}
                  onChange={() => toggleSetting(key)}
                  type="checkbox"
                />
              </label>
            ))}
          </div>
          <button className="button button--primary" onClick={saveSettings} type="button">
            <Save size={16} />
            Save Settings
          </button>
        </article>
      </div>

      {/* Defence notes summarize why these frontend screens match the PDF requirements. */}
      <article className="panel">
        <div className="section-heading">
          <span className="section-heading__icon section-heading__icon--amber">
            <ShieldCheck size={20} />
          </span>
          <div>
            <h2>Technical Defence Notes</h2>
            <p>Concise talking points for explaining how the frontend supports the PDF brief.</p>
          </div>
        </div>
        <div className="defence-grid">
          <div>
            <LockKeyhole size={22} />
            <strong>RBAC ready</strong>
            <span>Routes and views are separated by role responsibilities.</span>
          </div>
          <div>
            <ShieldCheck size={22} />
            <strong>Workflow aware</strong>
            <span>Logs move through Draft, Submitted, Reviewed, and Approved states.</span>
          </div>
          <div>
            <Save size={22} />
            <strong>Persistent prototype</strong>
            <span>Browser storage keeps logs, evaluations, and settings between refreshes.</span>
          </div>
        </div>
        <p className="course-footer">
          Prepared for {courseInfo.code}: {courseInfo.title} ({courseInfo.year}) under{" "}
          {courseInfo.lecturer}.
        </p>
      </article>
    </section>
  );
}

export default Settings;
