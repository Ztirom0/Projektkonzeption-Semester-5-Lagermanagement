// src/components/DummyHome.jsx

import { useState, useEffect } from "react";
import Navigation from "./Navigation";

import DummyProducts from "./Products/DummyProducts";
import Dummys from "./Lager/Dummys";
import ReportsDashboard from "./Reports/ReportsDashboard";

import AlarmBell from "./AlarmBell";
import AlertsPanel from "./AlertsPanel";
import { getAlerts } from "../api/alertsApi";

export default function DummyHome() {
  const [view, setView] = useState("overview");
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (showAlerts) {
      getAlerts().then(setAlerts);
    }
  }, [showAlerts]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerParallax = { transform: `translateY(${scrollY * 0.12}px)` };
  const cardsParallax = { transform: `translateY(${scrollY * 0.05}px)` };

  return (
    <div className="app-wrapper">
      <Navigation onNavigate={setView} />

      <div className="main-content">

        {/* Alarm Bell */}
        <div className="d-flex justify-content-end p-3">
          <AlarmBell onOpen={() => setShowAlerts(true)} />
        </div>

        {/* Full Background */}
        <div className="page-background"></div>

        <div className="container py-5">

          {view === "overview" && (
            <div className="homepage-wrapper">

              {/* Floating Inventory Nodes */}
              <div className="inv-node node-1"></div>
              <div className="inv-node node-2"></div>
              <div className="inv-node node-3"></div>

              {/* Header */}
              <div className="text-center mb-5 homepage-header" style={headerParallax}>
                <h1 className="fw-bold display-5 text-dark">Smart Inventory Management</h1>
                <p className="text-muted fs-5">
                  Optimierte Lagerprozesse, intelligente Prognosen und datengetriebene Entscheidungen.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="row g-4 justify-content-center homepage-grid" style={cardsParallax}>

                <div className="col-lg-4 col-md-6">
                  <div className="home-card" onClick={() => setView("products")}>
                    <div className="home-card-icon icon-products">
                      <i className="bi bi-boxes"></i>
                    </div>
                    <h5 className="mt-3 fw-semibold">Produkte</h5>
                    <p className="text-muted small">
                      Artikelverwaltung, Bestandsübersicht und Produktanalysen.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="home-card" onClick={() => setView("lager")}>
                    <div className="home-card-icon icon-lager">
                      <i className="bi bi-warehouse"></i>
                    </div>
                    <h5 className="mt-3 fw-semibold">Lager</h5>
                    <p className="text-muted small">
                      Standorte, Lagertypen, Zonen und Lagerplätze verwalten.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="home-card" onClick={() => setView("reports")}>
                    <div className="home-card-icon icon-reports">
                      <i className="bi bi-bar-chart-line"></i>
                    </div>
                    <h5 className="mt-3 fw-semibold">Berichte</h5>
                    <p className="text-muted small">
                      Verkaufsdaten, Prognosen und intelligente Empfehlungen.
                    </p>
                  </div>
                </div>

              </div>

              {/* Styles */}
              <style>{`
                /* GLOBAL FULL BACKGROUND */
                .page-background {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(180deg, #eef0ff 0%, #ffffff 75%);
                  z-index: -2;
                }

                .homepage-wrapper {
                  position: relative;
                  overflow: hidden;
                  padding-bottom: 150px;
                }

                /* INVENTORY NODES */
                .inv-node {
                  position: absolute;
                  border-radius: 50%;
                  background: radial-gradient(circle, rgba(76,44,160,0.25), transparent 70%);
                  animation: float 12s ease-in-out infinite alternate;
                }

                .node-1 { width: 140px; height: 140px; top: -40px; right: -60px; }
                .node-2 { width: 110px; height: 110px; bottom: -40px; left: -40px; animation-delay: 2s; }
                .node-3 { width: 90px; height: 90px; top: 45%; left: 62%; animation-delay: 4s; }

                @keyframes float {
                  0% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-20px) scale(1.05); }
                  100% { transform: translateY(10px) scale(1.02); }
                }

                /* CARDS */
                .home-card {
                  background: white;
                  border-radius: 18px;
                  padding: 40px 28px;
                  text-align: center;
                  cursor: pointer;
                  transition: all 0.35s ease;
                  border: 1px solid rgba(0,0,0,0.04);
                  position: relative;
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
                }

                /* SMALL HALO BEHIND ICON */
                .home-card::before {
                  content: "";
                  position: absolute;
                  width: 120px;
                  height: 120px;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%) scale(0.8);
                  background: radial-gradient(circle, rgba(111,66,193,0.18), transparent 70%);
                  opacity: 0;
                  transition: opacity 0.4s ease, transform 0.4s ease;
                  border-radius: 50%;
                  pointer-events: none;
                }

                .home-card:hover::before {
                  opacity: 1;
                  transform: translateX(-50%) scale(1);
                }

                .home-card:hover {
                  transform: translateY(-8px) scale(1.02);
                  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
                  border-color: rgba(76,44,160,0.25);
                }

                .home-card-icon {
                  width: 90px;
                  height: 90px;
                  border-radius: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 2.4rem;
                  margin: 0 auto;
                  transition: all 0.3s ease;
                  position: relative;
                  z-index: 2;
                }

                .icon-products { background: rgba(76,44,160,0.12); color: #4c2ca0; }
                .icon-lager { background: rgba(0,194,255,0.12); color: #00c2ff; }
                .icon-reports { background: rgba(111,66,193,0.12); color: #6f42c1; }

                .home-card:hover .home-card-icon {
                  transform: translateY(-4px) scale(1.08);
                  color: white;
                }

                .icon-products:hover { background: #4c2ca0; }
                .icon-lager:hover { background: #00c2ff; }
                .icon-reports:hover { background: #6f42c1; }

              `}</style>
            </div>
          )}

          {view === "products" && <DummyProducts onBack={() => setView("overview")} />}
          {view === "lager" && <Dummys onBack={() => setView("overview")} />}
          {view === "reports" && <ReportsDashboard onBack={() => setView("overview")} />}

        </div>
      </div>

      {showAlerts && <AlertsPanel alerts={alerts} onClose={() => setShowAlerts(false)} />}

      <style>{`
        .app-wrapper { display: flex; }
        .main-content {
          flex-grow: 1;
          padding-left: 260px;
          transition: padding-left 0.3s ease;
          min-height: 100vh;
          position: relative;
        }
        .sidebar.collapsed ~ .main-content { padding-left: 80px; }
        @media (max-width: 768px) {
          .main-content { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
