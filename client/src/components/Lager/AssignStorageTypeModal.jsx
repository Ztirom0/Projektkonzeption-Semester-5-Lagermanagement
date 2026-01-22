import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { globalStorageTypes, assignStorageTypeToLocation } from "./storageDummyData";

export default function AssignStorageTypeModal({ location, onClose }) {
  const [selectedTypeId, setSelectedTypeId] = useState(
    globalStorageTypes[0]?.id ?? null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTypeId) return;

    assignStorageTypeToLocation(location.id, selectedTypeId);
    onClose();
  };

  return (
    <CenteredModal
      title={`Lagertyp anlegen / zuweisen – ${location.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Lagertyp</label>
          <select
            className="form-select"
            value={selectedTypeId ?? ""}
            onChange={(e) => setSelectedTypeId(Number(e.target.value))}
            required
          >
            <option value="">Bitte wählen</option>
            {globalStorageTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
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
