// src/components/DummyHome.jsx

import { useState, useEffect } from "react";
import Navigation from "./Navigation";

import MainDashboard from "./Dashboard/MainDashboard";
import DummyProducts from "./Products/DummyProducts";
import ProductSearchMask from "./Products/ProductSearchMask";
import CreateProductModal from "./Products/CreateProductModal";
import WarehouseOverview from "./Lager/StorageStats";
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

  useEffect(() => {
    if (showAlerts) {
      getAlerts().then(setAlerts);
    }
  }, [showAlerts]);

  useEffect(() => {
    getAllItems().then(setItems).catch(err => console.error("Fehler beim Laden der Items:", err));
  }, []);

  // Handle navigation from sidebar with modal support
  const handleNavigate = (newView) => {
    if (newView === "products-add") {
      setShowProductModal(true);
    } else if (newView === "lager-location") {
      setShowLocationModal(true);
    } else if (newView === "lager-type") {
      setShowStorageTypeModal(true);
    } else if (newView === "lager-zone") {
      setShowZoneModal(true);
    } else {
      setView(newView);
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

          {/* DASHBOARD VIEW */}
          {view === "dashboard" && (
            <MainDashboard />
          )}

          {/* PRODUCTS VIEWS */}
          {view === "products" && (
            <ProductSearchMask items={items} onAddClick={() => setShowProductModal(true)} />
          )}

          {/* LAGER / WAREHOUSE VIEWS */}
          {view === "lager" && (
            <WarehouseOverview onBack={() => setView("dashboard")} />
          )}

          {/* REPORTS VIEWS */}
          {view === "reports" && (
            <ReportsDashboard onBack={() => setView("dashboard")} />
          )}

        </div>
      </div>

      {/* MODALS FOR ADD OPERATIONS */}
      {showProductModal && (
        <CreateProductModal 
          onClose={() => {
            setShowProductModal(false);
            getAllItems().then(setItems); // Reload items after adding
          }} 
        />
      )}

      {showLocationModal && (
        <AddLocationModal 
          onClose={() => setShowLocationModal(false)} 
        />
      )}

      {showStorageTypeModal && (
        <AddStorageTypeModal 
          onClose={() => setShowStorageTypeModal(false)} 
        />
      )}

      {showZoneModal && (
        <AddZoneModal 
          onClose={() => setShowZoneModal(false)} 
        />
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
