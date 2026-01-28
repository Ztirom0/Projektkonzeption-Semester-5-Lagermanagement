// src/api/recommendationsApi.js

const BASE_URL = "/api";

// GET /recommendations
export async function getRecommendations() {
  const res = await fetch(`${BASE_URL}/recommendations`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Fehler beim Laden der Empfehlungen");
  return await res.json();
}
