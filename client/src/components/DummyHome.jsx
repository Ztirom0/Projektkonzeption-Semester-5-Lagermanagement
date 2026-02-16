// src/components/DummyHome.jsx
// Hauptcontainer der App: Navigation, Views, Alerts, globale Modals

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
import { getInventory, getInventoryHistory } from "../api/inventoryApi";
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

  // Wenn das Alert-Panel geöffnet wird → Alerts neu berechnen
  useEffect(() => {
    if (!showAlerts) return;

    Promise.all([getAllItems(), getInventory(), getSales()])
      .then(async ([items, inventoryList, sales]) => {
        const historyResults = await Promise.all(
          items.map(item =>
            getInventoryHistory(item.id, 180).catch(() => [])
          )
        );

        const combinedHistory = historyResults.flat();
        const statuses = calculateAllInventoryStatuses(
          items,
          inventoryList,
          sales,
          combinedHistory
        );

        setAlerts(calculateAlerts(statuses));
      });
  }, [showAlerts]);

  // Items initial laden
  useEffect(() => {
    getAllItems().then(setItems);
  }, []);

  // Navigation aus Sidebar
  const handleNavigate = (newView) => {
    if (newView === "products-add") {
      setShowProductModal(true);
    } else {
      setView(newView);
    }
  };

  return (
    <div className="app-wrapper" style={{ marginLeft: "300px" }}>
      <Navigation onNavigate={handleNavigate} />

      <div className="main-content">

        {/* Alarmglocke */}
        <div className="d-flex justify-content-end p-3">
          <AlarmBell onOpen={() => setShowAlerts(true)} />
        </div>

        {/* Alert-Panel */}
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

          {/* Dashboard */}
          {view === "dashboard" && <MainDashboard />}

          {/* Produktsuche */}
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

          {/* Lagerübersicht */}
          {view === "lager" && (
            <WarehouseOverview onBack={() => setView("dashboard")} />
          )}

          {/* Reports */}
          {view === "reports" && (
            <ReportsDashboard onBack={() => setView("dashboard")} />
          )}

          {/* Einzelprodukt-Report */}
          {view === "product-report" && (
            <ProductReportView
              item={selectedProduct}
              onBack={() => setView("products")}
            />
          )}

        </div>
      </div>

      {/* Produkt anlegen */}
      {showProductModal && (
        <CreateProductModal
          onSave={async (itemData) => {
            const created = await createItem(itemData);
            setItems(prev => [created, ...(prev || [])]);
            return created;
          }}
          onClose={() => {
            setShowProductModal(false);
            getAllItems().then(setItems); // Items nach Anlage neu laden
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
