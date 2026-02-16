// src/api/alertsApi.js

/**
 * Berechnet Alerts basierend auf aktuellem Bestand und verbleibenden Tagen
 * Ein Alert wird erzeugt, wenn:
 * 1. Der Bestand unter der Mindestmenge liegt (CRITICAL - rot)
 * 2. In den nächsten 5 Tagen aufgebraucht sein wird (WARNING - gelb)
 * 
 * @param {Array} inventoryStatuses - Array von Inventory-Objekten mit quantity, minQuantity, daysRemaining
 * @returns {Array} Liste von Alert-Objekten
 */
export function calculateAlerts(inventoryStatuses) {
  const alerts = [];
  
  inventoryStatuses.forEach(inv => {
    if (!inv) return;
    
    // CRITICAL: Bestand unterschritten
    if (inv.quantity < inv.minQuantity) {
      alerts.push({
        itemId: inv.itemId,
        itemName: inv.itemName,
        placeId: inv.placeId,
        quantity: inv.quantity,
        minQuantity: inv.minQuantity,
        daysRemaining: inv.daysRemaining,
        type: "CRITICAL",
        message: `Bestand unterschritten: ${inv.quantity}/${inv.minQuantity}`,
        statusLabel: "Unterschreitung",
        severity: inv.quantity === 0 ? "CRITICAL" : "WARNING"
      });
    }
    // WARNING: Läuft in nächsten 5 Tagen aus
    else if (inv.daysRemaining !== null && inv.daysRemaining > 0 && inv.daysRemaining <= 5) {
      alerts.push({
        itemId: inv.itemId,
        itemName: inv.itemName,
        placeId: inv.placeId,
        quantity: inv.quantity,
        minQuantity: inv.minQuantity,
        daysRemaining: inv.daysRemaining,
        type: "WARNING",
        message: `Läuft aus in ${inv.daysRemaining} Tag(en)`,
        statusLabel: "Läuft aus",
        severity: "WARNING"
      });
    }
  });
  
  return alerts;
}

