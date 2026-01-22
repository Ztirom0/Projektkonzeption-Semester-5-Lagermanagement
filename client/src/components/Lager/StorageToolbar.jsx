// src/components/Lager/StorageToolbar.jsx

import { globalStorageTypes } from "./storageDummyData";

export default function StorageToolbar({
  locations,
  selectedLocationId,
  setSelectedLocationId,
  selectedStorageTypeId,
  setSelectedStorageTypeId
}) {
  const selectedLocation =
    locations.find((l) => l.id === selectedLocationId) ?? null;

  const availableTypes = selectedLocation?.storageTypes ?? [];

  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">

        {/* LINKER BEREICH */}
        <div className="d-flex flex-column gap-3">

          {/* LAGERORTE */}
          <div>
            <div className="fw-semibold mb-1">Lagerort</div>
            <div className="btn-group flex-wrap">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  className={
                    "btn btn-sm " +
                    (loc.id === selectedLocationId
                      ? "btn-primary"
                      : "btn-outline-primary")
                  }
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setSelectedStorageTypeId(
                      locations.find((l) => l.id === loc.id)?.storageTypes[0] ??
                        null
                    );
                  }}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* LAGERTYPEN */}
          <div>
            <div className="fw-semibold mb-1">Lagertyp</div>

            {availableTypes.length === 0 && (
              <div className="text-muted small">
                Diesem Standort ist noch kein Lagertyp zugewiesen.
              </div>
            )}

            <div className="btn-group flex-wrap">
              {globalStorageTypes
                .filter((t) => availableTypes.includes(t.id))
                .map((type) => (
                  <button
                    key={type.id}
                    className={
                      "btn btn-sm " +
                      (type.id === selectedStorageTypeId
                        ? "btn-success"
                        : "btn-outline-success")
                    }
                    onClick={() => setSelectedStorageTypeId(type.id)}
                  >
                    {type.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* rechter Bereich bewusst leer – „anlegen“-Funktionen sind im Funktionen-Modal */}
      </div>
    </div>
  );
}
