// src/api/salesApi.js

const BASE_URL = "/api";

// GET /sales
export async function getSales() {
  const res = await fetch(`${BASE_URL}/sales`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Verkaufsdaten");
  return await res.json();
}
