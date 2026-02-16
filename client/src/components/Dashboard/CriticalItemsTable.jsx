// src/components/Dashboard/CriticalItemsTable.jsx
// -------------------------------------------------------------
// Diese Komponente zeigt zwei Tabellen an:
// 1) Artikel, deren Bestand in ≤ 2 Tagen kritisch wird
// 2) Artikel, deren Bestand in ≤ 5 Tagen kritisch wird
// Die Daten werden über die Prop "items" übergeben und hier
// nach Dringlichkeit gefiltert und sortiert.
// -------------------------------------------------------------

export default function CriticalItemsTable({ items }) {

  // Filtert alle Artikel heraus, deren Bestand in 2 Tagen oder weniger aufgebraucht ist
  const critical2Days = items.filter(s => {
    return s?.daysRemaining !== undefined && s.daysRemaining <= 2;
  });

  // Filtert alle Artikel heraus, deren Bestand in 3–5 Tagen aufgebraucht ist
  const critical5Days = items.filter(s => {
    return s?.daysRemaining !== undefined && s.daysRemaining > 2 && s.daysRemaining <= 5;
  });

  return (
    <div className="card shadow-sm">
      {/* Kopfbereich der Karte */}
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">⏰ Artikel mit kritischem Bestand</h5>
        <small className="text-muted">
          Zwei Kategorien: ≤ 2 Tage und ≤ 5 Tage
        </small>
      </div>

      <div className="card-body">

        {/* Falls beide Kategorien leer sind → Hinweis anzeigen */}
        {critical2Days.length === 0 && critical5Days.length === 0 ? (
          <div className="text-center text-muted py-4">
            Keine kritischen Artikel vorhanden
          </div>
        ) : (
          <>
            {/* --------------------------------------------- */}
            {/* Kategorie 1: Bestand kritisch in ≤ 2 Tagen */}
            {/* --------------------------------------------- */}
            <div className="mb-4">

              {/* Titel + Anzahl */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Kritisch (≤ 2 Tage)</h6>
                <span className="badge bg-danger">{critical2Days.length}</span>
              </div>

              {/* Tabelle oder Hinweis, falls leer */}
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
                        // Sortiert nach verbleibenden Tagen (aufsteigend)
                        .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                        .map(status => (
                          <tr key={status.itemId}>
                            <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                            <td><code>{status.sku || 'N/A'}</code></td>
                            <td>{status.currentQuantity || 0} Stück</td>

                            {/* Tage verbleibend */}
                            <td>
                              <span className="badge bg-danger">
                                {status.daysRemaining !== undefined
                                  ? status.daysRemaining
                                  : 'N/A'}{' '}
                                Tage
                              </span>
                            </td>

                            {/* Statusanzeige */}
                            <td>
                              <span className="badge bg-danger">
                                Nachbestellung empfohlen
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted small">
                  Keine Artikel in dieser Kategorie.
                </div>
              )}
            </div>

            {/* --------------------------------------------- */}
            {/* Kategorie 2: Bestand kritisch in ≤ 5 Tagen */}
            {/* --------------------------------------------- */}
            <div>

              {/* Titel + Anzahl */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Warnung (≤ 5 Tage)</h6>
                <span className="badge bg-warning text-dark">
                  {critical5Days.length}
                </span>
              </div>

              {/* Tabelle oder Hinweis */}
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
                        // Sortiert nach verbleibenden Tagen (aufsteigend)
                        .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                        .map(status => (
                          <tr key={status.itemId}>
                            <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                            <td><code>{status.sku || 'N/A'}</code></td>
                            <td>{status.currentQuantity || 0} Stück</td>

                            {/* Tage verbleibend */}
                            <td>
                              <span className="badge bg-warning text-dark">
                                {status.daysRemaining !== undefined
                                  ? status.daysRemaining
                                  : 'N/A'}{' '}
                                Tage
                              </span>
                            </td>

                            {/* Statusanzeige */}
                            <td>
                              <span className="badge bg-warning text-dark">
                                Beobachten
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted small">
                  Keine Artikel in dieser Kategorie.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
