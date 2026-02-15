// src/components/Lager/WarehouseStats.jsx
// Kompakte Übersicht über Standorte, Lagertypen, Zonen und Plätze

export default function WarehouseStats({ locations }) {
  // Anzahl aller Lagertypen über alle Standorte
  const totalTypes = locations.reduce(
    (sum, loc) => sum + (loc.storageTypes?.length || 0),
    0
  );

  // Anzahl aller Zonen über alle Lagertypen
  const totalZones = locations.reduce(
    (sum, loc) =>
      sum +
      (loc.storageTypes?.reduce(
        (s, t) => s + (t.zones?.length || 0),
        0
      ) || 0),
    0
  );

  // Anzahl aller Plätze über alle Zonen
  const totalPlaces = locations.reduce(
    (sum, loc) =>
      sum +
      (loc.storageTypes?.reduce(
        (s, t) =>
          s +
          (t.zones?.reduce(
            (z, zone) => z + (zone.places?.length || 0),
            0
          ) || 0),
        0
      ) || 0),
    0
  );

  return (
    <div className="row g-3 mb-4">

      {/* Standorte */}
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagerstandorte</div>
                <div className="fs-3 fw-bold text-primary">
                  {locations.length}
                </div>
              </div>
              <div className="text-primary opacity-50">
                <i className="bi bi-building" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lagertypen */}
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagertypen</div>
                <div className="fs-3 fw-bold text-info">{totalTypes}</div>
              </div>
              <div className="text-info opacity-50">
                <i className="bi bi-box-seam" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zonen */}
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Zonen</div>
                <div className="fs-3 fw-bold text-secondary">{totalZones}</div>
              </div>
              <div className="text-secondary opacity-50">
                <i className="bi bi-tag" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plätze */}
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagerplätze</div>
                <div className="fs-3 fw-bold text-success">{totalPlaces}</div>
              </div>
              <div className="text-success opacity-50">
                <i className="bi bi-diagram-3" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
