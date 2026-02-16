// src/components/Lager/AddPlaceModal.jsx
// Modal zum Anlegen eines neuen Lagerplatzes innerhalb einer Zone

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createPlace } from "../../api/storageApi";

export default function AddPlaceModal({ zone, onCreated, onClose }) {
  const [code, setCode] = useState("");          // Platz-Code
  const [capacity, setCapacity] = useState("");  // Optional: Kapazität
  const [saving, setSaving] = useState(false);   // Speichern-Status
  const [error, setError] = useState(null);      // Fehleranzeige

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return; // Code darf nicht leer sein

    try {
      setSaving(true);
      setError(null);

      // API-Aufruf zum Erstellen eines Platzes
      const newPlace = await createPlace(zone.id, {
        code: code.trim(),
        capacity: capacity === "" ? null : Number(capacity)
      });

      // Rückmeldung an Elternkomponente
      onCreated?.(zone.id, newPlace);

      onClose();
    } catch {
      setError("Fehler beim Anlegen des Platzes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title={`Platz anlegen – ${zone.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>

        {/* Fehlerhinweis */}
        {error && (
          <div className="alert alert-danger py-0">{error}</div>
        )}

        {/* Platz-Code */}
        <div className="mb-3">
          <label className="form-label">Platz-Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="z.B. A1"
            required
          />
        </div>

        {/* Kapazität (optional) */}
        <div className="mb-3">
          <label className="form-label">Kapazität</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="0"
            placeholder="z.B. 100"
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
