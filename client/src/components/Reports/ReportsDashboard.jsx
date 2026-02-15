// src/components/Reports/ReportsDashboard.jsx
// Dashboard für Gesamt-Analyse: Verkäufe, Bestand, Forecasts, Empfehlungen

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { getSales } from "../../api/salesApi";
import { calculateForecast } from "../../api/forecastApi";
import { calculateRecommendations } from "../../api/recommendationsApi";
import { getAllItems } from "../../api/itemsApi";
import { getInventory, getInventoryHistory } from "../../api/inventoryApi";
import { calculateAllInventoryStatuses } from "../../api/inventoryCalculations";
import CeoChart from "./CeoChart";

// ChartJS Setup
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ReportsDashboard({ onBack }) {
  const [sales, setSales] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [items, setItems] = useState([]);
  const [realItemIds, setRealItemIds] = useState([]);
  const [inventoryStatuses, setInventoryStatuses] = useState([]);
  const [forecastMethod, setForecastMethod] = useState("moving-average");
  const [loading, setLoading] = useState(true);

  // Initialer Datenload: Verkäufe, Items, Bestand, Verlauf, Forecasts, Empfehlungen
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        // Verkäufe
        const s = await getSales();
        setSales(s);

        // Items + aktueller Bestand
        const [itemsRes, inv] = await Promise.all([getAllItems(), getInventory()]);
        setItems(itemsRes);

        // Nur Items berücksichtigen, die tatsächlich Bestand haben
        const ids = Array.from(new Set(inv.map(i => i.itemId)));
        setRealItemIds(ids);

        // Bestandsverlauf der letzten 180 Tage
        const historyResults = await Promise.all(
          ids.map(itemId => getInventoryHistory(itemId, 180).catch(() => []))
        );
        const combinedHistory = historyResults.flat();
        setInventoryHistory(combinedHistory);

        // Forecasts für alle Items
        const forecastsData = ids
          .map(itemId => {
            try {
              return calculateForecast(s, combinedHistory, itemId, "moving-average", 30);
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        setForecasts(forecastsData);

        // Bestandsstatus berechnen
        const calculatedStatuses = calculateAllInventoryStatuses(
          itemsRes,
          inv,
          s,
          combinedHistory
        );
        setInventoryStatuses(calculatedStatuses);

        // Empfehlungen berechnen
        const recs = calculateRecommendations(calculatedStatuses, forecastsData, itemsRes);
        setRecommendations(recs);

      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="reports-dashboard">

      {/* Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={onBack}>
          ⬅ Zur Übersicht
        </button>
      </div>

      {/* Ladeanzeige */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Lade Daten...</span>
          </div>
          <p className="mt-3 text-muted">Prognosen werden geladen...</p>
        </div>
      ) : (
        <>
          {/* CEO‑Chart: Verkäufe, Bestand, Forecasts, Empfehlungen */}
          <div className="mb-5">
            <CeoChart
              sales={sales}
              inventoryHistory={inventoryHistory}
              forecasts={forecasts}
              recommendations={recommendations}
              items={items}
              inventoryStatuses={inventoryStatuses}
              forecastMethod={forecastMethod}
              onMethodChange={setForecastMethod}
            />
          </div>
        </>
      )}

      {/* Bestandsstatus + Empfehlungen */}
      <div className="row g-3 mb-4">

        {/* Bestandsstatus */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="card-title mb-3">Bestandsstatus & Verfügbarkeit</h2>

              {inventoryStatuses.length === 0 ? (
                <div className="text-muted small">Keine Status-Daten verfügbar.</div>
              ) : (
                <div className="row g-2">
                  {inventoryStatuses.map((status, idx) => {
                    const isLow = status.reorderRecommended;
                    const color = isLow ? "danger" : "success";
                    const icon = isLow ? "⚠️" : "✅";

                    return (
                      <div className="col-md-4" key={idx}>
                        <div
                          className={`border rounded p-3 h-100 border-${color}`}
                          style={{
                            backgroundColor: isLow ? "#fff5f5" : "#f5fff5"
                          }}
                        >
                          <div className="small text-muted mb-2 fw-bold">
                            {status.itemName} ({status.sku})
                          </div>

                          <div className="fw-bold h5 mb-2">
                            {icon} {status.currentQuantity} Stück
                          </div>

                          <div className="small mb-2">
                            <strong>Täglicher Verkauf:</strong>{" "}
                            ~{status.dailySalesRate.toFixed(1)} Stück/Tag
                          </div>

                          <div className={`small fw-bold mb-1 text-${color}`}>
                            Verfügbar für: ~{status.daysRemaining} Tage
                          </div>

                          {isLow && (
                            <div className="small text-danger">
                              🔴 Nachbestellung empfohlen ab: {status.reorderDate}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empfehlungen */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="card-title mb-3">Nachbestell-Empfehlungen</h2>

              {recommendations.length === 0 ? (
                <div className="text-muted small">Keine Empfehlungen verfügbar.</div>
              ) : (
                <div className="row g-2">
                  {recommendations.map((r, idx) => {
                    const item = items.find(i => i.id === r.itemId);
                    if (r.recommendedQuantity <= 0) return null;

                    return (
                      <div className="col-md-3" key={idx}>
                        <div className="border rounded p-3 h-100" style={{ backgroundColor: "#f9f9f9" }}>
                          <div className="small text-muted mb-2 fw-bold">
                            {item ? item.name : `Artikel ${r.itemId}`}
                          </div>

                          <div className="fw-bold h5 text-warning mb-1">
                            {r.recommendedQuantity} Stück
                          </div>

                          <div className="small text-success">{r.reason}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .reports-dashboard .card {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
