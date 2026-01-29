// src/components/Reports/ReportsDashboard.jsx

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

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

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

// INITIAL LOAD
useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      // 1. Verkaufsdaten
      const s = await getSales();
      setSales(s);

      // 0. Items + Inventory
      const [itemsRes, inv] = await Promise.all([
        getAllItems(),
        getInventory()
      ]);
      setItems(itemsRes);

      const ids = Array.from(new Set(inv.map(i => i.itemId)));
      setRealItemIds(ids);

      // 3. Inventory History laden
      const historyPromises = ids.map(itemId =>
        getInventoryHistory(itemId, 180).catch(err => {
          return [];
        })
      );

      const historyResults = await Promise.all(historyPromises);
      const combinedHistory = historyResults.flat();
      setInventoryHistory(combinedHistory);

      // 4. Forecasts berechnen
      const forecastsData = ids.map(itemId => {
        try {
          return calculateForecast(s, combinedHistory, itemId, "moving-average", 30);
        } catch (err) {
          return null;
        }
      }).filter(f => f !== null);
      setForecasts(forecastsData);

      // 5. Inventory Status im Frontend berechnen
      const calculatedStatuses = calculateAllInventoryStatuses(itemsRes, inv, s);
      setInventoryStatuses(calculatedStatuses);

      // 6. Empfehlungen im Frontend berechnen
      const recs = calculateRecommendations(calculatedStatuses, forecastsData, itemsRes);
      setRecommendations(recs);

    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);


  return (
    <div className="reports-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">📊 CEO-Dashboard: Prognosen & Analysen</h1>
          <p className="text-muted mb-0">
            Historische Verkäufe, Nachfrageprognosen mit verschiedenen Methoden und intelligente Nachbestell-Empfehlungen.
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          ⬅ Zur Übersicht
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Lade Daten...</span>
          </div>
          <p className="mt-3 text-muted">Prognosen werden geladen...</p>
        </div>
      ) : (
        <>
          {/* Haupt-Chart: CEO View */}
          <div className="mb-5">
            <CeoChart 
              sales={sales} 
              inventoryHistory={inventoryHistory}
              forecasts={forecasts} 
              recommendations={recommendations}
              items={items}
              forecastMethod={forecastMethod}
              onMethodChange={setForecastMethod}
            />
          </div>
        </>
      )}

      {/* Prognosekarte */}
      <div className="row g-3 mb-4">
        {/* Bestandsstatus-Panel */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">📦 Bestandsstatus & Verfügbarkeit</h5>
              {inventoryStatuses.length === 0 ? (
                <div className="text-muted small">
                  Keine Status-Daten verfügbar.
                </div>
              ) : (
                <div className="row g-0">
                  {inventoryStatuses.map((status, idx) => {
                    const icon = status.reorderRecommended ? "⚠️" : "✅";
                    const statusColor = status.reorderRecommended ? "danger" : "success";
                    return (
                      <div className="col-md-4" key={idx}>
                        <div className={`border rounded p-3 h-100 border-${statusColor}`} 
                             style={{ backgroundColor: status.reorderRecommended ? "#fff5f5" : "#f5fff5" }}>
                          <div className="small text-muted mb-0 fw-bold">
                            {status.itemName} ({status.sku})
                          </div>
                          <div className="fw-bold h5 mb-0">
                            {icon} {status.currentQuantity} Stück
                          </div>
                          <div className="small mb-0">
                            <strong>Täglicher Verkauf:</strong> ~{status.dailySalesRate.toFixed(1)} Stück/Tag
                          </div>
                          <div className={`small fw-bold mb-1 text-${statusColor}`}>
                            Verfügbar für: ~{status.daysRemaining} Tage
                          </div>
                          {status.reorderRecommended && (
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
              <h5 className="card-title mb-3">📦 Nachbestell-Empfehlungen</h5>
              {recommendations.length === 0 ? (
                <div className="text-muted small">
                  Keine Empfehlungen verfügbar.
                </div>
              ) : (
                <div className="row g-0">
                  {recommendations.map((r, idx) => {
                    const item = items.find(i => i.id === r.itemId);
                    const itemName = item ? item.name : `Artikel ${r.itemId}`;
                    return (
                      <div className="col-md-3" key={idx}>
                        <div className="border rounded p-3 h-100" style={{ backgroundColor: "#f9f9f9" }}>
                          <div className="small text-muted mb-0 fw-bold">
                            {itemName}
                          </div>
                          <div className="fw-bold h5 text-warning mb-1">
                            {r.recommendedOrder} Stück
                          </div>
                          <div className="small text-success">
                            {r.reason}
                          </div>
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
