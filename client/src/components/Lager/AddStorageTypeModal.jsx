// src/components/Lager/AddStorageTypeModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { assignStorageTypeToLocation, createStorageType } from "../../api/storageApi";

export default function AddStorageTypeModal({ location, onCreated, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const newType = await createStorageType({
        name: name.trim(),
        description: description.trim()
      });
      await assignStorageTypeToLocation(location.id, newType.id);
      onCreated?.(location.id, { ...newType, zones: [] });
      onClose();
    } catch (err) {
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
        {error && (
          <div className="alert alert-danger py-0">{error}</div>
        )}

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

        <div className="d-flex justify-content-end gap-0">
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
