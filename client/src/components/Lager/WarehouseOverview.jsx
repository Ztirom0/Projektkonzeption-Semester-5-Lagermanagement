// src/components/Lager/WarehouseOverview.jsx

import { useState, useEffect } from "react";
import { getLocations } from "../../api/storageApi";

export default function WarehouseOverview({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const locs = await getLocations();
        console.log("Loaded locations:", locs);
        setLocations(locs);
      } catch (error) {
        console.error("Error loading warehouse data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
    } else {
      onBack();
    }
  };

  if (loading) {
    return <div className="text-center p-5">Lade Lagerstrukturen...</div>;
  }

  return (
    <div className="warehouse-overview">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">🏭 Lagerstrukturen</h1>
          <p className="text-muted mb-0">
            {!selectedLocation && "Wählen Sie einen Standort"}
            {selectedLocation && !selectedStorageType && `${selectedLocation.name} - Lagertypen`}
            {selectedLocation && selectedStorageType && `${selectedLocation.name} > ${selectedStorageType.name} - Zonen`}
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          ⬅ Zurück
        </button>
      </div>
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="warehouse-overview">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">🏭 Lagerübersicht</h2>
          <p className="text-muted mb-0">Standorte, Typen, Zonen und gelagerte Artikel</p>
        </div>
      </div>

      {/* Stats Summary */}
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
              <div className="fs-2 fw-bold text-info">
                {locations.reduce((sum, loc) => sum + (loc.storageTypes?.length || 0), 0)}
              </div>
              <div className="text-muted small">Lagertypen</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-secondary">
            <div className="card-body text-center">
              <div className="fs-2 fw-bold text-secondary">
                {locations.reduce((sum, loc) => 
                  sum + (loc.storageTypes?.reduce((s, t) => s + (t.zones?.length || 0), 0) || 0), 0
                )}
              </div>
              <div className="text-muted small">Zonen</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-success">
            <div className="card-body text-center">
              <div className="fs-2 fw-bold text-success">
                {locations.reduce((sum, loc) => 
                  sum + (loc.storageTypes?.reduce((s, t) => 
                    s + (t.zones?.reduce((z, zone) => z + (zone.places?.length || 0), 0) || 0), 0
                  ) || 0), 0
                )}
              </div>
              <div className="text-muted small">Lagerplätze</div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Keine Lagerstandorte vorhanden. Erstellen Sie einen neuen Standort über das Menü.
        </div>
      ) : (
        <div className="locations-list">
          {locations.map((location) => (
            <div key={location.id} className="card mb-3 shadow-sm">
              <div 
                className="card-header bg-primary bg-opacity-10 d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
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
                  {expandedLocation === location.id ? '▼' : '▶'}
                </button>
              </div>

              {expandedLocation === location.id && (
                <div className="card-body">
                  {/* Storage Types */}
                  {(!location.storageTypes || location.storageTypes.length === 0) ? (
                    <p className="text-muted mb-0">Keine Lagertypen definiert</p>
                  ) : (
                    <div className="storage-types">
                      {location.storageTypes.map((type) => (
                        <div key={type.id} className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 me-3">
                              📦 {type.name}
                              <span className="badge bg-info text-dark ms-2">
                                {type.zones?.length || 0} Zonen
                              </span>
                            </h6>
                          </div>

                          {/* Zones */}
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
                                      <tr key={zone.id}>
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
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .warehouse-overview {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header:hover {
          background-color: rgba(13, 110, 253, 0.15) !important;
        }

        .storage-types {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}
