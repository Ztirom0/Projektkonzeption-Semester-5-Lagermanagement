// src/components/Dashboard/CriticalItemsTable.jsx
export default function CriticalItemsTable({ items }) {
  const criticalItems = items.filter(s => s?.daysRemaining !== undefined && s.daysRemaining <= 5);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">⏰ Artikel mit kritischem Bestand</h5>
        <small className="text-muted">Weniger als 5 Tage Bestand verbleibend</small>
      </div>
      <div className="card-body">
        {criticalItems.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>SKU</th>
                  <th>Aktueller Bestand</th>
                  <th>Tage verbleibend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {criticalItems
                  .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                  .map(status => (
                    <tr key={status.itemId}>
                      <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                      <td><code>{status.sku || 'N/A'}</code></td>
                      <td>{status.currentQuantity || 0} Stück</td>
                      <td>
                        <span className={`badge ${(status.daysRemaining || 0) <= 2 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {status.daysRemaining !== undefined ? status.daysRemaining : 'N/A'} Tage
                        </span>
                      </td>
                      <td>
                        {status.reorderRecommended ? (
                          <span className="badge bg-danger">Nachbestellung empfohlen</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Beobachten</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted py-4">
            Keine kritischen Artikel vorhanden
          </div>
        )}
      </div>
    </div>
  );
}
