// src/components/Reports/ProductReportView.jsx

import { useEffect, useState } from "react";
import { getSales } from "../../api/salesApi";
import { calculateForecast } from "../../api/forecastApi";
import { calculateRecommendations } from "../../api/recommendationsApi";
import { getInventory, getInventoryHistory } from "../../api/inventoryApi";
import { calculateAllInventoryStatuses } from "../../api/inventoryCalculations";
import CeoChart from "./CeoChart";

export default function ProductReportView({ item, onBack }) {
  const [sales, setSales] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [forecastMethod, setForecastMethod] = useState("moving-average");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!item) return;
      setLoading(true);
      try {
        const [salesRes, inv] = await Promise.all([
          getSales(),
          getInventory()
        ]);

        const filteredSales = salesRes.filter(s => s.itemId === item.id);
        setSales(filteredSales);

        const history = await getInventoryHistory(item.id, 180);
        setInventoryHistory(history);

        const forecastData = [
          calculateForecast(salesRes, history, item.id, forecastMethod, 10)
        ];
        setForecasts(forecastData);

        const statuses = calculateAllInventoryStatuses([item], inv, salesRes, history);
        const status = statuses.find(s => s.itemId === item.id) || null;
        setInventoryStatus(status);

        const recs = calculateRecommendations(statuses, forecastData, [item]);
        setRecommendations(recs.filter(r => r.itemId === item.id));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [item, forecastMethod]);

  if (!item) {
    return (
      <div className="alert alert-warning">Kein Produkt ausgewählt.</div>
    );
  }

  return (
    <div className="product-report-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 mb-1">Produkt-Analyse: {item.name}</h1>
          <p className="text-muted mb-0">SKU: {item.sku}</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          Zurück
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Lade Daten...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <CeoChart
              sales={sales}
              inventoryHistory={inventoryHistory}
              forecasts={forecasts}
              recommendations={recommendations}
              items={[item]}
              inventoryStatuses={inventoryStatus ? [inventoryStatus] : []}
              forecastMethod={forecastMethod}
              onMethodChange={setForecastMethod}
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title mb-3">Bestandsstatus</h5>
                  {inventoryStatus ? (
                    <div className="border rounded p-3" style={{ backgroundColor: "#f9f9f9" }}>
                      <div className="fw-bold h5 mb-0">{inventoryStatus.currentQuantity} Stück</div>
                      <div className="small mb-0">
                        <strong>Täglicher Verkauf:</strong> ~{inventoryStatus.dailySalesRate.toFixed(1)} Stück/Tag
                      </div>
                      <div className="small mb-0">
                        <strong>Verfügbar für:</strong> ~{inventoryStatus.daysRemaining} Tage
                      </div>
                      {inventoryStatus.reorderRecommended && (
                        <div className="small text-danger">
                          Nachbestellung empfohlen ab: {inventoryStatus.reorderDate}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted small">Keine Status-Daten verfügbar.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title mb-3">Nachbestell-Empfehlung</h5>
                  {recommendations.length > 0 ? (
                    recommendations.map((r, idx) => (
                      <div key={idx} className="border rounded p-3" style={{ backgroundColor: "#f9f9f9" }}>
                        <div className="fw-bold h5 text-warning mb-1">
                          {r.recommendedQuantity} Stück
                        </div>
                        <div className="small text-success">{r.reason}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small">Keine Empfehlungen verfügbar.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
