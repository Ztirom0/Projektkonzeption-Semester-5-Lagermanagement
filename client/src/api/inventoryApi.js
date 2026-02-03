// src/api/inventoryApi.js

const BASE_URL = "/api";

// GET /inventory
export async function getInventory() {
  const res = await fetch(`${BASE_URL}/inventory`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Bestände");
  return await res.json();
}

// GET /inventory/history/{itemId}
export async function getInventoryHistory(itemId, days = 180) {
  const res = await fetch(`${BASE_URL}/inventory/history/${itemId}?days=${days}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Bestandshistorie");
  const data = await res.json();
  
  // Stelle sicher, dass date als String im Format YYYY-MM-DD vorliegt
  return data.map(item => ({
    ...item,
    itemId: item.itemId,
    date: typeof item.date === 'string' ? item.date : new Date(item.date).toISOString().split('T')[0],
    quantity: item.quantity
  }));
}

// POST /inventory
export async function createInventory(placeId, itemId, quantity) {
  const res = await fetch(`${BASE_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId, itemId, quantity })
  });

  if (!res.ok) throw new Error("Fehler beim Erstellen des Bestandes");
  return await res.json();
}