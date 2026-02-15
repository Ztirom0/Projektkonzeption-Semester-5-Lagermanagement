// src/components/AlertsPanel.jsx
// Panel für Bestandswarnungen: sortiert, farblich markiert, klickbar

export default function AlertsPanel({ alerts, onClose, onItemClick }) {
  // Sortiert Alerts nach Schweregrad: CRITICAL → WARNING → Rest
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, WARNING: 1 };
    return (severityOrder[a.type] ?? 2) - (severityOrder[b.type] ?? 2);
  });

  // Farb-Logik für Badge basierend auf Alert-Typ oder Statuslabel
  const getBadgeColor = (alert) => {
    if (alert.type === "CRITICAL" || alert.statusLabel === "Unterschreitung") {
      return "bg-danger";
    }
    if (alert.type === "WARNING" || alert.statusLabel === "Läuft aus") {
      return "bg-warning text-dark";
    }
    return "bg-secondary";
  };

  return (
    <div className="alerts-panel-container">
      <div className="alerts-panel">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Warnungen & Empfehlungen</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Keine Alerts */}
        {sortedAlerts.length === 0 ? (
          <div className="text-muted text-center py-3">
            Keine Warnungen vorhanden.
          </div>
        ) : (
          <div className="alerts-list">

            {/* Alert-Karten */}
            {sortedAlerts.map((a, idx) => (
              <div
                key={idx}
                className={`alert-card ${
                  a.type === "CRITICAL" ? "alert-critical" : "alert-warning"
                }`}
                onClick={() => onItemClick?.(a)}
              >
                <div className="alert-card-header">
                  <div className="alert-item-name">
                    {a.itemName ?? a.itemId}
                  </div>

                  <span className={`badge ${getBadgeColor(a)}`}>
                    {a.statusLabel ?? a.message ?? a.alert ?? "Unterschreitung"}
                  </span>
                </div>

                <div className="alert-card-body">
                  <div className="alert-stat">
                    <span className="alert-label">Bestand:</span>
                    <span className="alert-value">{a.quantity}</span>
                  </div>

                  <div className="alert-stat">
                    <span className="alert-label">Minimum:</span>
                    <span className="alert-value">{a.minQuantity}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .alerts-panel-container {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 380px;
          background: #f8f9fa;
          box-shadow: -4px 0 12px rgba(0,0,0,0.15);
          padding: 20px;
          z-index: 3000;
          animation: slideIn 0.25s ease-out;
          overflow-y: auto;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .alert-card {
          background: white;
          border-radius: 6px;
          border-left: 3px solid #6c757d;
          padding: 8px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .alert-card.alert-critical {
          border-left-color: #dc3545;
          background: #fff9f9;
        }

        .alert-card.alert-warning {
          border-left-color: #ffc107;
          background: #fffef5;
        }

        .alert-card:hover {
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .alert-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
          gap: 6px;
        }

        .alert-item-name {
          font-weight: 600;
          font-size: 12px;
          color: #212529;
          flex: 1;
          word-break: break-word;
          line-height: 1.3;
        }

        .alert-card-body {
          display: flex;
          gap: 10px;
          padding-top: 5px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .alert-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .alert-label {
          font-size: 10px;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
        }

        .alert-value {
          font-size: 13px;
          font-weight: 700;
          color: #212529;
        }

        .alert-critical .alert-value {
          color: #dc3545;
        }

        .alert-warning .alert-value {
          color: #ff9800;
        }

        .badge {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 3px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
