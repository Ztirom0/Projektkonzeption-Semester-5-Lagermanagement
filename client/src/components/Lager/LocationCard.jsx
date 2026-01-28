// src/components/Lager/LocationCard.jsx
export default function LocationCard({ location, isExpanded, onToggle }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div 
        className="card-header bg-primary bg-opacity-10 d-flex justify-content-between align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={onToggle}
      >
        <div>
          <h5 className="mb-0">
            📍 {location.name}
            <span className="badge bg-primary ms-2">
              {location.storageTypes?.length || 0} Typen
            </span>
          </h5>
          {location.address && (
            <small className="text-muted">{location.address}</small>
          )}
        </div>
        <button className="btn btn-sm btn-link text-decoration-none">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="card-body">
          {(!location.storageTypes || location.storageTypes.length === 0) ? (
            <p className="text-muted mb-0">Keine Lagertypen definiert</p>
          ) : (
            <div className="storage-types">
              {location.storageTypes.map((type) => (
                <StorageTypeSection key={type.id} type={type} />
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

function StorageTypeSection({ type }) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-2">
        <h6 className="mb-0 me-3">
          📦 {type.name}
          <span className="badge bg-info text-dark ms-2">
            {type.zones?.length || 0} Zonen
          </span>
        </h6>
      </div>

      {type.zones && type.zones.length > 0 && (
        <div className="ms-4">
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Zone</th>
                  <th>Plätze</th>
                  <th>Gelagerte Artikel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {type.zones.map((zone) => (
                  <ZoneRow key={zone.id} zone={zone} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneRow({ zone }) {
  return (
    <tr>
      <td className="fw-semibold">🔖 {zone.name}</td>
      <td>{zone.places?.length || 0}</td>
      <td>
        {zone.places && zone.places.length > 0 ? (
          <div>
            {zone.places.map((place, idx) => (
              place.item ? (
                <div key={idx} className="small">
                  <span className="badge bg-success me-1">
                    {place.name || place.code}
                  </span>
                  {place.item.name} 
                  <span className="text-muted">
                    ({place.quantity || 0} Stück)
                  </span>
                </div>
              ) : null
            ))}
            {zone.places.filter(p => !p.item).length > 0 && (
              <div className="small text-muted">
                {zone.places.filter(p => !p.item).length} leere Plätze
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted">Keine Plätze</span>
        )}
      </td>
      <td>
        {zone.places && zone.places.some(p => p.item) ? (
          <span className="badge bg-success">Belegt</span>
        ) : (
          <span className="badge bg-secondary">Leer</span>
        )}
      </td>
    </tr>
  );
}
