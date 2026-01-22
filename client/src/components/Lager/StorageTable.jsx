// src/components/Lager/StorageTable.jsx

import { zoneCategories } from "./storageDummyData";

export default function StorageTable({
  selectedLocation,
  zones,
  selectedStorageTypeId,
  selectedZoneId,
  setSelectedZoneId
}) {
  const getCategoryName = (id) =>
    zoneCategories.find((c) => c.id === id)?.name ?? "-";

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Struktur – {selectedLocation?.name}</strong>
      </div>

      <div className="card-body p-0">
        <table className="table table-sm table-hover mb-0">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Kategorie</th>
              <th>Plätze</th>
            </tr>
          </thead>

          <tbody>
            {zones.map((zone) => (
              <tr
                key={zone.id}
                className={selectedZoneId === zone.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                <td>{zone.name}</td>
                <td>{getCategoryName(zone.categoryId)}</td>
                <td>{zone.places.length}</td>
              </tr>
            ))}

            {zones.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted text-center py-3">
                  Noch keine Zonen vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
