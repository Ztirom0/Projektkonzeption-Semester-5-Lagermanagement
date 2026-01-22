import { useState, useMemo } from "react";

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
import { locations } from "./storageDummyData";

export default function Dummys() {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations[0]?.id ?? null
  );

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId),
    [selectedLocationId]
  );

  const [selectedStorageTypeId, setSelectedStorageTypeId] = useState(
    selectedLocation?.storageTypes[0] ?? null
  );

  const zones = useMemo(() => {
    if (!selectedLocation || !selectedStorageTypeId) return [];
    return selectedLocation.zones.filter(
      (z) => z.storageTypeId === selectedStorageTypeId
    );
  }, [selectedLocation, selectedStorageTypeId]);

  // ausgewählte Zone (für Artikel zuweisen, Zone/Platz anlegen)
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const allPlaces = useMemo(
    () =>
      zones.flatMap((z) =>
        z.places.map((p) => ({
          ...p,
          zoneId: z.id,
          zoneName: z.name
        }))
      ),
    [zones]
  );

  const items = selectedLocation?.items ?? [];

  // Platz-Highlighting (wie bei Zonen)
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  // Modals
  const [showAssignProduct, setShowAssignProduct] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAssignType, setShowAssignType] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showEditPlace, setShowEditPlace] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);

  return (
    <div className="container py-4">
      {/* Kopf-Statistiken */}
      <StorageStats
        stats={{
          locationCount: locations.length,
          storageTypeCount: locations.reduce((s, l) => s + l.storageTypes.length, 0),
          zoneCount: locations.reduce((s, l) => s + l.zones.length, 0),
          placeCount: locations.reduce(
            (s, l) => s + l.zones.reduce((a, z) => a + z.places.length, 0),
            0
          ),
          itemCount: locations.reduce((s, l) => s + l.items.length, 0),
          criticalCount: locations.reduce(
            (s, l) =>
              s +
              l.items.filter((i) => i.quantity <= i.minQuantity).length,
            0
          )
        }}
      />

      {/* Toolbar + Buttons */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <StorageToolbar
            locations={locations}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={(id) => {
              setSelectedLocationId(id);
              // beim Wechsel Lagerort: Zone & Platz zurücksetzen
              setSelectedZoneId(null);
              setSelectedPlaceId(null);
            }}
            selectedStorageTypeId={selectedStorageTypeId}
            setSelectedStorageTypeId={(typeId) => {
              setSelectedStorageTypeId(typeId);
              // beim Wechsel Lagertyp: Zone & Platz zurücksetzen
              setSelectedZoneId(null);
              setSelectedPlaceId(null);
            }}
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            {/* Bestehender Button: Artikel zuweisen */}
            <button
              className="btn btn-primary"
              onClick={() => setShowAssignProduct(true)}
              disabled={!selectedLocation || !selectedZoneId}
            >
              Artikel zuweisen
            </button>

            {/* Neuer Button: Funktionen */}
            <button
              className="btn btn-dark"
              onClick={() => setShowFunctions(true)}
            >
              Funktionen
            </button>
          </div>
        </div>
      </div>

      {/* Struktur & Plätze */}
      <div className="row g-4 mt-1">
        <div className="col-md-5">
          <StorageTable
            selectedLocation={selectedLocation}
            zones={zones}
            selectedStorageTypeId={selectedStorageTypeId}
            selectedZoneId={selectedZoneId}
            setSelectedZoneId={(zoneId) => {
              setSelectedZoneId(zoneId);
              setSelectedPlaceId(null); // beim Zonenwechsel Platz-Highlight zurücksetzen
            }}
          />
        </div>

        <div className="col-md-7">
          <StorageZonesTable
            selectedLocation={selectedLocation}
            zones={zones}
            allPlaces={allPlaces}
            items={items}
            selectedPlaceId={selectedPlaceId}
            setSelectedPlaceId={setSelectedPlaceId}
          />
        </div>
      </div>

      {/* Artikel zuweisen Modal */}
      {showAssignProduct && selectedLocation && (
        <AssignProductToStorageModal
          selectedLocation={selectedLocation}
          selectedZoneId={selectedZoneId}
          onClose={() => setShowAssignProduct(false)}
        />
      )}

      {/* FUNKTIONEN-POPUP */}
      {showFunctions && (
        <CenteredModal title="Funktionen" onClose={() => setShowFunctions(false)}>
          <div className="d-grid gap-3">
            {/* Lagerort anlegen – braucht keinen Kontext */}
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowFunctions(false);
                setShowAddLocation(true);
              }}
            >
              Lagerort anlegen
            </button>

            {/* Lagertyp anlegen – braucht ausgewählten Lagerort */}
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

            {/* Zone anlegen – braucht Lagerort + Lagertyp */}
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

            {/* Platz anlegen – braucht ausgewählte Zone */}
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

      {/* LAGERORT ANLEGEN */}
      {showAddLocation && (
        <AddLocationModal onClose={() => setShowAddLocation(false)} />
      )}

      {/* LAGERTYP ANLEGEN */}
      {showAssignType && selectedLocation && (
        <AssignStorageTypeModal
          location={selectedLocation}
          onClose={() => setShowAssignType(false)}
        />
      )}

      {/* ZONE ANLEGEN */}
      {showAddZone && selectedLocation && (
        <AddZoneModal
          locationId={selectedLocation.id}
          storageTypeId={selectedStorageTypeId}
          onClose={() => setShowAddZone(false)}
        />
      )}

      {/* PLATZ ANLEGEN / BEARBEITEN */}
      {showEditPlace && selectedLocation && (
        <EditPlaceModal
          locationId={selectedLocation.id}
          zoneId={selectedZoneId}
          place={placeToEdit}
          onClose={() => setShowEditPlace(false)}
        />
      )}
    </div>
  );
}
