// src/components/Reports/CeoChart.jsx

import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { calculateForecast } from "../../api/forecastApi";

const colors = ["#0066cc", "#28a745", "#dc3545", "#ffc107", "#6f42c1", "#20c997", "#fd7e14", "#17a2b8"];

export default function CeoChart({ sales, inventoryHistory, forecasts, recommendations, items, inventoryStatuses = [], forecastMethod = "moving-average", onMethodChange }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [method, setMethod] = useState(forecastMethod);
  const [showSales, setShowSales] = useState(true);
  const [showInventory, setShowInventory] = useState(true);

  // Handle method change
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    if (onMethodChange) {
      onMethodChange(newMethod);
    }
  };

  const uniqueItems = Array.from(new Set(sales.map(s => s.itemId))).sort();
  const activeItemId = selectedItemId || (uniqueItems.length > 0 ? uniqueItems[0] : null);
  const activeItemIds = activeItemId ? [activeItemId] : [];

  if (uniqueItems.length === 0) {
    return <div className="alert alert-info text-center py-5">Keine Verkaufsdaten verfügbar</div>;
  }

  // Alle Daten sammeln für das ausgewählte Item
  const getAllDates = () => {
    const allDates = new Set();
    activeItemIds.forEach(itemId => {
      // Sales-Daten
      sales.filter(s => s.itemId === itemId).forEach(s => allDates.add(s.date));
      // Inventory-History Daten
      if (inventoryHistory) {
        inventoryHistory.filter(h => h.itemId === itemId).forEach(h => allDates.add(h.date));
      }
    });
    return Array.from(allDates).sort();
  };

  const allHistoricalDates = getAllDates();

  const resolveEffectiveToday = () => {
    const historyDates = (inventoryHistory || [])
      .filter(h => activeItemId && h.itemId === activeItemId)
      .map(h => new Date(h.date))
      .filter(d => !Number.isNaN(d.getTime()));

    if (historyDates.length > 0) {
      const lastHistory = new Date(Math.max(...historyDates.map(d => d.getTime())));
      lastHistory.setDate(lastHistory.getDate() + 1);
      return lastHistory;
    }

    const salesDates = sales
      .filter(s => activeItemId && s.itemId === activeItemId)
      .map(s => new Date(s.date))
      .filter(d => !Number.isNaN(d.getTime()));

    if (salesDates.length > 0) {
      const lastSale = new Date(Math.max(...salesDates.map(d => d.getTime())));
      lastSale.setDate(lastSale.getDate() + 1);
      return lastSale;
    }

    return new Date();
  };

  const lastDate = resolveEffectiveToday().toISOString().split('T')[0];
  const forecastDays = 10;

  // Forecast dates für nächste 30 Tage
  const forecastDates = Array.from({ length: forecastDays }, (_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const allDates = [...allHistoricalDates, ...forecastDates];

  // Forecasts neu berechnen mit aktuellem method
  const computedForecasts = useMemo(() => {
    return activeItemIds.map(itemId => {
      try {
        const fc = calculateForecast(sales, inventoryHistory, itemId, method, 10);
        return fc;
      } catch (err) {
        return null;
      }
    }).filter(f => f !== null);
  }, [method, sales, inventoryHistory, activeItemIds]);

  // Datasets mit useMemo - aktualisiert sich wenn sich method, selectedItemIds oder forecasts ändern
  const datasets = useMemo(() => {
    return activeItemIds.map((itemId, idx) => {
      const itemSales = sales.filter(s => s.itemId === itemId).sort((a, b) => new Date(a.date) - new Date(b.date));
      const itemHistory = inventoryHistory ? inventoryHistory.filter(h => h.itemId === itemId).sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
      
      const forecast = computedForecasts.find(f => f.itemId === itemId);
      const item = items.find(i => i.id === itemId);
      const itemName = item ? item.name : `Artikel ${itemId}`;
      const salesColor = colors[idx % colors.length]; // Farbe für Verkauf
      const inventoryColor = colors[(idx + 4) % colors.length]; // Andere Farbe für Bestand

      const result = [];

    // ============ LINIE 1: Verkäufe (History + Prognose) ============
    if (showSales) {
      // Historische Verkaufs-Daten
      const salesData = allDates.map((d, dateIdx) => {
        const sale = itemSales.find(s => s.date === d);
        return sale ? sale.soldQuantity : null;
      });

      // Prognose-Daten für Verkäufe (für die nächsten 10 Tage)
      const salesForecastData = allDates.map((d, dateIdx) => {
        if (forecast && dateIdx >= allHistoricalDates.length) {
          // Tagesindex in der Prognose
          const forecastDayIdx = dateIdx - allHistoricalDates.length;
          
          if (forecast.points && forecast.points.length > forecastDayIdx) {
            // Verwende die prognostizierte Verkaufsmenge für diesen Tag
            return forecast.points[forecastDayIdx].predictedSales || 0;
          }
          
          return 0;
        }
        return null;
      });

      // Kombinierte Verkaufs-Linie
      const combinedSalesData = allDates.map((d, i) => {
        const value = salesData[i] !== null ? salesData[i] : salesForecastData[i];
        return value;
      });


      const salesDataset = {
        label: `Verkauf (Stück/Tag)`,
        data: combinedSalesData,
        borderColor: salesColor,
        backgroundColor: `${salesColor}15`,
        fill: false,
        tension: 0.35,
        pointRadius: 2,
        borderWidth: 3,
        spanGaps: false,
        yAxisID: 'y'
      };
      result.push(salesDataset);
    }

    // ============ LINIE 2: Bestand (History + Prognose) ============
    if (showInventory) {
      // Historische Bestandsdaten
      const inventoryData = allDates.map((d, dateIdx) => {
        const inv = itemHistory.find(h => h.date === d);
        return inv ? inv.quantity : null;
      });

      // Prognose-Bestandsdaten
      const inventoryForecastData = allDates.map((d, dateIdx) => {
        if (forecast && dateIdx >= allHistoricalDates.length) {
          // Tagesindex in der Prognose
          const forecastDayIdx = dateIdx - allHistoricalDates.length;
          
          if (forecast.points && forecast.points.length > forecastDayIdx) {
            const val = forecast.points[forecastDayIdx].quantity;
            return val;
          }
          return null;
        }
        return null;
      });

      // Kombinierte Bestands-Linie (durchgehend!)
      const combinedInventoryData = allDates.map((d, i) => {
        const value = inventoryData[i] !== null ? inventoryData[i] : inventoryForecastData[i];
        return value;
      });

      const inventoryDataset = {
        label: `Bestand (Stück)`,
        data: combinedInventoryData,
        borderColor: inventoryColor,
        backgroundColor: `${inventoryColor}10`,
        fill: false,
        tension: 0.35,
        pointRadius: 2,
        borderWidth: 3,
        spanGaps: false,
        yAxisID: 'y1'
      };
      result.push(inventoryDataset);
    }

    return result;
  }).flat();
  }, [activeItemIds, computedForecasts, sales, inventoryHistory, items, allDates]);

  // KPIs nur für das erste Item (vereinfacht)
  var firstItemName = '';
  if (activeItemIds.length > 0) {
    const firstItemId = activeItemIds[0];
    const firstItem = items.find(i => i.id === firstItemId);
    firstItemName = firstItem ? firstItem.name : `Artikel ${firstItemId}`;
    const firstItemStatus = inventoryStatuses.find(s => s.itemId === firstItemId);
    const firstItemSales = sales.filter(s => s.itemId === firstItemId).sort((a, b) => new Date(a.date) - new Date(b.date));
    var avgHistorical = firstItemSales.length > 0
      ? (firstItemSales.reduce((a, b) => a + b.soldQuantity, 0) / firstItemSales.length).toFixed(1)
      : 0;
    var trend = firstItemSales.length > 1
      ? (((firstItemSales[firstItemSales.length - 1].soldQuantity - firstItemSales[0].soldQuantity) / firstItemSales[0].soldQuantity) * 100).toFixed(1)
      : 0;
    var forecast = forecasts.find(f => f.itemId === firstItemId);
    var recommendations_item = recommendations.filter(r => r.itemId === firstItemId);
    var daysRemaining = firstItemStatus ? firstItemStatus.daysRemaining : null;
  } else {
    var avgHistorical = 0;
    var trend = 0;
    var forecast = null;
    var recommendations_item = [];
    var daysRemaining = null;
  }

  const methodName = {
    "moving-average": "Gleitender Durchschnitt",
    "linear-regression": "Lineare Regression",
    "exponential-smoothing": "Exponentielle Glättung"
  }[method];

  const chartData = {
    labels: allDates,
    datasets: datasets
  };

  // Plugin zur Trennung von Past/Future
  const plugin = {
    id: 'pastFutureBackground',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      
      // Linie zwischen historisch und Prognose
      const historicalEndIndex = allHistoricalDates.length;
      if (historicalEndIndex < allDates.length) {
        const xPixel = xScale.getPixelForValue(allDates[historicalEndIndex]);
        
        // Helle Hintergrundfarbe für Zukunft
        ctx.fillStyle = "rgba(255, 193, 7, 0.05)";
        ctx.fillRect(xPixel, yScale.top, xScale.right - xPixel, yScale.bottom - yScale.top);
        
        // Vertikale Trennlinie
        ctx.strokeStyle = "#ffc107";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(xPixel, yScale.top);
        ctx.lineTo(xPixel, yScale.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 13, weight: "600" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        displayColors: true,
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              // Unterschiedliche Einheiten je nach Dataset
              if (context.dataset.label && context.dataset.label.includes('Bestand')) {
                label += Math.round(context.parsed.y) + ' Stück';
              } else {
                label += Math.round(context.parsed.y) + ' Stück/Tag';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Zeitstrahl (Vergangenheit ← | → Zukunft)",
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          maxTicksLimit: 15,
          font: { size: 11 }
        },
        grid: {
          color: "rgba(0,0,0,0.05)"
        }
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: "Verkäufe (Stück/Tag)",
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          font: { size: 11 }
        },
        grid: {
          color: "rgba(0,0,0,0.08)"
        }
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: "Bestand (Stück)",
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          font: { size: 11 }
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className="ceo-chart">
      {/* Header */}
      <div className="mb-5">
        <h2 className="h4 fw-bold mb-2">
          <span className="text-primary">
            {activeItemId ? items.find(i => i.id === activeItemId)?.name || `Artikel ${activeItemId}` : "Artikel auswählen"}
          </span>
        </h2>
      </div>

      {/* Controls */}
      <div className="row mb-4 g-3">
        {/* Artikel Select */}
        <div className="col-lg-6">
          <label className="form-label fw-bold small text-uppercase text-muted mb-2">Artikel auswählen</label>
          <select 
            className="form-select form-select-lg"
            value={activeItemId || ""}
            onChange={(e) => setSelectedItemId(Number(e.target.value) || null)}
            style={{ borderColor: "#ddd" }}
          >
            <option value="">-- Artikel auswählen --</option>
            {uniqueItems.map(itemId => {
              const item = items.find(i => i.id === itemId);
              const itemName = item ? item.name : `Artikel ${itemId}`;
              return (
                <option key={itemId} value={itemId}>
                  {itemName} {item?.sku && `(SKU: ${item.sku})`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Prognosemethode */}
        <div className="col-lg-6">
          <label className="form-label fw-bold small text-uppercase text-muted mb-2">Prognosemethode</label>
          <select 
            className="form-select form-select-lg"
            value={method}
            onChange={(e) => handleMethodChange(e.target.value)}
            style={{ borderColor: "#ddd" }}
          >
            <option value="moving-average">Gleitender Durchschnitt (Stabilität)</option>
            <option value="linear-regression">Lineare Regression (Trend)</option>
            <option value="exponential-smoothing">Exponentielle Glättung (Aktualität)</option>
          </select>
          <small className="text-muted d-block mt-2">
            {method === "moving-average" && "Best für stabile, wiederkehrende Nachfrage"}
            {method === "linear-regression" && "Best für Trends und langfristige Entwicklung"}
            {method === "exponential-smoothing" && "Best für schnell ändernde Nachfrage"}
          </small>
        </div>
      </div>

      {/* Visualisierungs-Optionen */}
      <div className="row mb-4 g-3">
        <div className="col-12">
          <label className="form-label fw-bold small text-uppercase text-muted mb-2">Daten anzeigen/verbergen</label>
          <div className="d-flex flex-wrap gap-3">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="show-sales"
                checked={showSales}
                onChange={() => setShowSales(!showSales)}
              />
              <label className="form-check-label" htmlFor="show-sales">
                <strong>Verkäufe</strong> (historisch)
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="show-inventory"
                checked={showInventory}
                onChange={() => setShowInventory(!showInventory)}
              />
              <label className="form-check-label" htmlFor="show-inventory">
                <strong>Bestand</strong> (historisch)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card shadow-lg border-0 mb-5" style={{ borderRadius: "12px", overflow: "hidden" }}>
        <div className="card-body p-4" style={{ backgroundColor: "#fafbfc" }}>
          <div style={{ height: "400px" }}>
            <Line data={chartData} options={chartOptions} plugins={[plugin]} />
          </div>
          <small className="text-muted mt-3 d-block">
            Historische Daten  |  Gelbe Zone: Prognosebereich
          </small>
        </div>
      </div>

      {/* KPI Cards - Executive Summary (nur für erstes Item) */}
      {activeItemIds.length > 0 && (
        <div className="row g-3 mb-5">

          {/* Current Status */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid #0066cc" }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">Aktueller Durchschnitt</div>
                <div className="h3 fw-bold mb-0" style={{ color: "#0066cc" }}>
                  {avgHistorical} <span style={{ fontSize: "0.6em" }}>Stück/Tag</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trend */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid " + (trend > 0 ? "#28a745" : trend < 0 ? "#dc3545" : "#6c757d") }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">Trend</div>
                <div className="h3 fw-bold mb-0" style={{ color: trend > 0 ? "#28a745" : trend < 0 ? "#dc3545" : "#6c757d" }}>
                  {trend > 0 ? "+" : ""}{trend}%
                  <span style={{ fontSize: "0.6em", marginLeft: "5px" }}>{trend > 0 ? "↗" : trend < 0 ? "↘" : "→"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verfügbar für */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid " + (daysRemaining !== null && daysRemaining <= 2 ? "#dc3545" : daysRemaining !== null && daysRemaining <= 5 ? "#ffc107" : "#0dcaf0") }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">Verfügbar für</div>
                <div className="h3 fw-bold mb-0" style={{ color: daysRemaining !== null && daysRemaining <= 2 ? "#dc3545" : daysRemaining !== null && daysRemaining <= 5 ? "#ffc107" : "#0dcaf0" }}>
                  {daysRemaining === 999 ? "∞" : (daysRemaining ?? "-")} <span style={{ fontSize: "0.6em" }}>Tage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Empfehlung */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid " + (recommendations_item.length > 0 ? "#ffc107" : "#ccc") }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">Nachbestellen</div>
                <div className="h3 fw-bold mb-0" style={{ color: recommendations_item.length > 0 ? "#ffc107" : "#ccc" }}>
                  {recommendations_item.length > 0 ? recommendations_item[0].recommendedQuantity : 0} <span style={{ fontSize: "0.6em" }}>Stück</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ceo-chart .form-check-input {
          cursor: pointer;
        }
        .ceo-chart .form-check-label {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
