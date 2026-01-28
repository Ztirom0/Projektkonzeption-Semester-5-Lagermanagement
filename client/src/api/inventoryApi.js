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
