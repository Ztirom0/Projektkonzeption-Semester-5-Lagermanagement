// src/api/itemsApi.js

const BASE_URL = "/api";

// GET /items
export async function getAllItems() {
  const res = await fetch(`${BASE_URL}/items`, {     // noch den Pfad angeben MO
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Artikel");
  return await res.json();
}

// POST /items
export async function createItem(itemData) {
  const res = await fetch(`${BASE_URL}/items`, {     // noch den Pfad angeben MO
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Fehler beim Erstellen des Artikels");
  }
  return await res.json();
}

