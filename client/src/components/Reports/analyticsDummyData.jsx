// src/components/Reports/analyticsDummyData.jsx






// Kann gelöscht werden, wird nicht mehr gebraucht







import { locations } from "../Lager/storageDummyData";

// Hilfsfunktion: alle echten Artikel aus dem Lager holen
function getAllRealItems() {
  const items = [];
  locations.forEach((loc) => {
    loc.items.forEach((i) => items.push(i));
  });
  return items;
}

// REALISTISCHER VERKAUFSVERLAUF
const dates = ["2025-11-01", "2025-11-02", "2025-11-03"];

function generateSales() {
  const items = getAllRealItems();
  const sales = [];

  items.forEach((item) => {
    const base = Math.max(1, Math.floor(item.minQuantity / 5));

    dates.forEach((d, idx) => {
      // leichte Schwankung + Trend
      const trend = idx * 0.2;
      const randomFactor = 0.8 + Math.random() * 0.4;

      const sold = Math.max(
        1,
        Math.floor(base * randomFactor + trend)
      );

      sales.push({
        itemId: item.productId,
        date: d,
        soldQuantity: sold
      });
    });
  });

  return sales;
}

let stableSalesCache = generateSales();

export async function fetchSales() {
  const currentItems = getAllRealItems();
  const cachedIds = new Set(stableSalesCache.map((s) => s.itemId));
  const newIds = currentItems.filter((i) => !cachedIds.has(i.productId));

  if (newIds.length > 0) {
    stableSalesCache = generateSales();
  }

  return stableSalesCache;
}

// REALISTISCHE PROGNOSE
export async function fetchForecast(itemId) {
  const items = getAllRealItems();
  const item = items.find((i) => i.productId === itemId);

  if (!item) {
    return {
      itemId,
      predictedDemand: 0,
      recommendedReorderDate: "N/A",
      confidence: 0.0
    };
  }

  const { quantity, minQuantity } = item;

  // Verkaufsdaten holen
  const sales = stableSalesCache.filter((s) => s.itemId === itemId);

  // Durchschnittlicher Verbrauch pro Tag
  const dailyDemand =
    sales.length > 0
      ? sales.reduce((sum, s) => sum + s.soldQuantity, 0) / sales.length
      : Math.max(1, minQuantity / 10);

  // Tage bis Mindestbestand erreicht
  let daysUntilMin = (quantity - minQuantity) / dailyDemand;

  if (quantity <= minQuantity) {
    daysUntilMin = 0;
  }

  // Reorder Date
  const today = new Date();
  const reorderDate = new Date(today);
  reorderDate.setDate(today.getDate() + Math.max(1, Math.floor(daysUntilMin)));

  // Nachfrageprognose
  const predictedDemand = Math.floor(dailyDemand * 7); // 1 Woche

  // Confidence abhängig von Datenmenge
  const confidence = Math.min(1, 0.5 + sales.length * 0.1);

  return {
    itemId,
    predictedDemand,
    recommendedReorderDate: reorderDate.toISOString().split("T")[0],
    confidence
  };
}

// EMPFEHLUNGEN basierend auf Prognose
export async function fetchRecommendations() {
  const items = getAllRealItems();

  return items.map((item) => {
    const delta = item.minQuantity - item.quantity;

    let recommendedOrder = 0;

    if (delta > 0) {
      recommendedOrder = delta * 2 + 5;
    } else {
      recommendedOrder = Math.max(0, Math.floor(item.minQuantity / 2));
    }

    return {
      itemId: item.productId,
      recommendedOrder,
      reason: delta > 0 ? "Unterschreitung + Prognose" : "Bestand stabil"
    };
  });
}
