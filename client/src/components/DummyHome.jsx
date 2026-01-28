// src/components/DummyHome.jsx

import { useState, useEffect } from "react";
import Navigation from "./Navigation";

import MainDashboard from "./Dashboard/MainDashboard";
import ProductSearchMask from "./Products/ProductSearchMask";
import CreateProductModal from "./Products/CreateProductModal";
import WarehouseOverview from "./Lager/WarehouseOverview";
import ReportsDashboard from "./Reports/ReportsDashboard";
import AddLocationModal from "./Lager/AddLocationModal";
import AddStorageTypeModal from "./Lager/AssignStorageTypeModal";
import AddZoneModal from "./Lager/AddZoneModal";

import AlarmBell from "./AlarmBell";
import AlertsPanel from "./AlertsPanel";
import { getAlerts } from "../api/alertsApi";
import { getAllItems } from "../api/itemsApi";

export default function DummyHome() {
  const [view, setView] = useState("dashboard");
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [items, setItems] = useState([]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showStorageTypeModal, setShowStorageTypeModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);

  // Load alerts when panel is opened
  useEffect(() => {
    if (showAlerts) {
      getAlerts().then(setAlerts);
    }
  }, [showAlerts]);

  // Load items once
  useEffect(() => {
    getAllItems()
      .then(setItems)
      .catch(err => console.error("Fehler beim Laden der Items:", err));
  }, []);

  // Navigation handler
  const handleNavigate = (newView) => {
    switch (newView) {
      case "products-add":
        setShowProductModal(true);
        break;
      case "lager-location":
        setShowLocationModal(true);
        break;
      case "lager-type":
        setShowStorageTypeModal(true);
        break;
      case "lager-zone":
        setShowZoneModal(true);
        break;
      default:
        setView(newView);
        break;
    }
  };

  return (
    <div className="app-wrapper" style={{ marginLeft: '300px' }}>
      <Navigation onNavigate={handleNavigate} />

      <div className="main-content">
        {/* Alarm Bell */}
        <div className="d-flex justify-content-end p-3">
          <AlarmBell onOpen={() => setShowAlerts(true)} />
        </div>

        {/* Alerts Panel */}
        {showAlerts && (
          <AlertsPanel alerts={alerts} onClose={() => setShowAlerts(false)} />
        )}

        <div className="container-fluid py-4">

          {/* DASHBOARD */}
          {view === "dashboard" && <MainDashboard />}

          {/* PRODUCTS */}
          {view === "products" && (
            <ProductSearchMask 
              items={items} 
              onAddClick={() => setShowProductModal(true)} 
            />
          )}

          {/* WAREHOUSE */}
          {view === "lager" && (
            <WarehouseOverview onBack={() => setView("dashboard")} />
          )}

          {/* REPORTS */}
          {view === "reports" && (
            <ReportsDashboard onBack={() => setView("dashboard")} />
          )}

        </div>
      </div>

      {/* MODALS */}
      {showProductModal && (
        <CreateProductModal
          onClose={() => {
            setShowProductModal(false);
            getAllItems().then(setItems); // reload items
          }}
        />
      )}

      {showLocationModal && (
        <AddLocationModal onClose={() => setShowLocationModal(false)} />
      )}

      {showStorageTypeModal && (
        <AddStorageTypeModal onClose={() => setShowStorageTypeModal(false)} />
      )}

      {showZoneModal && (
        <AddZoneModal onClose={() => setShowZoneModal(false)} />
      )}

      <style>{`
        .app-wrapper {
          display: flex;
          min-height: 100vh;
          position: relative;
        }
        
        .main-content {
          flex-grow: 1;
          width: 100%;
        }

        @media (max-width: 768px) {
          .app-wrapper {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
