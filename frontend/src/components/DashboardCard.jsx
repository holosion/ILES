function DashboardCard({ title, value, detail, icon: Icon, tone = "blue" }) {
  return (
    // The tone class lets the same reusable card show different dashboard categories.
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <div className="dashboard-card__top">
        {Icon ? (
          <span className="dashboard-card__icon" aria-hidden="true">
            <Icon size={20} strokeWidth={2.2} />
          </span>
        ) : null}
        <span>{title}</span>
      </div>

      <strong>{value}</strong>

      {detail ? <p>{detail}</p> : null}
    </article>
  );
}

export default DashboardCard;
