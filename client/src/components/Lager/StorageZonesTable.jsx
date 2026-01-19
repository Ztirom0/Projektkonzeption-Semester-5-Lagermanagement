// src/components/Lager/StorageZonesTable.jsx

export default function StorageZonesTable({
  selectedLocation,
  zones,
  allPlaces,
  items,
  selectedPlaceId,
  setSelectedPlaceId
}) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-bold">Plätze & Artikel</div>

      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Platz</th>
            <th>Artikel</th>
            <th>Menge</th>
            <th>Min.</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {allPlaces.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted py-3">
                Keine Plätze in dieser Zone
              </td>
            </tr>
          )}

          {allPlaces.map((p) => {
            const item = items.find((i) => i.placeId === p.id);

            return (
              <tr
                key={p.id}
                className={selectedPlaceId === p.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPlaceId(p.id)}
              >
                <td>{p.code}</td>
                <td>{item ? item.productId : "–"}</td>
                <td>{item ? item.quantity : "–"}</td>
                <td>{item ? item.minQuantity : "–"}</td>
                <td>
                  {item ? (
                    item.quantity <= item.minQuantity ? (
                      <span className="badge bg-danger">Kritisch</span>
                    ) : (
                      <span className="badge bg-success">OK</span>
                    )
                  ) : (
                    <span className="badge bg-secondary">Leer</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
