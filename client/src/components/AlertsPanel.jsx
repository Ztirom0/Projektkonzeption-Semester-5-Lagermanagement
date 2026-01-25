// src/components/AlertsPanel.jsx

export default function AlertsPanel({ alerts, onClose }) {
  return (
    <div className="alerts-panel-container">
      <div className="alerts-panel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Warnungen & Empfehlungen</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-muted text-center py-3">
            Keine Warnungen vorhanden.
          </div>
        ) : (
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Artikel</th>
                <th style={{ width: "40%" }}>Platz</th>
                <th>Menge</th>
                <th>Min.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.itemId}</td>

                  {/* Platz-ID: volle Länge, aber schön umbrechbar */}
                  <td>
                    <span className="place-id">
                      {a.placeId}
                    </span>
                  </td>

                  <td>{a.quantity}</td>
                  <td>{a.minQuantity}</td>
                  <td>
                    <span className="badge bg-danger">{a.alert}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .alerts-panel-container {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 380px;
          background: white;
          box-shadow: -4px 0 12px rgba(0,0,0,0.15);
          padding: 20px;
          z-index: 3000;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .place-id {
          display: block;
          font-family: monospace;
          word-break: break-all;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}
