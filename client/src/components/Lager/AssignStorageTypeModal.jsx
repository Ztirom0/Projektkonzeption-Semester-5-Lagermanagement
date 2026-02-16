// src/components/Lager/AssignStorageTypeModal.jsx
// Modal zum Zuweisen eines Lagertyps zu einem Standort

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { assignStorageTypeToLocation } from "../../api/storageApi";

export default function AssignStorageTypeModal({
  location,
  storageTypes,
  onAssigned,
  onClose
}) {
  const [selectedTypeId, setSelectedTypeId] = useState(
    storageTypes[0]?.id ?? null // Standard: erster Lagertyp
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTypeId) return;

    try {
      setSaving(true);
      setError(null);

      // Lagertyp zuweisen
      await assignStorageTypeToLocation(location.id, selectedTypeId);

      onAssigned?.(location.id, selectedTypeId);
      onClose();
    } catch {
      setError("Fehler beim Zuweisen des Lagertyps");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal
      title={`Lagertyp anlegen / zuweisen – ${location.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>

        {/* Fehleranzeige */}
        {error && <div className="alert alert-danger py-0">{error}</div>}

        {/* Auswahl Lagertyp */}
        <div className="mb-3">
          <label className="form-label">Lagertyp</label>
          <select
            className="form-select"
            value={selectedTypeId ?? ""}
            onChange={(e) => setSelectedTypeId(Number(e.target.value))}
            required
          >
            <option value="">Bitte wählen</option>
            {storageTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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
