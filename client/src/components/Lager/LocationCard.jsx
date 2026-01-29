// src/components/Lager/LocationCard.jsx
export default function LocationCard({
  location,
  isExpanded,
  onToggle,
  onAddType,
  onAddZone,
  onAddPlace
}) {
  return (
    <div className="card mb-3 shadow-sm">
      <div 
        className="card-header bg-primary bg-opacity-10 d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={onToggle}
      >
        <div>
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-geo-alt me-0"></i>
            {location.name}
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary ms-0">
              {location.storageTypes?.length || 0} Typen
            </span>
          </h5>
          {location.address && (
            <small className="text-muted">{location.address}</small>
          )}
        </div>
        <div className="d-flex align-items-center gap-0">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddType?.();
            }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Lagertyp
          </button>
          <button className="btn btn-sm btn-link text-decoration-none text-primary">
            <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="card-body">
          {(!location.storageTypes || location.storageTypes.length === 0) ? (
            <p className="text-muted mb-0">Keine Lagertypen definiert</p>
          ) : (
            <div className="storage-types">
              {location.storageTypes.map((type) => (
                <StorageTypeSection
                  key={type.id}
                  type={type}
                  onAddZone={onAddZone}
                  onAddPlace={onAddPlace}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .storage-types {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

function StorageTypeSection({ type, onAddZone, onAddPlace }) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-0">
        <h6 className="mb-0 me-3 fw-semibold">
          <i className="bi bi-box-seam me-0 text-primary"></i>
          {type.name}
          <span className="badge bg-info bg-opacity-10 text-info border border-info ms-0">
            {type.zones?.length || 0} Zonen
          </span>
        </h6>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => onAddZone?.(type)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Zone
        </button>
      </div>

      {type.zones && type.zones.length > 0 && (
        <div className="ms-4">
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Zone</th>
                  <th>Plätze</th>
                  <th>Platz-Auslastung</th>
                  <th>Zone-Auslastung</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {type.zones.map((zone) => (
                  <ZoneRow
                    key={zone.id}
                    zone={zone}
                    onAddPlace={onAddPlace}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getUtilization(quantity, capacity) {
  const safeCapacity = Number(capacity) || 0;
  const safeQuantity = Number(quantity) || 0;
  if (safeCapacity <= 0) return 0;
  return Math.min(100, Math.round((safeQuantity / safeCapacity) * 100));
}

function ZoneRow({ zone, onAddPlace }) {
  const places = zone.places || [];
  const totalCapacity = places.reduce((sum, p) => sum + (Number(p.capacity) || 0), 0);
  const totalQuantity = places.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const zoneUtil = totalCapacity > 0 ? Math.min(100, Math.round((totalQuantity / totalCapacity) * 100)) : 0;

  return (
    <tr>
      <td className="fw-semibold">
        <i className="bi bi-tag me-0 text-secondary"></i>
        {zone.name}
        <div>
          <button
            className="btn btn-sm btn-outline-secondary mt-1"
            onClick={() => onAddPlace?.(zone)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Platz
          </button>
        </div>
      </td>
      <td>{places.length}</td>
      <td>
        {places.length > 0 ? (
          <div>
            {places.map((place) => {
              const placeUtil = getUtilization(place.quantity, place.capacity);
              const capacityLabel = place.capacity ?? 0;
              const quantityLabel = place.quantity ?? 0;
              return (
                <div key={place.id} className="small mb-1">
                  <span className="badge bg-secondary bg-opacity-10 text-secondary border me-1">
                    <i className="bi bi-diagram-3 me-1"></i>
                    {place.code}
                  </span>
                  <span className={place.item ? "text-dark fw-medium" : "text-muted"}>
                    {place.item?.name ?? "leer"}
                  </span>
                  <span className="text-muted ms-0">
                    {quantityLabel}/{capacityLabel} ({placeUtil}%)
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-muted">Keine Plätze</span>
        )}
      </td>
      <td>
        <div className="small">
          <div className="fw-semibold">{zoneUtil}%</div>
          <div className="text-muted">
            {totalQuantity}/{totalCapacity}
          </div>
        </div>
      </td>
      <td>
        {places.some(p => (p.quantity || 0) > 0) ? (
          <span className="badge bg-success bg-opacity-10 text-success border border-success">
            <i className="bi bi-check-circle me-1"></i>
            Belegt
          </span>
        ) : (
          <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
            <i className="bi bi-circle me-1"></i>
            Leer
          </span>
        )}
      </td>
    </tr>
  );
}
