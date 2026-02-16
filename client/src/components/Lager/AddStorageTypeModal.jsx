// src/components/Lager/AddStorageTypeModal.jsx
// Modal zum Anlegen eines neuen Lagertyps innerhalb eines Standorts

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createStorageType } from "../../api/storageApi";

export default function AddStorageTypeModal({ location, onCreated, onClose }) {
  const [name, setName] = useState("");            // Lagertyp-Name
  const [description, setDescription] = useState(""); // Optional: Beschreibung
  const [saving, setSaving] = useState(false);     // Speichern-Status
  const [error, setError] = useState(null);        // Fehleranzeige

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return; // Name erforderlich

    try {
      setSaving(true);
      setError(null);

      // API-Aufruf zum Erstellen eines Lagertyps
      const newType = await createStorageType(location.id, {
        name: name.trim(),
        description: description.trim()
      });

      // Rückgabe an Elternkomponente (mit leeren Zonen)
      onCreated?.(location.id, { ...newType, zones: [] });

      onClose();
    } catch {
      setError("Fehler beim Anlegen des Lagertyps");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal
      title={`Lagertyp anlegen – ${location.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>

        {/* Fehlerhinweis */}
        {error && (
          <div className="alert alert-danger py-0">{error}</div>
        )}

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Palettenlager"
            required
          />
        </div>

        {/* Beschreibung */}
        <div className="mb-3">
          <label className="form-label">Beschreibung (optional)</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="z.B. Für sperrige Waren"
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
