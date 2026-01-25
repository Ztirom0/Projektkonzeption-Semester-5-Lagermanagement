// src/components/Lager/Dummys.jsx

import { useEffect, useMemo, useState } from "react";

import StorageStats from "./StorageStats";
import StorageToolbar from "./StorageToolbar";
import StorageTable from "./StorageTable";
import StorageZonesTable from "./StorageZonesTable";

import AddLocationModal from "./AddLocationModal";
import AssignStorageTypeModal from "./AssignStorageTypeModal";
import AddZoneModal from "./AddZoneModal";
import EditPlaceModal from "./EditPlaceModal";
import AssignProductToStorageModal from "./AssignProductToStorageModal";

import CenteredModal from "../UI/CenteredModal";

import {
  getLocations,
  getStorageTypes,
  getZoneCategories,
  getZonesByStorageType
} from "../../api/storageApi";
import { getInventory } from "../../api/inventoryApi";

export default function Dummys() {
  const [locations, setLocations] = useState([]);
  const [storageTypes, setStorageTypes] = useState([]);
  const [zoneCategories, setZoneCategories] = useState([]);
  const [zonesByStorageTypeId, setZonesByStorageTypeId] = useState({});
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedStorageTypeId, setSelectedStorageTypeId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const [showAssignProduct, setShowAssignProduct] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAssignType, setShowAssignType] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showEditPlace, setShowEditPlace] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);

  // Initial laden
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [locRes, typeRes, catRes, invRes] = await Promise.all([
          getLocations(),
          getStorageTypes(),
          getZoneCategories(),
          getInventory()
        ]);

        setLocations(locRes);
        setStorageTypes(typeRes);
        setZoneCategories(catRes);
        setInventory(invRes);

        const firstLocation = locRes[0] ?? null;
        const firstStorageTypeId =
          firstLocation?.storageTypes?.[0]?.id ??
          firstLocation?.storageTypes?.[0] ??
          null;

        setSelectedLocationId(firstLocation?.id ?? null);
        setSelectedStorageTypeId(firstStorageTypeId ?? null);

        if (firstStorageTypeId) {
          const zones = await getZonesByStorageType(firstStorageTypeId);
          setZonesByStorageTypeId((prev) => ({
            ...prev,
            [firstStorageTypeId]: zones
          }));
        }
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Lagerdaten");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId) ?? null,
    [locations, selectedLocationId]
  );

  const zones = useMemo(() => {
    if (!selectedStorageTypeId) return [];
    return zonesByStorageTypeId[selectedStorageTypeId] ?? [];
  }, [zonesByStorageTypeId, selectedStorageTypeId]);

  const allPlaces = useMemo(
    () =>
      zones.flatMap((z) =>
        (z.places ?? []).map((p) => ({
          ...p,
          zoneId: z.id,
          zoneName: z.name
        }))
      ),
    [zones]
  );

  const itemsForPlaces = useMemo(() => {
    const placeIds = new Set(allPlaces.map((p) => p.id));
    return inventory.filter((inv) => placeIds.has(inv.placeId));
  }, [inventory, allPlaces]);

  const stats = useMemo(() => {
    const locationCount = locations.length;
    const storageTypeCount = locations.reduce(
      (s, l) => s + (l.storageTypes?.length ?? 0),
      0
    );
    const zoneCount = Object.values(zonesByStorageTypeId).reduce(
      (s, arr) => s + arr.length,
      0
    );
    const placeCount = Object.values(zonesByStorageTypeId).reduce(
      (s, arr) =>
        s +
        arr.reduce((a, z) => a + (z.places?.length ?? 0), 0),
      0
    );
    const itemCount = inventory.length;
    const criticalCount = inventory.filter(
      (i) => i.quantity <= i.minQuantity
    ).length;

    return {
      locationCount,
      storageTypeCount,
      zoneCount,
      placeCount,
      itemCount,
      criticalCount
    };
  }, [locations, zonesByStorageTypeId, inventory]);

  const handleSelectLocation = async (id) => {
    setSelectedLocationId(id);
    setSelectedZoneId(null);
    setSelectedPlaceId(null);

    const loc = locations.find((l) => l.id === id);
    const firstTypeId =
      loc?.storageTypes?.[0]?.id ?? loc?.storageTypes?.[0] ?? null;

    setSelectedStorageTypeId(firstTypeId ?? null);

    if (firstTypeId && !zonesByStorageTypeId[firstTypeId]) {
      const zones = await getZonesByStorageType(firstTypeId);
      setZonesByStorageTypeId((prev) => ({
        ...prev,
        [firstTypeId]: zones
      }));
    }
  };

  const handleSelectStorageType = async (typeId) => {
    setSelectedStorageTypeId(typeId);
    setSelectedZoneId(null);
    setSelectedPlaceId(null);

    if (typeId && !zonesByStorageTypeId[typeId]) {
      const zones = await getZonesByStorageType(typeId);
      setZonesByStorageTypeId((prev) => ({
        ...prev,
        [typeId]: zones
      }));
    }
  };

  const handleLocationCreated = (newLocation) => {
    setLocations((prev) => [...prev, newLocation]);
  };

  const handleStorageTypeAssigned = async (locationId, storageTypeId) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.id === locationId
          ? {
              ...l,
              storageTypes: [
                ...(l.storageTypes ?? []),
                storageTypeId
              ]
            }
          : l
      )
    );

    if (!zonesByStorageTypeId[storageTypeId]) {
      const zones = await getZonesByStorageType(storageTypeId);
      setZonesByStorageTypeId((prev) => ({
        ...prev,
        [storageTypeId]: zones
      }));
    }
  };

  const handleZoneCreated = (storageTypeId, newZone) => {
    setZonesByStorageTypeId((prev) => ({
      ...prev,
      [storageTypeId]: [...(prev[storageTypeId] ?? []), newZone]
    }));
  };

  const handlePlaceCreated = (zoneId, newPlace) => {
    setZonesByStorageTypeId((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].map((z) =>
          z.id === zoneId
            ? { ...z, places: [...(z.places ?? []), newPlace] }
            : z
        );
      });
      return updated;
    });
  };

  const handleInventoryAssigned = (newEntry) => {
    setInventory((prev) => [...prev, newEntry]);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h1 className="mb-3">Lager</h1>
        <div>Lade Lagerdaten…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h1 className="mb-3">Lager</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <StorageStats stats={stats} />

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <StorageToolbar
            locations={locations}
            storageTypes={storageTypes}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={handleSelectLocation}
            selectedStorageTypeId={selectedStorageTypeId}
            setSelectedStorageTypeId={handleSelectStorageType}
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setShowAssignProduct(true)}
              disabled={!selectedLocation || !selectedZoneId}
            >
              Artikel zuweisen
            </button>

            <button
              className="btn btn-dark"
              onClick={() => setShowFunctions(true)}
            >
              Funktionen
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-md-5">
          <StorageTable
            selectedLocation={selectedLocation}
            zones={zones}
            selectedStorageTypeId={selectedStorageTypeId}
            selectedZoneId={selectedZoneId}
            setSelectedZoneId={(zoneId) => {
              setSelectedZoneId(zoneId);
              setSelectedPlaceId(null);
            }}
            zoneCategories={zoneCategories}
          />
        </div>

        <div className="col-md-7">
          <StorageZonesTable
            selectedLocation={selectedLocation}
            zones={zones}
            allPlaces={allPlaces}
            items={itemsForPlaces}
            selectedPlaceId={selectedPlaceId}
            setSelectedPlaceId={setSelectedPlaceId}
          />
        </div>
      </div>

      {showAssignProduct && selectedLocation && (
        <AssignProductToStorageModal
          selectedLocation={selectedLocation}
          zones={zones}
          selectedZoneId={selectedZoneId}
          onAssigned={handleInventoryAssigned}
          onClose={() => setShowAssignProduct(false)}
        />
      )}

      {showFunctions && (
        <CenteredModal
          title="Funktionen"
          onClose={() => setShowFunctions(false)}
        >
          <div className="d-grid gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowFunctions(false);
                setShowAddLocation(true);
              }}
            >
              Lagerort anlegen
            </button>

            <button
              className="btn btn-outline-secondary"
              disabled={!selectedLocation}
              onClick={() => {
                if (!selectedLocation) return;
                setShowFunctions(false);
                setShowAssignType(true);
              }}
            >
              Lagertyp anlegen
            </button>

            <button
              className="btn btn-outline-success"
              disabled={!selectedLocation || !selectedStorageTypeId}
              onClick={() => {
                if (!selectedLocation || !selectedStorageTypeId) return;
                setShowFunctions(false);
                setShowAddZone(true);
              }}
            >
              Zone anlegen
            </button>

            <button
              className="btn btn-outline-warning"
              disabled={!selectedLocation || !selectedZoneId}
              onClick={() => {
                if (!selectedLocation || !selectedZoneId) return;
                setPlaceToEdit(null);
                setShowFunctions(false);
                setShowEditPlace(true);
              }}
            >
              Platz anlegen
            </button>
          </div>
        </CenteredModal>
      )}

      {showAddLocation && (
        <AddLocationModal
          onCreated={handleLocationCreated}
          onClose={() => setShowAddLocation(false)}
        />
      )}

      {showAssignType && selectedLocation && (
        <AssignStorageTypeModal
          location={selectedLocation}
          storageTypes={storageTypes}
          onAssigned={handleStorageTypeAssigned}
          onClose={() => setShowAssignType(false)}
        />
      )}

      {showAddZone && selectedLocation && (
        <AddZoneModal
          locationId={selectedLocation.id}
          storageTypeId={selectedStorageTypeId}
          zoneCategories={zoneCategories}
          onCreated={handleZoneCreated}
          onClose={() => setShowAddZone(false)}
        />
      )}

      {showEditPlace && selectedLocation && (
        <EditPlaceModal
          locationId={selectedLocation.id}
          zoneId={selectedZoneId}
          place={placeToEdit}
          onCreated={handlePlaceCreated}
          onClose={() => setShowEditPlace(false)}
        />
      )}
    </div>
  );
}
