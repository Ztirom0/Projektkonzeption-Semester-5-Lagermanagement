// src/components/Reports/ReportsDashboard.jsx

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import {
  fetchSales,
  fetchForecast,
  fetchRecommendations
} from "./analyticsDummyData";

import { locations } from "../Lager/storageDummyData";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ReportsDashboard({ onBack }) {
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Echte Artikel-IDs aus dem Lager
  const realItemIds = Array.from(
    new Set(
      locations.flatMap((loc) => loc.items.map((i) => i.productId))
    )
  );

  // INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      const s = await fetchSales();
      setSales(s);

      const recs = await fetchRecommendations();
      setRecommendations(recs);

      const firstId = realItemIds[0];
      setSelectedItemId(firstId);

      if (firstId) {
        const fc = await fetchForecast(firstId);
        setForecast(fc);
      }
    };

    load();
  }, []);

  // FORECAST BEI ARTIKELWECHSEL
  useEffect(() => {
    const updateForecast = async () => {
      if (!selectedItemId) return;
      const fc = await fetchForecast(selectedItemId);
      setForecast(fc);
    };

    updateForecast();
  }, [selectedItemId]);

  // Labels = einfache Strings
  const uniqueDates = Array.from(new Set(sales.map((s) => s.date))).sort();

  // Nur echte Artikel
  const uniqueItems = Array.from(
    new Set(sales.map((s) => s.itemId))
  ).sort();

  // LineChart: Verkäufe pro Artikel
  const salesDatasets = uniqueItems.map((itemId, idx) => {
    const color = `hsl(${(idx * 80) % 360}, 70%, 50%)`;
    const dataPerDate = uniqueDates.map((d) => {
      const entry = sales.find((s) => s.itemId === itemId && s.date === d);
      return entry ? entry.soldQuantity : 0;
    });

    return {
      label: `Artikel ${itemId}`,
      data: dataPerDate,
      borderColor: color,
      backgroundColor: "transparent",
      tension: 0.3,
      pointRadius: 3
    };
  });

  const salesChartData = {
    labels: uniqueDates,
    datasets: salesDatasets
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      x: { title: { display: true, text: "Datum" } },
      y: { title: { display: true, text: "Verkäufe" }, beginAtZero: true }
    }
  };

  // BarChart: Empfehlungen
  const recChartData = {
    labels: recommendations.map((r) => `Artikel ${r.itemId}`),
    datasets: [
      {
        label: "Empfohlene Nachbestellung",
        data: recommendations.map((r) => r.recommendedOrder),
        backgroundColor: "rgba(25, 135, 84, 0.7)"
      }
    ]
  };

  const recChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    },
    scales: {
      x: { title: { display: true, text: "Artikel" } },
      y: { title: { display: true, text: "Menge" }, beginAtZero: true }
    }
  };

  return (
    <div className="reports-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">📊 Prognosen & Analysen</h1>
          <p className="text-muted mb-0">
            Verkaufsverläufe, Nachfrageprognosen und intelligente Nachbestell-Empfehlungen.
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          ⬅ Zur Übersicht
        </button>
      </div>

      {/* Prognosekarte */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Prognose – Artikel</h5>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "140px" }}
                  value={selectedItemId || ""}
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                  disabled={uniqueItems.length === 0}
                >
                  {uniqueItems.map((id) => (
                    <option key={id} value={id}>
                      Artikel {id}
                    </option>
                  ))}
                </select>
              </div>

              {forecast ? (
                <>
                  <div className="mb-2">
                    <span className="text-muted small">Prognostizierte Nachfrage</span>
                    <div className="fs-4 fw-bold">
                      {forecast.predictedDemand} Stück
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-muted small">Empfohlenes Nachbestelldatum</span>
                    <div className="fw-semibold">
                      {forecast.recommendedReorderDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted small">Konfidenz</span>
                    <div className="fw-semibold">
                      {(forecast.confidence * 100).toFixed(1)} %
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted small">
                  Keine Prognose verfügbar für die aktuellen Artikel.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empfehlungen */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Nachbestell-Empfehlungen</h5>
              {recommendations.length === 0 ? (
                <div className="text-muted small">
                  Keine Empfehlungen für vorhandene Artikel.
                </div>
              ) : (
                <div className="row g-2">
                  {recommendations.map((r, idx) => (
                    <div className="col-md-4" key={idx}>
                      <div className="border rounded p-2 h-100">
                        <div className="small text-muted mb-1">
                          Artikel {r.itemId}
                        </div>
                        <div className="fw-bold">
                          {r.recommendedOrder} Stück
                        </div>
                        <div className="small text-success mt-1">
                          {r.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Verkaufsverlauf nach Artikel</h5>
              {salesDatasets.length === 0 ? (
                <div className="text-muted small">
                  Keine Verkaufsdaten für vorhandene Artikel.
                </div>
              ) : (
                <Line data={salesChartData} options={salesChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Empfohlene Nachbestellungen</h5>
              {recommendations.length === 0 ? (
                <div className="text-muted small">
                  Keine Empfehlungen für vorhandene Artikel.
                </div>
              ) : (
                <Bar data={recChartData} options={recChartOptions} />
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
