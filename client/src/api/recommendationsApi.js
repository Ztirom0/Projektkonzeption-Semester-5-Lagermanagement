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
      byItem[inv.itemId] = {
        totalStock: 0,
        minQuantity: 0,
        item: items.find(i => i.id === inv.itemId)
      };
    }
    byItem[inv.itemId].totalStock += inv.quantity || 0;
    byItem[inv.itemId].minQuantity = Math.max(
      byItem[inv.itemId].minQuantity,
      inv.minQuantity || 0
    );
  });

  // Verarbeite jedes Item
  Object.entries(byItem).forEach(([itemId, itemData]) => {
    const totalStock = itemData.totalStock;
    const minStock = itemData.minQuantity;
    const item = itemData.item;

    if (totalStock < minStock) {
      // Kritisch: unter Mindestbestand
      recommendations.push({
        itemId: parseInt(itemId),
        recommendedQuantity: Math.max(10, minStock - totalStock + 10),
        message: "Kritisch: Mindestbestand unterschritten",
        priority: "CRITICAL",
        reason: `Bestand ${totalStock} < Minimum ${minStock}`
      });
    } else if (totalStock < minStock * 1.5) {
      // Niedrig: unter 150% des Mindestbestands
      const forecast = forecasts.find(f => f.itemId === parseInt(itemId));
      
      if (forecast && forecast.points && forecast.points.length > 0) {
        // Berechne basierend auf Prognose
        const daysUntilEmpty = forecast.points.findIndex(p => p.quantity <= 0);
        const recommendedQuantity = Math.max(
          Math.ceil(minStock * 0.5),
          minStock - totalStock
        );
        
        recommendations.push({
          itemId: parseInt(itemId),
          recommendedQuantity,
          message: daysUntilEmpty > 0 && daysUntilEmpty <= 14
            ? `Warnung: Bestand reicht nur noch ~${daysUntilEmpty} Tage`
            : "Prognose-basiert: Bestand unter 150% des Minimums",
          priority: daysUntilEmpty > 0 && daysUntilEmpty <= 7 ? "HIGH" : "MEDIUM",
          reason: `Bestand ${totalStock} < 150% Minimum (${minStock * 1.5}), Prognose: ${daysUntilEmpty} Tage`
        });
      } else {
        // Fallback ohne Prognose
        recommendations.push({
          itemId: parseInt(itemId),
          recommendedQuantity: Math.ceil(minStock * 0.5),
          message: "Niedrig: Bestand unter 150% des Mindestbestands",
          priority: "MEDIUM",
          reason: `Bestand ${totalStock} < 150% Minimum (${minStock * 1.5})`
        });
      }
    }
  });

  return recommendations;
}
