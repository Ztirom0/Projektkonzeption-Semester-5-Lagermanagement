// src/components/DummyHome.jsx

import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import DummyProducts from "./Products/DummyProducts";
import Dummys from "./Lager/Dummys";

import AlarmBell from "./AlarmBell";
import AlertsPanel from "./AlertsPanel";
import { fetchAlerts } from "./Lager/storageDummyData";
import ReportsDashboard from "./Reports/ReportsDashboard";

export default function DummyHome() {
  const [view, setView] = useState("overview");

  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (showAlerts) {
      fetchAlerts().then(setAlerts);
    }
  }, [showAlerts]);

  return (
    <div className="d-flex">
      <Navigation onNavigate={setView} />

      <div className="flex-grow-1" style={{ marginLeft: "260px" }}>
        {/* Glocke immer sichtbar */}
        <div className="d-flex justify-content-end p-3">
          <AlarmBell onOpen={() => setShowAlerts(true)} />
        </div>

        <div className="container py-5">
          {/* OVERVIEW */}
          {view === "overview" && (
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-3">
                Smart Inventory Dashboard
              </h1>
              <p className="text-muted mb-5">
                Willkommen im Smart Inventory Dashboard – alles im Blick, alles unter Kontrolle.
              </p>

              <div className="row g-4 justify-content-center">
                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
                    onClick={() => setView("products")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h2 className="mb-3">🛒</h2>
                      <h5 className="card-title">Produkte</h5>
                      <p className="text-muted">
                        Artikel verwalten und Bestände prüfen
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
                    onClick={() => setView("lager")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h2 className="mb-3">📦</h2>
                      <h5 className="card-title">Lager</h5>
                      <p className="text-muted">
                        Standorte, Zonen & Lagerplätze verwalten
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
                    onClick={() => setView("reports")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h2 className="mb-3">📑</h2>
                      <h5 className="card-title">Berichte</h5>
                      <p className="text-muted">
                        Prognosen & Analysen deiner Bestände
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {view === "products" && (
            <DummyProducts onBack={() => setView("overview")} />
          )}

          {/* LAGER */}
          {view === "lager" && <Dummys onBack={() => setView("overview")} />}

          {/* REPORTS */}
          {view === "reports" && (
            <ReportsDashboard onBack={() => setView("overview")} />
          )}
        </div>
      </div>

      {showAlerts && (
        <AlertsPanel alerts={alerts} onClose={() => setShowAlerts(false)} />
      )}
    </div>
  );
}
