// src/api/storageApi.js

const BASE_URL = "/api";

// ---------- Lagerorte & Lagertypen ----------

// GET /locations
export async function getLocations() {
  const res = await fetch(`${BASE_URL}/locations`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Lagerorte");
  return await res.json();
}

// POST /locations
export async function createLocation(name) {
  const body = {
    name,
    address: "" // optional, da dein Modal aktuell nur Name hat
  };

  const res = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen des Lagerorts");
  return await res.json();
}

// GET /storage-types
export async function getStorageTypes() {
  const res = await fetch(`${BASE_URL}/storage-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Lagertypen");
  return await res.json();
}

// POST /storage-types
export async function createStorageType(data) {
  const res = await fetch(`${BASE_URL}/storage-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen des Lagertyps");
  return await res.json();
}

// POST /locations/{id}/storage-types
export async function assignStorageTypeToLocation(locationId, storageTypeId) {
  const res = await fetch(`${BASE_URL}/locations/${locationId}/storage-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storageTypeId })
  });
  if (!res.ok) throw new Error("Fehler beim Zuweisen des Lagertyps");
  return await res.json();
}

// ---------- Zonen-Kategorien ----------

// GET /zone-categories
export async function getZoneCategories() {
  const res = await fetch(`${BASE_URL}/zone-categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Zonen-Kategorien");
  return await res.json();
}

// POST /zone-categories
export async function createZoneCategory(data) {
  const res = await fetch(`${BASE_URL}/zone-categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen der Zonen-Kategorie");
  return await res.json();
}

// ---------- Zonen & Plätze ----------

// GET /storage-types/{id}/zones
export async function getZonesByStorageType(storageTypeId) {
  const res = await fetch(`${BASE_URL}/storage-types/${storageTypeId}/zones`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Zonen");
  return await res.json();
}

// POST /storage-types/{id}/zones
export async function createZone(storageTypeId, { name, categoryId }) {
  const res = await fetch(`${BASE_URL}/storage-types/${storageTypeId}/zones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, categoryId })
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen der Zone");
  return await res.json();
}

// POST /zone/{id}/places
export async function createPlace(zoneId, { code, capacity }) {
  const res = await fetch(`${BASE_URL}/zone/${zoneId}/places`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, capacity })
  });
  if (!res.ok) throw new Error("Fehler beim Anlegen des Platzes");
  return await res.json();
}

// ---------- Artikelzuweisung ----------

// POST /places/{id}/items
export async function assignItemToPlace(placeId, { itemId, quantity, minQuantity }) {
  const res = await fetch(`${BASE_URL}/places/${placeId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, quantity, minQuantity })
  });
  if (!res.ok) throw new Error("Fehler beim Zuweisen des Artikels zum Platz");
  return await res.json();
}
