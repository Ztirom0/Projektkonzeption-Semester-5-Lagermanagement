// src/components/Products/CreateProductModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";

export default function CreateProductModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave({ name, sku, unit });
      onClose();
    } catch (err) {
      setError("Fehler beim Speichern des Artikels");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Neues Produkt anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger py-0">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            className="form-control"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Einheit</label>
          <input
            className="form-control"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-0 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
