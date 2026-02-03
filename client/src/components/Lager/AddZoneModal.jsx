// src/components/Lager/AddZoneModal.jsx

import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { createZone, createZoneCategory } from "../../api/storageApi";

export default function AddZoneModal({
  locationId,
  storageTypeId,
  zoneCategories,
  onCreated,
  onClose,
  onCategoryCreated
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(zoneCategories[0]?.id ?? null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
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
      setError("Fehler beim Anlegen der Zone");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const newCategory = await createZoneCategory({
        name: newCategoryName.trim()
      });
      setNewCategoryName("");
      setShowNewCategory(false);
      setCategoryId(newCategory.id);
      onCategoryCreated?.(newCategory);
    } catch (err) {
      setError("Fehler beim Anlegen der Kategorie");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CenteredModal title="Zone anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger py-0">{error}</div>
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
          {!showNewCategory ? (
            <>
              <select
                className="form-select"
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                required
              >
                <option value="">-- Kategorie auswählen --</option>
                {zoneCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setShowNewCategory(true)}
              >
                + Neue Kategorie
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                className="form-control"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="z.B. Lagerblock"
                required
              />
              <div className="d-flex gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleCreateCategory}
                  disabled={saving || !newCategoryName.trim()}
                >
                  Erstellen
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategoryName("");
                  }}
                  disabled={saving}
                >
                  Abbrechen
                </button>
              </div>
            </>
          )}
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
          <button type="submit" className="btn btn-success" disabled={saving || !categoryId}>
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
