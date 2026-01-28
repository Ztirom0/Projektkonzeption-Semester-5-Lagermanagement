// src/components/Lager/storageDummyData.jsx



// Kann gelöscht werden, wird nicht mehr gebraucht




// Globale Lagertypen
export const globalStorageTypes = [
  { id: 1, name: "Hochregal", description: "Hochregallager mit Palettenplätzen" },
  { id: 2, name: "Kühlhaus", description: "Temperaturgeführtes Lager" },
  { id: 3, name: "Blocklager", description: "Bodenlagerung" }
];

// Zonen-Kategorien
export const zoneCategories = [
  { id: 1, name: "A-Artikel" },
  { id: 2, name: "B-Artikel" },
  { id: 3, name: "C-Artikel" }
];

// Vorlagen für Lagertypen
const storageTypeTemplates = {
  1: {
    zones: [
      {
        name: "Zone A",
        categoryId: 1,
        places: [
          { code: "A-01-01", capacity: 100 },
          { code: "A-01-02", capacity: 100 }
        ]
      },
      {
        name: "Zone B",
        categoryId: 2,
        places: []
      }
    ]
  },
  2: {
    zones: [
      {
        name: "Kühlzone 1",
        categoryId: 1,
        places: [
          { code: "K-01-01", capacity: 50 }
        ]
      }
    ]
  },
  3: {
    zones: [
      {
        name: "Blockzone 1",
        categoryId: 3,
        places: [
          { code: "B-01-01", capacity: 200 }
        ]
      }
    ]
  }
};

// Standorte (in-memory)
export let locations = [
  {
    id: 1,
    name: "Standort A",
    storageTypes: [1],
    zones: [],
    items: []
  },
  {
    id: 2,
    name: "Standort B",
    storageTypes: [2],
    zones: [],
    items: []
  }
];

// Initialdaten nur EINMAL erzeugen
function initLocationData() {
  locations.forEach((loc) => {
    const typeId = loc.storageTypes[0];
    const tmpl = storageTypeTemplates[typeId];

    if (tmpl && loc.zones.length === 0) {
      tmpl.zones.forEach((zone) => {
        loc.zones.push({
          id: Date.now() + Math.random(),
          name: zone.name,
          categoryId: zone.categoryId,
          storageTypeId: typeId,
          places: zone.places.map((p) => ({
            id: Date.now() + Math.random(),
            code: p.code,
            capacity: p.capacity
          }))
        });
      });
    }
  });
}

initLocationData();

// Status
export function isItemCritical(item) {
  return item.quantity < item.minQuantity;
}

// ---------------------------------------------------------
// LAGERORT ANLEGEN
// ---------------------------------------------------------
export function addLocation(name) {
  const newLocation = {
    id: Date.now(),
    name,
    storageTypes: [],
    zones: [],
    items: []
  };

  locations = [...locations, newLocation];
  return newLocation;
}

// ---------------------------------------------------------
// LAGERTYP ZUWEISEN
// ---------------------------------------------------------
export function assignStorageTypeToLocation(locationId, typeId) {
  const loc = locations.find((l) => l.id === locationId);
  if (!loc) return null;

  if (!loc.storageTypes.includes(typeId)) {
    loc.storageTypes.push(typeId);
  }

  const alreadyExists = loc.zones.some((z) => z.storageTypeId === typeId);
  if (alreadyExists) return typeId;

  const tmpl = storageTypeTemplates[typeId];
  if (!tmpl) return null;

  tmpl.zones.forEach((zone) => {
    const newZone = {
      id: Date.now() + Math.random(),
      name: zone.name,
      categoryId: zone.categoryId,
      storageTypeId: typeId,
      places: zone.places.map((p) => ({
        id: Date.now() + Math.random(),
        code: p.code,
        capacity: p.capacity
      }))
    };
    loc.zones.push(newZone);
  });

  return typeId;
}

// ---------------------------------------------------------
// ARTIKEL HINZUFÜGEN
// ---------------------------------------------------------
export function addItemToLocation(locationId, placeId, productId, quantity, minQuantity) {
  const loc = locations.find((l) => l.id === locationId);
  if (!loc) return null;

  const newItem = {
    id: Date.now() + Math.random(),
    placeId,
    productId,
    quantity: Number(quantity),
    minQuantity: Number(minQuantity)
  };

  loc.items.push(newItem);
  return newItem;
}

// ---------------------------------------------------------
// ZONE HINZUFÜGEN
// ---------------------------------------------------------
export function addZone(locationId, name, categoryId, storageTypeId) {
  const loc = locations.find((l) => l.id === locationId);
  if (!loc) return null;

  const newZone = {
    id: Date.now() + Math.random(),
    name,
    categoryId,
    storageTypeId,
    places: []
  };

  loc.zones.push(newZone);
  return newZone;
}

// ---------------------------------------------------------
// PLATZ HINZUFÜGEN
// ---------------------------------------------------------
export function addPlace(locationId, zoneId, code, capacity) {
  const loc = locations.find((l) => l.id === locationId);
  const zone = loc?.zones.find((z) => z.id === zoneId);
  if (!zone) return null;

  const newPlace = {
    id: Date.now() + Math.random(),
    code,
    capacity: Number(capacity)
  };

  zone.places.push(newPlace);
  return newPlace;
}

// ---------------------------------------------------------
// ALERTS API MOCK – dynamisch aus Lagerdaten
// ---------------------------------------------------------
export async function fetchAlerts() {
  const alerts = [];

  locations.forEach((loc) => {
    loc.items.forEach((item) => {
      if (item.quantity < item.minQuantity) {
        alerts.push({
          itemId: item.productId,
          placeId: item.placeId,
          quantity: item.quantity,
          minQuantity: item.minQuantity,
          alert: "Unterschreitung"
        });
      }
    });
  });

  return alerts;
}
