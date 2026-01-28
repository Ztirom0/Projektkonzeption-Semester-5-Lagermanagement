// src/components/Lager/StorageStats.jsx
import { useState, useEffect } from "react";
import { getLocations } from "../../api/storageApi";

export default function StorageStats({ onBack }) {
  const [stats, setStats] = useState({
    locationCount: 0,
    storageTypeCount: 0,
    zoneCount: 0,
    placeCount: 0,
    itemCount: 0,
    criticalCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const locations = await getLocations();
        setStats({
          locationCount: locations.length,
          storageTypeCount: 0,
          zoneCount: 0,
          placeCount: 0,
          itemCount: 0,
          criticalCount: 0
        });
      } catch (error) {
        console.error("Error loading storage stats:", error);
      }
    };
    loadStats();
  }, []);

  const cards = [
    { label: "Lagerorte", value: stats.locationCount, color: "primary" },
    { label: "Lagertypen", value: stats.storageTypeCount, color: "info" },
    { label: "Zonen", value: stats.zoneCount, color: "secondary" },
    { label: "Plätze", value: stats.placeCount, color: "warning" },
    { label: "Artikelzuweisungen", value: stats.itemCount, color: "success" },
    { label: "Kritisch", value: stats.criticalCount, color: "danger" }
  ];

  return (
    <div className="row g-3 mb-3">
      {cards.map((c) => (
        <div key={c.label} className="col-md-2 col-6">
          <div className={`card border-${c.color}`}>
            <div className="card-body py-2">
              <div className="text-muted small">{c.label}</div>
              <div className="fw-bold fs-5">{c.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
