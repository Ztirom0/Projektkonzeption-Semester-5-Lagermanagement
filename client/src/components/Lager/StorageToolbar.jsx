// src/components/Lager/StorageToolbar.jsx

export default function StorageToolbar({
  locations,
  storageTypes,
  selectedLocationId,
  setSelectedLocationId,
  selectedStorageTypeId,
  setSelectedStorageTypeId
}) {
  const selectedLocation =
    locations.find((l) => l.id === selectedLocationId) ?? null;

  const availableTypes =
    selectedLocation?.storageTypes?.map((t) =>
      typeof t === "object" ? t.id : t
    ) ?? [];

  const typesForLocation = storageTypes.filter((t) =>
    availableTypes.includes(t.id)
  );

  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div className="d-flex flex-column gap-3">
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
                  }}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-1">Lagertyp</div>

            {typesForLocation.length === 0 && (
              <div className="text-muted small">
                Diesem Standort ist noch kein Lagertyp zugewiesen.
              </div>
            )}

            <div className="btn-group flex-wrap">
              {typesForLocation.map((type) => (
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
      </div>
    </div>
  );
}
