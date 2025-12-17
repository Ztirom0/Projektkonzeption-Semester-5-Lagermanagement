import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlarmBell from "./AlarmBell";
import DummyStorages from "./DummyStorages";
import DummyProducts from "./Products/DummyProducts";
import Navigation from "./Navigation";  

export default function DummyHome() {
  const [view, setView] = useState("overview");

  return (
    <div>
      {/* Navigation */}
      <Navigation onNavigate={setView} />

      {/* Hauptbereich */}
      <div className="container py-5">
        {view === "overview" && (
          <div className="text-center">
            {/* Hero Section */}
            <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
              DUMMY
            </h1>
            <p className="text-muted mb-5 animate__animated animate__fadeInUp">
              Willkommen im Smart Inventory Dashboard – alles im Blick, alles unter Kontrolle.
            </p>

            {/* Animierte Cards für Navigation */}
            <div className="row g-4 justify-content-center">
              <div className="col-md-3">
                <div
                  className="card shadow-sm h-100 text-center border-0 hover-card animate__animated animate__zoomIn"
                  onClick={() => setView("products")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h2 className="mb-3">🛒</h2>
                    <h5 className="card-title">Produkte</h5>
                    <p className="text-muted">Artikel verwalten und Bestände prüfen</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className="card shadow-sm h-100 text-center border-0 hover-card animate__animated animate__zoomIn animate__delay-1s"
                  onClick={() => setView("storages")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h2 className="mb-3">🏭</h2>
                    <h5 className="card-title">Lager</h5>
                    <p className="text-muted">Standorte und Lagerbestände im Überblick</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className="card shadow-sm h-100 text-center border-0 hover-card animate__animated animate__zoomIn animate__delay-2s"
                  onClick={() => setView("reports")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h2 className="mb-3">📑</h2>
                    <h5 className="card-title">Berichte</h5>
                    <p className="text-muted">Analysen und Auswertungen deiner Bestände</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "products" && <DummyProducts onBack={() => setView("overview")} />}
        {view === "storages" && <DummyStorages onBack={() => setView("overview")} />}
        {view === "reports" && (
          <div className="text-center">
            <h1 className="mb-3">📑 Berichte</h1>
            <p className="text-muted">Hier kommen deine Auswertungen…</p>
          </div>
        )}
      </div>
    </div>
  );
}

  {/* Optional: AlarmBell direkt unter der Navigation 
      <div className="container py-3">
        <AlarmBell />
      </div> */}