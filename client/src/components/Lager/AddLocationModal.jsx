// src/components/Lager/AddLocationModal.jsx
// Modal zum Anlegen eines neuen Lagerorts

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createLocation } from "../../api/storageApi";

export default function AddLocationModal({ onCreated, onClose }) {
  const [name, setName] = useState("");        // Eingabefeld
  const [saving, setSaving] = useState(false); // Speichern-Status
  const [error, setError] = useState(null);    // Fehlermeldung

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return; // Leere Eingabe verhindern

    try {
      setSaving(true);
      setError(null);

      // API-Aufruf zum Erstellen eines Lagerorts
      const newLocation = await createLocation(name.trim());

      // Callback an Elternkomponente
      onCreated?.(newLocation);

      onClose();
    } catch {
      setError("Fehler beim Anlegen des Lagerorts");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Lagerort anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        
        {/* Fehleranzeige */}
        {error && (
          <div className="alert alert-danger py-0">{error}</div>
        )}

        {/* Eingabefeld */}
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
            disabled={saving}
          >
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
