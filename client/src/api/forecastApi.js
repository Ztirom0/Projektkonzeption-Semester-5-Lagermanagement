// src/api/forecastApi.js

export function calculateForecast(sales, inventoryHistory, itemId, method = "moving-average", days = 30) {
  // 1. Letzten echten Bestand holen
  const history = inventoryHistory
    .filter(h => h.itemId === itemId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (history.length === 0) {
    return {
      itemId,
      startQuantity: 0,
      points: [],
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
    return {
      itemId,
      startQuantity: lastRealQuantity,
      points: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        quantity: lastRealQuantity
      })),
      method
    };
  }

  // 3. Verbrauch pro Tag berechnen
  let predictedDailyDemand = 0;

  switch (method) {
    case "linear-regression":
      predictedDailyDemand = linearRegression(itemSales).predictedDemand;
      break;

    case "exponential-smoothing":
      predictedDailyDemand = exponentialSmoothing(itemSales);
      break;

    case "moving-average":
    default:
      predictedDailyDemand = movingAverage(itemSales, 7);
      break;
  }

  // 4. Bestandsprognose erzeugen
  const forecastPoints = [];
  let current = lastRealQuantity;

  for (let day = 1; day <= days; day++) {
    current -= predictedDailyDemand;
    forecastPoints.push({
      day,
      quantity: Math.max(0, Math.round(current))
    });
  }

  return {
    itemId,
    startQuantity: lastRealQuantity,
    points: forecastPoints,
    method
  };
}

// Gleitender Durchschnitt
function movingAverage(sales, windowSize = 7) {
  if (sales.length === 0) return 0;
  const recent = sales.slice(-windowSize);
  const sum = recent.reduce((acc, s) => acc + s.soldQuantity, 0);
  return sum / recent.length;
}

// Lineare Regression
function linearRegression(sales) {
  const n = sales.length;
  if (n === 0) return { predictedDemand: 0 };

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

  const predictedDemand = slope * n + intercept;
  return { predictedDemand: Math.max(0, predictedDemand) };
}

// Exponentielle Glättung
function exponentialSmoothing(sales, alpha = 0.3) {
  if (sales.length === 0) return 0;

  let smoothed = sales[0].soldQuantity;

  for (let i = 1; i < sales.length; i++) {
    smoothed = alpha * sales[i].soldQuantity + (1 - alpha) * smoothed;
  }

  return smoothed;
}
