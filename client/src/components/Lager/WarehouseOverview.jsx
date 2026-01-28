// src/components/Lager/WarehouseOverview.jsx

import { useState, useEffect } from "react";
import { getLocations } from "../../api/storageApi";
import WarehouseStats from "./WarehouseStats";
import LocationCard from "./LocationCard";

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
      <WarehouseStats locations={locations} />

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Keine Lagerstandorte vorhanden. Erstellen Sie einen neuen Standort über das Menü.
        </div>
      ) : (
        <div className="locations-list">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isExpanded={expandedLocation === location.id}
              onToggle={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
            />
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

        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}
