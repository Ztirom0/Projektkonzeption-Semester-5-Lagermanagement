// src/components/Lager/WarehouseOverview.jsx

import { useState, useEffect } from "react";
import { getLocations, getZonesByStorageType, getZoneCategories } from "../../api/storageApi";
import WarehouseStats from "./WarehouseStats";
import LocationCard from "./LocationCard";
import AddLocationModal from "./AddLocationModal";
import AddStorageTypeModal from "./AddStorageTypeModal";
import AddZoneModal from "./AddZoneModal";
import AddPlaceModal from "./AddPlaceModal";

export default function WarehouseOverview({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [zoneCategories, setZoneCategories] = useState([]);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);

  const [activeLocation, setActiveLocation] = useState(null);
  const [activeStorageType, setActiveStorageType] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [locs, cats] = await Promise.all([
          getLocations(),
          getZoneCategories()
        ]);

        const enriched = await Promise.all(
          locs.map(async (loc) => {
            const storageTypes = await Promise.all(
              (loc.storageTypes || []).map(async (type) => {
                const zones = await getZonesByStorageType(type.id);
                return { ...type, zones };
              })
            );

            return { ...loc, storageTypes };
          })
        );
        setLocations(enriched);
        setZoneCategories(cats);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLocationCreated = (newLocation) => {
    setLocations((prev) => [...prev, { ...newLocation, storageTypes: [] }]);
  };

  const handleStorageTypeCreated = (locationId, newType) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              storageTypes: [...(loc.storageTypes || []), { ...newType, zones: [] }]
            }
          : loc
      )
    );
  };

  const handleZoneCreated = (storageTypeId, newZone) => {
    setLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        storageTypes: (loc.storageTypes || []).map((type) =>
          type.id === storageTypeId
            ? { ...type, zones: [...(type.zones || []), newZone] }
            : type
        )
      }))
    );
  };

  const handlePlaceCreated = (zoneId, newPlace) => {
    setLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        storageTypes: (loc.storageTypes || []).map((type) => ({
          ...type,
          zones: (type.zones || []).map((zone) =>
            zone.id === zoneId
              ? { ...zone, places: [...(zone.places || []), newPlace] }
              : zone
          )
        }))
      }))
    );
  };

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
          <h2 className="mb-1 fw-bold">
            <i className="bi bi-building me-0"></i>
            Lagerübersicht
          </h2>
          <p className="text-muted mb-0">Standorte, Typen, Zonen und gelagerte Artikel</p>
        </div>
        <button
          className="btn btn-primary shadow-sm"
          onClick={() => setShowAddLocation(true)}
        >
          <i className="bi bi-plus-circle me-0"></i>
          Standort anlegen
        </button>
      </div>

      {/* Stats Summary */}
      <WarehouseStats locations={locations} />

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="alert alert-light border">
          <i className="bi bi-info-circle me-0 text-primary"></i>
          Keine Lagerstandorte vorhanden. Erstellen Sie einen neuen Standort über den Button oben rechts.
        </div>
      ) : (
        <div className="locations-list">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isExpanded={expandedLocation === location.id}
              onToggle={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
              onAddType={() => {
                setActiveLocation(location);
                setShowAddType(true);
              }}
              onAddZone={(storageType) => {
                setActiveLocation(location);
                setActiveStorageType(storageType);
                setShowAddZone(true);
              }}
              onAddPlace={(zone) => {
                setActiveZone(zone);
                setShowAddPlace(true);
              }}
            />
          ))}
        </div>
      )}

      {showAddLocation && (
        <AddLocationModal
          onCreated={handleLocationCreated}
          onClose={() => setShowAddLocation(false)}
        />
      )}

      {showAddType && activeLocation && (
        <AddStorageTypeModal
          location={activeLocation}
          onCreated={handleStorageTypeCreated}
          onClose={() => setShowAddType(false)}
        />
      )}

      {showAddZone && activeStorageType && (
        <AddZoneModal
          locationId={activeLocation?.id}
          storageTypeId={activeStorageType.id}
          zoneCategories={zoneCategories}
          onCreated={handleZoneCreated}
          onClose={() => setShowAddZone(false)}
        />
      )}

      {showAddPlace && activeZone && (
        <AddPlaceModal
          zone={activeZone}
          onCreated={handlePlaceCreated}
          onClose={() => setShowAddPlace(false)}
        />
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

        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}
