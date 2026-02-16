// src/api/recommendationsApi.js

/**
 * Berechnet Empfehlungen basierend auf aktuellen Beständen und Prognosen
 * 
 * @param {Array} inventoryStatuses - Array von Inventory-Objekten
 * @param {Array} forecasts - Array von Forecast-Objekten
 * @param {Array} items - Array von Item-Objekten für Name-Lookup
 * @returns {Array} Liste von Recommendation-Objekten
 */
export function calculateRecommendations(inventoryStatuses, forecasts, items) {
  const recommendations = [];
  
  // Gruppiere Bestand nach itemId
  const byItem = {};
  inventoryStatuses.forEach(inv => {
    if (!byItem[inv.itemId]) {
      const item = items.find(i => i.id === inv.itemId);
      byItem[inv.itemId] = {
        totalStock: 0,
        minQuantity: item ? item.minQuantity : 0,
        item: item
      };
    }
    byItem[inv.itemId].totalStock += inv.quantity || 0;
  });

  // Verarbeite jedes Item
  Object.entries(byItem).forEach(([itemId, itemData]) => {
    const totalStock = itemData.totalStock;
    const minStock = itemData.minQuantity;
    const item = itemData.item;
    const status = inventoryStatuses.find(s => s.itemId === parseInt(itemId));
    const dailySalesRate = status?.dailySalesRate ?? 0;

    const targetStock = Math.max(
      minStock,
      Math.ceil(dailySalesRate * 10)
    );

    const recommendedQuantity = Math.max(0, targetStock - totalStock);

    let reason = "Bestand ausreichend";
    let priority = "LOW";
    let message = "Keine Nachbestellung nötig";

    if (recommendedQuantity > 0) {
      message = "Nachbestellung empfohlen";
      reason = `Zielbestand ${targetStock} (min ${minStock}, 10T ${Math.ceil(dailySalesRate * 10)}) - aktueller Bestand ${totalStock}`;
      priority = totalStock < minStock ? "CRITICAL" : "MEDIUM";
    }

    recommendations.push({
      itemId: parseInt(itemId),
      recommendedQuantity,
      message,
      priority,
      reason
    });
  });

  return recommendations;
}
