// src/components/Dashboard/CriticalItemsTable.jsx
export default function CriticalItemsTable({ items }) {
  const critical2Days = items.filter(s => {
    return s?.daysRemaining !== undefined && s.daysRemaining <= 2;
  });

  const critical5Days = items.filter(s => {
    return s?.daysRemaining !== undefined && s.daysRemaining > 2 && s.daysRemaining <= 5;
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">⏰ Artikel mit kritischem Bestand</h5>
        <small className="text-muted">Zwei Kategorien: ≤ 2 Tage und ≤ 5 Tage</small>
      </div>
      <div className="card-body">
        {critical2Days.length === 0 && critical5Days.length === 0 ? (
          <div className="text-center text-muted py-4">
            Keine kritischen Artikel vorhanden
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Kritisch (≤ 2 Tage)</h6>
                <span className="badge bg-danger">{critical2Days.length}</span>
              </div>
              {critical2Days.length > 0 ? (
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
                      {critical2Days
                        .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                        .map(status => (
                          <tr key={status.itemId}>
                            <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                            <td><code>{status.sku || 'N/A'}</code></td>
                            <td>{status.currentQuantity || 0} Stück</td>
                            <td>
                              <span className="badge bg-danger">
                                {status.daysRemaining !== undefined ? status.daysRemaining : 'N/A'} Tage
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-danger">Nachbestellung empfohlen</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted small">Keine Artikel in dieser Kategorie.</div>
              )}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Warnung (≤ 5 Tage)</h6>
                <span className="badge bg-warning text-dark">{critical5Days.length}</span>
              </div>
              {critical5Days.length > 0 ? (
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
                      {critical5Days
                        .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                        .map(status => (
                          <tr key={status.itemId}>
                            <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                            <td><code>{status.sku || 'N/A'}</code></td>
                            <td>{status.currentQuantity || 0} Stück</td>
                            <td>
                              <span className="badge bg-warning text-dark">
                                {status.daysRemaining !== undefined ? status.daysRemaining : 'N/A'} Tage
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning text-dark">Beobachten</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted small">Keine Artikel in dieser Kategorie.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
