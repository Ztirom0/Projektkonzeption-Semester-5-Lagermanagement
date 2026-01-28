// src/components/Dashboard/StatCard.jsx
export default function StatCard({ icon, value, label, variant = "primary" }) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value || 0}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
