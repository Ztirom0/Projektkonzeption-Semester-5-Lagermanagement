// src/components/Lager/AssignItemToPlaceModal.jsx
// Modal zum Zuweisen eines Artikels zu einem Lagerplatz

import { useState, useEffect } from "react";
import CenteredModal from "../UI/CenteredModal";
import { assignItemToPlace } from "../../api/storageApi";
import { getAllItems } from "../../api/itemsApi";

export default function AssignItemToPlaceModal({ place, onAssigned, onClose }) {
  const [items, setItems] = useState([]);              
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [quantity, setQuantity] = useState("");        
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);

  // Artikel laden
  useEffect(() => {
    const loadItems = async () => {
      try {
        const itemList = await getAllItems();
        setItems(itemList || []);
        if (itemList?.length > 0) {
          setSelectedItemId(itemList[0].id);
        }
      } catch {
        setError("Fehler beim Laden der Artikel");
      } finally {
        setLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !quantity) return;

    try {
      setSaving(true);
      setError(null);

      // Artikel dem Platz zuweisen
      const updatedPlace = await assignItemToPlace(place.id, {
        itemId: selectedItemId,
        quantity: Number(quantity)
      });

      onAssigned?.(updatedPlace);
      onClose();
    } catch {
      setError("Fehler beim Zuweisen des Artikels");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title={`Artikel zuweisen – ${place.code}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>

        {/* Fehleranzeige */}
        {error && <div className="alert alert-danger py-0">{error}</div>}

        {/* Artikelauswahl */}
        <div className="mb-3">
          <label className="form-label">Artikel</label>

          {loadingItems ? (
            <p className="text-muted small">Artikel werden geladen...</p>
          ) : items.length > 0 ? (
            <select
              className="form-select"
              value={selectedItemId ?? ""}
              onChange={(e) => setSelectedItemId(Number(e.target.value))}
              required
            >
              <option value="">-- Artikel auswählen --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-muted small">Keine Artikel vorhanden</p>
          )}
        </div>

        {/* Mengenauswahl */}
        {selectedItemId && (
          <div className="mb-3">
            <label className="form-label">
              Menge (max. {place.capacity || "∞"})
            </label>

            <div className="d-flex gap-2 align-items-center">
              {/* Slider */}
              <input
                type="range"
                className="form-range flex-grow-1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max={place.capacity || 1000}
                step="1"
              />

              {/* Zahleneingabe */}
              <input
                type="number"
                className="form-control"
                style={{ width: "80px" }}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    val === "" ||
                    (Number(val) >= 1 &&
                      Number(val) <= (place.capacity || 1000))
                  ) {
                    setQuantity(val);
                  }
                }}
                min="1"
                max={place.capacity || undefined}
                placeholder="50"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Abbrechen
          </button>

          <button
            type="submit"
            className="btn btn-success"
            disabled={saving || !selectedItemId || !quantity}
          >
            {saving ? "Zuweisen..." : "Zuweisen"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
