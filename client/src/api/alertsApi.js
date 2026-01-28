// src/api/alertsApi.js

const BASE_URL = "/api";

// GET /alerts
export async function getAlerts() {
  const res = await fetch(`${BASE_URL}/alerts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Alerts");
  return await res.json();
}

// GET /recommendations
export async function getRecommendations() {
  const res = await fetch(`${BASE_URL}/recommendations`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Empfehlungen");
  return await res.json();
}
