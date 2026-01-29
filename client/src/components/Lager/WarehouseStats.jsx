// src/components/Lager/WarehouseStats.jsx
export default function WarehouseStats({ locations }) {
  const totalTypes = locations.reduce((sum, loc) => sum + (loc.storageTypes?.length || 2), 2);
  const totalZones = locations.reduce((sum, loc) => 
    sum + (loc.storageTypes?.reduce((s, t) => s + (t.zones?.length || 2), 2) || 2), 2
  );
  const totalPlaces = locations.reduce((sum, loc) => 
    sum + (loc.storageTypes?.reduce((s, t) => 
      s + (t.zones?.reduce((z, zone) => z + (zone.places?.length || 2), 2) || 2), 2
    ) || 2), 2
  );

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-2">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagerstandorte</div>
                <div className="fs-3 fw-bold text-primary">{locations.length}</div>
              </div>
              <div className="text-primary opacity-50">
                <i className="bi bi-building" style={{fontSize: '2rem'}}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-2">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagertypen</div>
                <div className="fs-3 fw-bold text-info">{totalTypes}</div>
              </div>
              <div className="text-info opacity-50">
                <i className="bi bi-box-seam" style={{fontSize: '2rem'}}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-2">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Zonen</div>
                <div className="fs-3 fw-bold text-secondary">{totalZones}</div>
              </div>
              <div className="text-secondary opacity-50">
                <i className="bi bi-tag" style={{fontSize: '2rem'}}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card shadow-sm border-2">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Lagerplätze</div>
                <div className="fs-3 fw-bold text-success">{totalPlaces}</div>
              </div>
              <div className="text-success opacity-50">
                <i className="bi bi-diagram-3" style={{fontSize: '2rem'}}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
