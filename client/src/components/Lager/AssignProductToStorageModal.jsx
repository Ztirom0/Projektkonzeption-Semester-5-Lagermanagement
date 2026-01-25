// src/components/Lager/AssignProductToStorageModal.jsx

import { useState, useMemo } from "react";
import CenteredModal from "../UI/CenteredModal";
import { products } from "../Products/productDummyData";
import { addItemToLocation } from "./storageDummyData";

export default function AssignProductToStorageModal({
  selectedLocation,
  selectedStorageTypeId,
  selectedZoneId,
  onClose
}) {
  // Produkte auswählen
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? null);

  // Zone & Plätze aus dem aktuellen Lagerkontext
  const currentZone = selectedLocation.zones.find((z) => z.id === selectedZoneId);
  const places = currentZone?.places ?? [];

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    addItemToLocation(
      selectedLocation.id,
      selectedPlaceId,
      selectedProductId,
      quantity,
      minQuantity
    );

    onClose();
  };

  return (
    <CenteredModal title="Artikel einem Lagerplatz zuweisen" onClose={onClose}>
      <form onSubmit={handleSubmit}>

        {/* PRODUKT */}
        <div className="mb-3">
          <label className="form-label">Produkt</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        {/* PLATZ */}
        <div className="mb-3">
          <label className="form-label">Platz</label>
          <select
            className="form-select"
            value={selectedPlaceId ?? ""}
            onChange={(e) => setSelectedPlaceId(Number(e.target.value))}
          >
            <option value="">Bitte Platz wählen</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>
        </div>

        {/* MENGE */}
        <div className="mb-3">
          <label className="form-label">Menge</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        {/* MINDESTBESTAND */}
        <div className="mb-3">
          <label className="form-label">Mindestbestand</label>
          <input
            type="number"
            className="form-control"
            value={minQuantity}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button type="submit" className="btn btn-success">
            Speichern
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
