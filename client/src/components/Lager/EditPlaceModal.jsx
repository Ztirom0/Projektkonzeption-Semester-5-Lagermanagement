// src/components/Lager/EditPlaceModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createPlace } from "../../api/storageApi";

export default function EditPlaceModal({
  locationId,
  zoneId,
  place,
  onCreated,
  onClose
}) {
  const isEdit = !!place;
  const [code, setCode] = useState(place?.code ?? "");
  const [capacity, setCapacity] = useState(place?.capacity ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setSaving(true);
      setError(null);

      if (!isEdit) {
        const newPlace = await createPlace(zoneId, {
          code: code.trim(),
          capacity: Number(capacity)
        });
        onCreated?.(zoneId, newPlace);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Speichern des Platzes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal
      title={isEdit ? "Platz bearbeiten" : "Platz anlegen"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <div className="mb-3">
          <label className="form-label">Platzcode</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="z.B. A-01-01"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kapazität</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min={0}
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
            {isEdit ? "Speichern" : "Anlegen"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
