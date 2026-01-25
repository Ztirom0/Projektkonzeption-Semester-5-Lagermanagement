import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { zoneCategories, addZone } from "./storageDummyData";

export default function AddZoneModal({ locationId, storageTypeId, onClose }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(zoneCategories[0]?.id ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    addZone(locationId, name.trim(), categoryId, storageTypeId);
    onClose();
  };

  return (
    <CenteredModal title="Zone anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
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
          >
            Abbrechen
          </button>
          <button type="submit" className="btn btn-success">
            Speichern
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
