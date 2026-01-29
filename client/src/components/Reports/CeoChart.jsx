// src/components/Reports/CeoChart.jsx

import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { calculateForecast } from "../../api/forecastApi";

const colors = ["#0066cc", "#28a745", "#dc3545", "#ffc107", "#6f42c1", "#20c997", "#fd7e14", "#17a2b8"];

export default function CeoChart({ sales, inventoryHistory, forecasts, recommendations, items, forecastMethod = "moving-average", onMethodChange }) {
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [method, setMethod] = useState(forecastMethod);
  const [showSales, setShowSales] = useState(true);
  const [showInventory, setShowInventory] = useState(true);
  const [showForecast, setShowForecast] = useState(true);

  // Handle method change
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    if (onMethodChange) {
      onMethodChange(newMethod);
    }
  };

  const uniqueItems = Array.from(new Set(sales.map(s => s.itemId))).sort();
  const activeItemIds = selectedItemIds.length > 0 ? selectedItemIds : uniqueItems.slice(0, 1);

  if (uniqueItems.length === 0) {
    return <div className="alert alert-info text-center py-5">📊 Keine Verkaufsdaten verfügbar</div>;
  }

  // Toggle selection
  const toggleItemSelection = (itemId) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Alle Daten sammeln für alle ausgewählten Items
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
  const lastDate = allHistoricalDates[allHistoricalDates.length - 1] || new Date().toISOString().split('T')[0];
  const forecastDays = 30;

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
        const fc = calculateForecast(sales, inventoryHistory, itemId, method, 30);
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

      // Prognose-Daten für Verkäufe (für die nächsten 30 Tage)
      const salesForecastData = allDates.map((d, dateIdx) => {
        if (forecast && dateIdx >= allHistoricalDates.length) {
          // Tagesindex in der Prognose
          const forecastDayIdx = dateIdx - allHistoricalDates.length;
          
          if (forecast.points && forecast.points.length > forecastDayIdx) {
            // Aus der Bestandsprognose den täglichen Verbrauch ablesen
            if (forecastDayIdx === 0) {
              const val = forecast.startQuantity - forecast.points[0].quantity;
              return val;
            } else {
              const prev = forecast.points[forecastDayIdx - 1].quantity;
              const curr = forecast.points[forecastDayIdx].quantity;
              return Math.max(0, prev - curr);
            }
          }
          
          // Fallback: durchschnittliche Tagesverkäufe
          const recentSales = itemSales.slice(-7);
          if (recentSales.length > 0) {
            const avg = recentSales.reduce((sum, s) => sum + s.soldQuantity, 0) / recentSales.length;
            return Math.round(avg);
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
        label: `${itemName} - Verkauf (Stück/Tag)`,
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
        label: `${itemName} - Bestand (Stück)`,
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
    const firstItemSales = sales.filter(s => s.itemId === firstItemId).sort((a, b) => new Date(a.date) - new Date(b.date));
    var avgHistorical = firstItemSales.length > 0
      ? (firstItemSales.reduce((a, b) => a + b.soldQuantity, 0) / firstItemSales.length).toFixed(1)
      : 0;
    var trend = firstItemSales.length > 1
      ? (((firstItemSales[firstItemSales.length - 1].soldQuantity - firstItemSales[0].soldQuantity) / firstItemSales[0].soldQuantity) * 100).toFixed(1)
      : 0;
    var forecast = forecasts.find(f => f.itemId === firstItemId);
    var recommendations_item = recommendations.filter(r => r.itemId === firstItemId);
  } else {
    var avgHistorical = 0;
    var trend = 0;
    var forecast = null;
    var recommendations_item = [];
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
            {activeItemIds.length > 0 ? `${activeItemIds.length} Artikel ausgewählt` : "Artikel wählen"}
          </span>
        </h2>
        <p className="text-muted mb-0">
          Mehrfachauswahl von Artikeln zur Vergleichsanalyse. Verkaufsverlauf, Prognose und Nachbestellempfehlungen.
        </p>
      </div>

      {/* Controls */}
      <div className="row mb-4 g-3">
        {/* Artikel Multi-Select */}
        <div className="col-lg-6">
          <label className="form-label fw-bold small text-uppercase text-muted mb-2">📦 Artikel auswählen</label>
          <div className="border rounded p-3" style={{ maxHeight: "200px", overflowY: "auto", backgroundColor: "#f9f9f9" }}>
            {uniqueItems.map(itemId => {
              const item = items.find(i => i.id === itemId);
              const itemName = item ? item.name : `Artikel ${itemId}`;
              const isSelected = activeItemIds.includes(itemId);
              return (
                <div key={itemId} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`item-${itemId}`}
                    checked={isSelected}
                    onChange={() => toggleItemSelection(itemId)}
                  />
                  <label className="form-check-label cursor-pointer" htmlFor={`item-${itemId}`}>
                    <span className="fw-500">{itemName}</span>
                    <span className="text-muted small ms-2">(SKU: {item?.sku})</span>
                  </label>
                </div>
              );
            })}
          </div>
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
            <option value="moving-average">📊 Gleitender Durchschnitt (Stabilität)</option>
            <option value="linear-regression">📈 Lineare Regression (Trend)</option>
            <option value="exponential-smoothing">🔄 Exponentielle Glättung (Aktualität)</option>
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
          <label className="form-label fw-bold small text-uppercase text-muted mb-2">📈 Daten anzeigen/verbergen</label>
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
                📊 <strong>Verkäufe</strong> (historisch)
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
                📦 <strong>Bestand</strong> (historisch)
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="show-forecast"
                checked={showForecast}
                onChange={() => setShowForecast(!showForecast)}
              />
              <label className="form-check-label" htmlFor="show-forecast">
                🔮 <strong>Prognose</strong> (Zukunft)
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
            ← Historische Daten  |  Gelbe Zone: Prognosebereich
          </small>
        </div>
      </div>

      {/* KPI Cards - Executive Summary (nur für erstes Item) */}
      {activeItemIds.length > 0 && (
        <div className="row g-3 mb-5">
          {/* Header mit Item-Name */}
          <div className="col-12">
            <div className="alert alert-light border-1 mb-0" style={{ borderLeft: "4px solid #0066cc" }}>
              <h6 className="mb-0" style={{ color: "#0066cc" }}>
                📌 KPI für: <strong>{firstItemName}</strong>
              </h6>
            </div>
          </div>

          {/* Current Status */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid #0066cc" }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">📊 Aktueller Durchschnitt</div>
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
                <div className="small text-muted text-uppercase fw-bold mb-2">📈 Trend</div>
                <div className="h3 fw-bold mb-0" style={{ color: trend > 0 ? "#28a745" : trend < 0 ? "#dc3545" : "#6c757d" }}>
                  {trend > 0 ? "+" : ""}{trend}%
                  <span style={{ fontSize: "0.6em", marginLeft: "5px" }}>{trend > 0 ? "↗" : trend < 0 ? "↘" : "→"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 30-Tage Prognose */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid #28a745" }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">🔮 Prognose (30T)</div>
                <div className="h3 fw-bold mb-0" style={{ color: "#28a745" }}>
                  {forecast?.predictedDemand || 0} <span style={{ fontSize: "0.6em" }}>Stück</span>
                </div>
                <div className="small text-muted mt-2">
                  Konfidenz: <strong>{Math.round((forecast?.confidence || 0) * 100)}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Empfehlung */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100" style={{ borderTop: "4px solid " + (recommendations_item.length > 0 ? "#ffc107" : "#ccc") }}>
              <div className="card-body">
                <div className="small text-muted text-uppercase fw-bold mb-2">✅ Nachbestellen</div>
                <div className="h3 fw-bold mb-0" style={{ color: recommendations_item.length > 0 ? "#ffc107" : "#ccc" }}>
                  {recommendations_item.length > 0 ? recommendations_item[0].recommendedOrder : "—"} <span style={{ fontSize: "0.6em" }}>Stück</span>
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
