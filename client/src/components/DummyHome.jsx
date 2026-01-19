import { useState } from "react";
import Navigation from "./Navigation";
import DummyProducts from "./Products/DummyProducts";
import Dummys from "./Lager/Dummys";   // <-- korrekt zu deinem Ordner
import AlarmBell from "./AlarmBell";

export default function DummyHome() {
  const [view, setView] = useState("overview");

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Navigation onNavigate={setView} />

      {/* Hauptbereich */}
      <div className="flex-grow-1" style={{ marginLeft: "260px" }}>
        <div className="container py-5">

          {/* ---------------- OVERVIEW ---------------- */}
          {view === "overview" && (
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-3">
                Smart Inventory Dashboard
              </h1>

              <p className="text-muted mb-5">
                Willkommen im Smart Inventory Dashboard – alles im Blick, alles unter Kontrolle.
              </p>

              <div className="row g-4 justify-content-center">

                {/* Produkte */}
                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
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

                {/* Lager */}
                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
                    onClick={() => setView("lager")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h2 className="mb-3">📦</h2>
                      <h5 className="card-title">Lager</h5>
                      <p className="text-muted">Standorte, Zonen & Lagerplätze verwalten</p>
                    </div>
                  </div>
                </div>

                {/* Berichte */}
                <div className="col-md-3">
                  <div
                    className="card shadow-sm h-100 text-center border-0 hover-card"
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

          {/* ---------------- PRODUCTS ---------------- */}
          {view === "products" && (
            <DummyProducts onBack={() => setView("overview")} />
          )}

          {/* ---------------- LAGER ---------------- */}
          {view === "lager" && (
            <Dummys onBack={() => setView("overview")} />
          )}

          {/* ---------------- REPORTS ---------------- */}
          {view === "reports" && (
            <div className="text-center">
              <h1 className="mb-3">📑 Berichte</h1>
              <p className="text-muted">Hier kommen deine Auswertungen…</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
