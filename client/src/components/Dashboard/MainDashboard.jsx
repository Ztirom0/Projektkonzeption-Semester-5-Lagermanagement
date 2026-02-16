// src/components/Dashboard/MainDashboard.jsx
// -----------------------------------------------------------------------------
// Diese Komponente bildet das Haupt-Dashboard der Anwendung.
// Sie lädt alle relevanten Daten (Items, Verkäufe, Inventar, Historie, Standorte),
// berechnet daraus Statistiken, Prognosen und Bestandswarnungen
// und stellt anschließend die Haupt-Chart, kritische Artikel und Statistiken dar.
//
// Wichtige Aufgaben:
// - Daten aus mehreren APIs laden
// - Verkaufsdaten normalisieren und gruppieren
// - Prognosen für mehrere Artikel berechnen
// - Inventarstatus für alle Artikel bestimmen
// - Alerts und kritische Bestände berechnen
// - Chart-Daten für historische Verkäufe + Prognosen generieren
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { getAllItems } from "../../api/itemsApi";
import { getSales } from "../../api/salesApi";
import { getInventory, getInventoryHistory } from "../../api/inventoryApi";
import { getLocations } from "../../api/storageApi";
import { calculateAlerts } from "../../api/alertsApi";
import { calculateAllInventoryStatuses } from "../../api/inventoryCalculations";
import { calculateForecast } from "../../api/forecastApi";

import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import CriticalItemsTable from "./CriticalItemsTable";

export default function MainDashboard() {

  // Globale Dashboard-Statistiken
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalLocations: 0,
    criticalAlerts: 0
  });

  // Daten für das Verkaufs-/Prognose-Diagramm
  const [chartData, setChartData] = useState([]);

  // Berechnete Bestandsstatus aller Artikel
  const [inventoryStatus, setInventoryStatus] = useState([]);

  // Ladezustand
  const [loading, setLoading] = useState(true);

  // Ausgewählte Prognosemethode (z. B. Moving Average)
  const [forecastMethod, setForecastMethod] = useState("moving-average");

  // ---------------------------------------------------------------------------
  // Normalisiert Verkaufsdaten, sodass Datum und Menge einheitlich vorliegen.
  // Erkennt verschiedene mögliche Feldnamen und wandelt sie in ein Standardformat um.
  // ---------------------------------------------------------------------------
  const normalizeSales = (sales) => {
    return (sales || [])
      .map((s) => {
        const dateRaw = s.saleDate || s.date || s.Date || s.created || s.createdAt;
        const quantityRaw = s.quantity ?? s.soldQuantity ?? s.Quantity ?? 0;

        const dateObj = new Date(dateRaw);
        if (!dateRaw || Number.isNaN(dateObj.getTime())) return null;

        return {
          ...s,
          __dateObj: dateObj,
          __dateKey: dateObj.toISOString().split("T")[0], // YYYY-MM-DD
          __quantity: Number(quantityRaw) || 0
        };
      })
      .filter(Boolean);
  };

  // ---------------------------------------------------------------------------
  // Bestimmt das "effektive Heute" für Prognosen.
  // Falls Inventarhistorie vorhanden ist → letzter Tag + 1
  // Falls nur Verkäufe vorhanden sind → letzter Verkaufstag + 1
  // Sonst → aktuelles Datum
  // ---------------------------------------------------------------------------
  const getEffectiveToday = (history, normalizedSales) => {
    const historyDates = (history || [])
      .map(h => new Date(h.date))
      .filter(d => !Number.isNaN(d.getTime()));

    if (historyDates.length > 0) {
      const lastHistory = new Date(Math.max(...historyDates.map(d => d.getTime())));
      lastHistory.setDate(lastHistory.getDate() + 1);
      return lastHistory;
    }

    if (normalizedSales.length > 0) {
      const lastSale = new Date(Math.max(...normalizedSales.map(s => s.__dateObj.getTime())));
      lastSale.setDate(lastSale.getDate() + 1);
      return lastSale;
    }

    return new Date();
  };

  // ---------------------------------------------------------------------------
  // Baut die Datenreihe für das Verkaufs-/Prognose-Diagramm.
  // - Gruppiert Verkäufe nach Datum
  // - Nimmt die letzten 30 Tage als Historie
  // - Berechnet Prognosen für die nächsten 10 Tage
  // - Kombiniert Historie + Prognose zu einer Chart-Datenreihe
  // ---------------------------------------------------------------------------
  const buildChartData = (sales, history, ids, method) => {
    const normalized = normalizeSales(sales);

    // Verkäufe nach Datum gruppieren
    const grouped = {};
    normalized.forEach((s) => {
      if (!grouped[s.__dateKey]) grouped[s.__dateKey] = 0;
      grouped[s.__dateKey] += s.__quantity;
    });

    // Historische Daten (max. 30 Tage)
    const historical = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, qty]) => ({
        date: new Date(date).toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
        verkauf: qty,
        prognose: null
      }));

    if (historical.length > 0) {
      const lastHistorical = historical[historical.length - 1];
      console.log("[SalesChart] Letzter Historie-Tag:", lastHistorical.date);
    }

    // Falls keine Artikel-IDs vorhanden sind → nur Historie zurückgeben
    if (!ids.length) return historical;

    // Bestimme Startdatum für Prognosen
    const latestDate = getEffectiveToday(history, normalized);

    // Erzeuge 10 zukünftige Tage
    const forecastDates = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(latestDate);
      d.setDate(d.getDate() + i + 1);
      return d;
    });

    // Prognosen für jeden Artikel berechnen
    const forecasts = ids
      .map((id) => {
        try {
          return calculateForecast(sales, history, id, method, 10);
        } catch (err) {
          console.error(`❌ [FORECAST ERROR] ItemID ${id}:`, err);
          return null;
        }
      })
      .filter(Boolean);

    // Summiere Prognosen aller Artikel pro Tag
    const forecastTotals = forecastDates.map((_, idx) => {
      return forecasts.reduce((sum, fc) => {
        if (!fc?.points || !fc.points[idx]) return sum;
        return sum + fc.points[idx].predictedSales;
      }, 0);
    });

    // Prognose-Datenpunkte erzeugen
    const forecastSeries = forecastDates.map((d, idx) => ({
      date: d.toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
      verkauf: null,
      prognose: Math.round(forecastTotals[idx])
    }));

    // Letzter historischer Punkt bekommt seine eigene Prognose
    if (historical.length > 0 && forecastSeries.length > 0) {
      const lastHistorical = historical[historical.length - 1];
      lastHistorical.prognose = lastHistorical.verkauf;
    }

    return [...historical, ...forecastSeries];
  };

  // ---------------------------------------------------------------------------
  // Lädt alle Daten beim ersten Rendern oder wenn die Prognosemethode geändert wird.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        // Lade Artikel
        const items = await getAllItems();
        setStats(prev => ({ ...prev, totalItems: items.length }));

        // Lade Standorte
        const locations = await getLocations();
        setStats(prev => ({ ...prev, totalLocations: locations.length }));

        // Lade Verkaufsdaten
        const sales = await getSales();

        let combinedHistory = [];

        // Falls Verkäufe vorhanden → Inventarhistorie für alle Artikel laden
        if (sales.length > 0) {
          const ids = items.map((item) => item.id);

          const historyPromises = ids.map((itemId) =>
            getInventoryHistory(itemId, 180).catch(() => [])
          );

          const historyResults = await Promise.all(historyPromises);
          combinedHistory = historyResults.flat();

          // Chart-Daten generieren
          const chartPoints = buildChartData(sales, combinedHistory, ids, forecastMethod);
          setChartData(chartPoints);
        } else {
          setChartData([]);
        }

        // Lade Inventar (aktueller Bestand)
        const inventoryList = await getInventory();

        // Berechne Bestandsstatus für alle Artikel
        const calculatedStatuses = calculateAllInventoryStatuses(
          items,
          inventoryList,
          sales,
          combinedHistory
        );
        setInventoryStatus(calculatedStatuses);

        // Berechne Alerts
        const alerts = calculateAlerts(calculatedStatuses);
        const critical = alerts.filter(a => a.type === "CRITICAL").length;
        setStats(prev => ({ ...prev, criticalAlerts: critical }));

        // Zähle Artikel mit ≤ 10 Tagen Restbestand
        const lowStock = calculatedStatuses.filter(s => {
          const days = s?.daysRemaining;
          return days !== undefined && days !== null && days <= 10 && days >= 0;
        }).length;

        setStats(prev => ({ ...prev, lowStockItems: lowStock }));

      } catch (err) {
        // Fehler werden bewusst nicht angezeigt
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [forecastMethod]);

  // ---------------------------------------------------------------------------
  // Ladeanzeige
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Haupt-Renderbereich des Dashboards
  // ---------------------------------------------------------------------------
  return (
    <div className="main-dashboard">

      {/* Verkaufs-/Prognose-Chart */}
      <SalesChart
        data={chartData}
        forecastMethod={forecastMethod}
        onForecastMethodChange={setForecastMethod}
      />

      {/* Tabelle mit kritischen Artikeln */}
      <CriticalItemsTable items={inventoryStatus} />

      {/* Inline-Styling für Animationen und Stat-Cards */}
      <style>{`
        .main-dashboard {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #ccc;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
        }

        .stat-card-primary { border-left-color: #0d6efd; }
        .stat-card-warning { border-left-color: #ffc107; }
        .stat-card-info { border-left-color: #0dcaf0; }
        .stat-card-danger { border-left-color: #dc3545; }

        .stat-icon {
          font-size: 0.5rem;
          line-height: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #212529;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .chart-card {
          border: none;
          overflow: hidden;
        }

        .chart-card .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chart-card .card-header h5 {
          color: white;
        }
      `}</style>
    </div>
  );
}
