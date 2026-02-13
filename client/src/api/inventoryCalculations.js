// src/api/inventoryCalculations.js

/**
 * Berechnet den Inventory Status eines Items im Frontend
 * basierend auf aktuellen Bestandsdaten, Verkaufsdaten und History
 * 
 * @param {Object} item - Item-Objekt mit id, name, sku
 * @param {Array} inventoryList - Array aller Inventory-Einträge
 * @param {Array} sales - Array aller Sales
 * @returns {Object} Status-Objekt mit berechneten Werten
 */
function resolveEffectiveToday(itemId, inventoryHistory, sales) {
  // 1) Letzter History-Eintrag (bevorzugt)
  const historyDates = (inventoryHistory || [])
    .filter(h => h.itemId === itemId && h.date)
    .map(h => new Date(h.date))
    .filter(d => !isNaN(d.getTime()));

  if (historyDates.length > 0) {
    const lastHistory = new Date(Math.max(...historyDates.map(d => d.getTime())));
    lastHistory.setDate(lastHistory.getDate() + 1);
    return lastHistory;
  }

  // 2) Fallback: letzter Sales-Tag
  const salesDates = (sales || [])
    .filter(s => s.itemId === itemId)
    .map(s => new Date(s.saleDate || s.date))
    .filter(d => !isNaN(d.getTime()));

  if (salesDates.length > 0) {
    const lastSale = new Date(Math.max(...salesDates.map(d => d.getTime())));
    lastSale.setDate(lastSale.getDate() + 1);
    return lastSale;
  }

  // 3) Fallback: heute
  return new Date();
}

export function calculateInventoryStatus(item, inventoryList, sales, inventoryHistory = []) {
  // 1. Aktuellen Bestand summieren (über alle Lagerorte)
  const itemInventories = inventoryList.filter(inv => inv.itemId === item.id);
  const currentQuantity = itemInventories.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const minQuantity = item.minQuantity || 0;

  // 0. Effektives "Heute" = 1 Tag nach letztem History-Eintrag
  const latestDate = resolveEffectiveToday(item.id, inventoryHistory, sales);

  // 3. Verkäufe der letzten 365 Tage vom LETZTEN DATUM aus filtern
  const oneYearBeforeLatest = new Date(latestDate);
  oneYearBeforeLatest.setDate(oneYearBeforeLatest.getDate() - 365);
  
  const recentSales = sales.filter(sale => {
    if (sale.itemId !== item.id) return false;
    const saleDate = new Date(sale.saleDate || sale.date);
    const isRecent = saleDate >= oneYearBeforeLatest && saleDate <= latestDate;
    return isRecent;
  });

  // 4. Durchschnittliche tägliche Verkaufsrate berechnen
  // Berechne Durchschnitt basierend auf TATSÄCHLICHE Tage mit Daten
  let dailySalesRate = 0;
  if (recentSales.length > 0) {
    // Berechne Datumsspanne
    const dates = recentSales.map(s => new Date(s.saleDate || s.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    // Tage zwischen erstem und letztem Verkauf
    const daysSpan = Math.max(1, Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1);
    
    const totalSoldInPeriod = recentSales.reduce((sum, sale) => sum + (sale.quantity || sale.soldQuantity || 0), 0);
    dailySalesRate = totalSoldInPeriod / daysSpan;
  }

  // 5. Verbleibende Tage berechnen
  let daysRemaining = 0;
  if (dailySalesRate > 0) {
    daysRemaining = Math.floor(currentQuantity / dailySalesRate);
  } else if (currentQuantity > 0) {
    // Wenn keine Verkäufe gefunden, aber Bestand vorhanden
    daysRemaining = 999; // "unbegrenzt"
  }

  // 5. Nachbestellempfehlung (wenn weniger als 14 Tage verbleibend ODER bereits aufgebraucht)
  const REORDER_LEAD_TIME_DAYS = 14;
  const reorderRecommended = daysRemaining <= REORDER_LEAD_TIME_DAYS;
  
  const reorderDaysOffset = Math.max(0, daysRemaining - REORDER_LEAD_TIME_DAYS);
  const reorderDate = new Date(latestDate);
  reorderDate.setDate(reorderDate.getDate() + reorderDaysOffset);

  return {
    itemId: item.id,
    itemName: item.name,
    sku: item.sku,
    currentQuantity,
    minQuantity,
    dailySalesRate: parseFloat(dailySalesRate.toFixed(0)),
    daysRemaining,
    reorderRecommended,
    reorderDate: reorderDate.toISOString().split('T')[0], // YYYY-MM-DD
    // Zusätzliche Felder für Alerts
    quantity: currentQuantity,
    placeId: itemInventories[0]?.placeId // Haupt-Lagerort
  };
}

/**
 * Berechnet den Status für alle Items
 */
export function calculateAllInventoryStatuses(items, inventoryList, sales, inventoryHistory = []) {
  return items.map(item => calculateInventoryStatus(item, inventoryList, sales, inventoryHistory));
}
