// src/api/forecastApi.js

const BASE_URL = "/api";

// GET /forecast/{itemId}
export async function getForecast(itemId) {
  const res = await fetch(`${BASE_URL}/forecast/${itemId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Prognose");
  return await res.json();
}
