// src/components/Products/CreateProductModal.jsx
// Modal zum Anlegen eines neuen Produkts inkl. SKU‑Validierung

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";

export default function CreateProductModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("Stück");
  const [minQuantity, setMinQuantity] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [skuError, setSkuError] = useState("");

  // Entfernt Leerzeichen, Sonderzeichen und erzwingt Großschreibung
  const normalizeSku = (value) =>
    value
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/[^A-Z0-9]/g, "");

  // Erwartetes Format: "SKU" + Zahlen
  const isValidSku = (value) => /^SKU\d+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    setSkuError("");

    // Frühvalidierung der SKU
    if (!isValidSku(sku)) {
      setSaving(false);
      setSkuError("SKU muss dem Format SKUXXX entsprechen.");
      return;
    }

    try {
      await onSave({
        name,
        sku,
        unit,
        minQuantity: Number(minQuantity)
      });

      setSuccess(true);

      // Kurze Erfolgsmeldung, dann Modal schließen
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setError(err?.message || "Fehler beim Speichern des Artikels");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Neues Produkt anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>

        {error && <div className="alert alert-danger py-0">{error}</div>}
        {success && <div className="alert alert-success py-0">Artikel wurde angelegt.</div>}

        {/* Produktname */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* SKU mit Normalisierung + Validierung */}
        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            className="form-control"
            value={sku}
            onChange={(e) => setSku(normalizeSku(e.target.value))}
            placeholder="SKU006"
            minLength={4}
            required
          />
          <small className="text-muted">Format: SKU006 (SKU + Zahlen).</small>
          {skuError && <div className="text-danger small mt-1">{skuError}</div>}
        </div>

        {/* Einheit */}
        <div className="mb-3">
          <label className="form-label">Einheit</label>
          <select
            className="form-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          >
            <option value="Stück">Stück</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
            <option value="m">m</option>
            <option value="cm">cm</option>
            <option value="Palette">Palette</option>
            <option value="Karton">Karton</option>
          </select>
        </div>

        {/* Mindestbestand */}
        <div className="mb-3">
          <label className="form-label">Mindestbestand</label>
          <input
            type="number"
            className="form-control"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            min="0"
            required
          />
        </div>

        {/* Aktionen */}
        <div className="d-flex justify-content-end gap-0 mt-4">
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
            disabled={saving}
          >
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>

      </form>
    </CenteredModal>
  );
}
