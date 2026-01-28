// src/components/Lager/AddLocationModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createLocation } from "../../api/storageApi";

export default function AddLocationModal({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const newLocation = await createLocation(name.trim());
      onCreated?.(newLocation);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Anlegen des Lagerorts");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Lagerort anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <div className="mb-3">
          <label className="form-label">Name des Lagerorts</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Standort A"
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
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
    </CenteredModal>
  );
}
