// src/components/Lager/WarehouseStats.jsx
export default function WarehouseStats({ locations }) {
  const totalTypes = locations.reduce((sum, loc) => sum + (loc.storageTypes?.length || 0), 0);
  const totalZones = locations.reduce((sum, loc) => 
    sum + (loc.storageTypes?.reduce((s, t) => s + (t.zones?.length || 0), 0) || 0), 0
  );
  const totalPlaces = locations.reduce((sum, loc) => 
    sum + (loc.storageTypes?.reduce((s, t) => 
      s + (t.zones?.reduce((z, zone) => z + (zone.places?.length || 0), 0) || 0), 0
    ) || 0), 0
  );

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3 col-6">
        <div className="card border-primary">
          <div className="card-body text-center">
            <div className="fs-2 fw-bold text-primary">{locations.length}</div>
            <div className="text-muted small">Lagerstandorte</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card border-info">
          <div className="card-body text-center">
            <div className="fs-2 fw-bold text-info">{totalTypes}</div>
            <div className="text-muted small">Lagertypen</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card border-secondary">
          <div className="card-body text-center">
            <div className="fs-2 fw-bold text-secondary">{totalZones}</div>
            <div className="text-muted small">Zonen</div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-6">
        <div className="card border-success">
          <div className="card-body text-center">
            <div className="fs-2 fw-bold text-success">{totalPlaces}</div>
            <div className="text-muted small">Lagerplätze</div>
          </div>
        </div>
      </div>
    </div>
  );
}
