// src/components/DummyHome.jsx

import { useState, useEffect } from "react";
import Navigation from "./Navigation";

import MainDashboard from "./Dashboard/MainDashboard";
import ProductSearchMask from "./Products/ProductSearchMask";
import CreateProductModal from "./Products/CreateProductModal";
import WarehouseOverview from "./Lager/WarehouseOverview";
import ReportsDashboard from "./Reports/ReportsDashboard";
import ProductReportView from "./Reports/ProductReportView";

import AlarmBell from "./AlarmBell";
import AlertsPanel from "./AlertsPanel";
import { createItem, getAllItems } from "../api/itemsApi";
import { getInventory } from "../api/inventoryApi";
import { getSales } from "../api/salesApi";
import { calculateAlerts } from "../api/alertsApi";
import { calculateAllInventoryStatuses } from "../api/inventoryCalculations";

export default function DummyHome() {
  const [view, setView] = useState("dashboard");
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    if (showAlerts) {
      // Lade alle notwendigen Daten und berechne Alerts im Frontend
      Promise.all([getAllItems(), getInventory(), getSales()])
        .then(([items, inventoryList, sales]) => {
          const statuses = calculateAllInventoryStatuses(items, inventoryList, sales);
          const calculatedAlerts = calculateAlerts(statuses);
          setAlerts(calculatedAlerts);
        })
    }
  }, [showAlerts]);

  useEffect(() => {
    getAllItems().then(setItems);
  }, []);

  // Handle navigation from sidebar with modal support
  const handleNavigate = (newView) => {
    if (newView === "products-add") {
      setShowProductModal(true);
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
          <AlertsPanel 
            alerts={alerts} 
            onClose={() => setShowAlerts(false)}
            onItemClick={(alert) => {
              const itemToShow = items.find(i => i.id === alert.itemId);
              if (itemToShow) {
                setSelectedProduct(itemToShow);
                setView("product-report");
                setShowAlerts(false);
              }
            }}
          />
        )}

        <div className="container-fluid py-4">

          {/* DASHBOARD VIEW */}
          {view === "dashboard" && (
            <MainDashboard />
          )}

          {/* PRODUCTS VIEWS */}
          {view === "products" && (
            <ProductSearchMask
              items={items}
              onAddNew={() => setShowProductModal(true)}
              onSelect={(item) => {
                setSelectedProduct(item);
                setView("product-report");
              }}
            />
          )}

          {/* LAGER / WAREHOUSE VIEWS */}
          {view === "lager" && (
            <WarehouseOverview onBack={() => setView("dashboard")} />
          )}

          {/* REPORTS VIEWS */}
          {view === "reports" && (
            <ReportsDashboard onBack={() => setView("dashboard")} />
          )}

          {view === "product-report" && (
            <ProductReportView
              item={selectedProduct}
              onBack={() => setView("products")}
            />
          )}

        </div>
      </div>

      {/* MODALS FOR ADD OPERATIONS */}
      {showProductModal && (
        <CreateProductModal 
          onSave={async (itemData) => {
            const created = await createItem(itemData);
            setItems((prev) => [created, ...(prev || [])]);
            return created;
          }}
          onClose={() => {
            setShowProductModal(false);
            getAllItems().then(setItems); // Reload items after adding
          }} 
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
