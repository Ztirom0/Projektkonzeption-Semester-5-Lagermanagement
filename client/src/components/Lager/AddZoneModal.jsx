// src/components/Lager/AddZoneModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createZone } from "../../api/storageApi";

export default function AddZoneModal({
  locationId,
  storageTypeId,
  zoneCategories,
  onCreated,
  onClose
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(zoneCategories[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    try {
      setSaving(true);
      setError(null);
      const newZone = await createZone(storageTypeId, {
        name: name.trim(),
        categoryId
      });
      onCreated?.(storageTypeId, newZone);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Fehler beim Anlegen der Zone");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Zone anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <div className="mb-3">
          <label className="form-label">Zonenname</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Zone A"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kategorie</label>
          <select
            className="form-select"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            {zoneCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
