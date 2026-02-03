// src/api/forecastApi.js

export function calculateForecast(sales, inventoryHistory, itemId, method = "moving-average", days = 10) {
  // 1. Letzten echten Bestand holen
  const history = inventoryHistory
    .filter(h => h.itemId === itemId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (history.length === 0) {
    const itemSales = sales
      .filter(s => s.itemId === itemId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const avgDaily = itemSales.length > 0
      ? itemSales.reduce((sum, s) => sum + (s.soldQuantity || 0), 0) / itemSales.length
      : 0;

    return {
      itemId,
      startQuantity: 0,
      points: [],
      predictedDemand: Math.max(0, Math.round(avgDaily * days)),
      confidence: Math.min(1, 0.2 + itemSales.length * 0.05),
      method
    };
  }

  const lastRealQuantity = history[history.length - 1].quantity;

  // 0. Sales für diesen Artikel filtern
  const itemSales = sales
    .filter(s => s.itemId === itemId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Wenn zu wenig Daten → flache Prognose
  if (itemSales.length < 3) {
    const avgDaily = itemSales.length > 0
      ? itemSales.reduce((sum, s) => sum + (s.soldQuantity || 0), 0) / itemSales.length
      : 0;
    return {
      itemId,
      startQuantity: lastRealQuantity,
      points: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        quantity: lastRealQuantity
      })),
      predictedDemand: Math.max(0, Math.round(avgDaily * days)),
      confidence: Math.min(1, 0.3 + itemSales.length * 0.1),
      method
    };
  }

  // 3. Bestandsprognose - verschiedene Strategien je nach Methode
  const forecastPoints = [];
  let current = lastRealQuantity;

  // Vorbereitung je nach Methode
  let lrResult, smoothedValue, rollingData;
  
  switch (method) {
    case "linear-regression":
      // Berechne Trend EINMAL aus historischen Daten
      lrResult = linearRegression(itemSales);
      break;
      
    case "exponential-smoothing":
      // Berechne initialen geglätteten Wert EINMAL
      smoothedValue = exponentialSmoothing(itemSales);
      break;
      
    case "moving-average":
    default:
      // Kopie für rollendes Fenster
      rollingData = [...itemSales];
      break;
  }

  for (let day = 1; day <= days; day++) {
    let dailyDemand = 0;

    switch (method) {
      case "linear-regression":
        // Extrapoliere den Trend für diesen Tag
        const futureIndex = itemSales.length + day - 1;
        dailyDemand = Math.max(0, lrResult.slope * futureIndex + lrResult.intercept);
        break;

      case "exponential-smoothing":
        // Verwende den geglätteten Wert konstant (typisch für ES)
        // Optional: leichte Anpassung für längere Zeiträume
        dailyDemand = smoothedValue;
        break;

      case "moving-average":
      default:
        // Moving Average mit rollendem Fenster
        dailyDemand = movingAverage(rollingData, 7);
        
        // Füge prognostizierten Verkauf zum rollenden Datensatz hinzu
        const lastDate = rollingData[rollingData.length - 1]?.date 
          ? new Date(rollingData[rollingData.length - 1].date)
          : new Date();
        
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        rollingData.push({
          date: nextDate.toISOString().split('T')[0],
          soldQuantity: dailyDemand,
          itemId: itemId
        });
        break;
    }

    // Bestand reduzieren
    current -= dailyDemand;
    const point = {
      day,
      quantity: Math.max(0, Math.round(current)),
      predictedSales: Math.max(0, Math.round(dailyDemand))
    };
    forecastPoints.push(point);
  }

  const totalPredictedDemand = forecastPoints.reduce((sum, p) => sum + p.predictedSales, 0);

  return {
    itemId,
    startQuantity: lastRealQuantity,
    points: forecastPoints,
    predictedDemand: totalPredictedDemand,
    confidence: Math.min(1, 0.4 + Math.min(itemSales.length, 10) * 0.06),
    method
  };
}

// Gleitender Durchschnitt
function movingAverage(sales, windowSize = 7) {
  if (sales.length === 0) {
    return 0;
  }
  
  const recent = sales.slice(-windowSize);
  const sum = recent.reduce((acc, s) => acc + s.soldQuantity, 0);
  const avg = sum / recent.length;
  
  return avg;
}

// Lineare Regression
function linearRegression(sales) {
  const n = sales.length;
  if (n === 0) {
    return { slope: 0, intercept: 0 };
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  sales.forEach((sale, index) => {
    const x = index;
    const y = sale.soldQuantity;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

// Exponentielle Glättung
function exponentialSmoothing(sales, alpha = 0.3) {
  if (sales.length === 0) {
    return 0;
  }

  let smoothed = sales[0].soldQuantity;

  for (let i = 1; i < sales.length; i++) {
    smoothed = alpha * sales[i].soldQuantity + (1 - alpha) * smoothed;
  }

  return smoothed;
}
