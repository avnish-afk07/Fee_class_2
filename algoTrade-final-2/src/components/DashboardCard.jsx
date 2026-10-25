export default function DashboardCard({ label, icon, value, delta, isPositive, style }) {
  return (
    <div className="dashboard-card fade-in" style={style}>
      <div className="dashboard-card-head">
        <span className="dashboard-card-label">{label}</span>
        <span className="dashboard-card-icon">{icon}</span>
      </div>
      <div className="dashboard-card-value mono">{value}</div>
      {delta && (
        <div className={`dashboard-card-delta ${isPositive ? 'text-success' : 'text-danger'}`}>
          <span>{isPositive ? '\u2191' : '\u2193'}</span>
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}
