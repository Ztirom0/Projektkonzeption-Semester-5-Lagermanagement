// src/components/Lager/AssignProductToStorageModal.jsx

import { useEffect, useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { getAllItems } from "../../api/itemsApi";
import { assignItemToPlace } from "../../api/storageApi";

export default function AssignProductToStorageModal({
  selectedLocation,
  zones,
  selectedZoneId,
  onAssigned,
  onClose
}) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0);
  const [saving, setSaving] = useState(false);

  const currentZone = zones.find((z) => z.id === selectedZoneId);
  const places = currentZone?.places ?? [];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setError(null);
        const items = await getAllItems();
        setProducts(items);
        setSelectedProductId(items[0]?.id ?? null);
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Produkte");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !selectedPlaceId) return;

    try {
      setSaving(true);
      setError(null);

      const newEntry = await assignItemToPlace(selectedPlaceId, {
        itemId: selectedProductId,
        quantity,
        minQuantity
      });

      onAssigned?.(newEntry);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Speichern der Artikelzuweisung");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal
      title="Artikel einem Lagerplatz zuweisen"
      onClose={onClose}
    >
      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}

      {loadingProducts ? (
        <div>Lade Produkte…</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Produkt</label>
            <select
              className="form-select"
              value={selectedProductId ?? ""}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

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

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Abbrechen
            </button>
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </form>
      )}
    </CenteredModal>
  );
}
