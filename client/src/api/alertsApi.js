// src/api/alertsApi.js

/**
 * Berechnet Alerts basierend auf aktuellem Bestand
 * Ein Alert wird erzeugt, wenn der Bestand unter der Mindestmenge liegt
 * 
 * @param {Array} inventoryStatuses - Array von Inventory-Objekten mit quantity und minQuantity
 * @returns {Array} Liste von Alert-Objekten
 */
export function calculateAlerts(inventoryStatuses) {
  return inventoryStatuses
    .filter(inv => inv && inv.quantity < inv.minQuantity)
    .map(inv => ({
      itemId: inv.itemId,
      placeId: inv.placeId,
      quantity: inv.quantity,
      minQuantity: inv.minQuantity,
      type: "CRITICAL",
      message: `Bestand unterschritten: ${inv.quantity}/${inv.minQuantity}`,
      severity: inv.quantity === 2 ? "CRITICAL" : "WARNING"
    }));
}
