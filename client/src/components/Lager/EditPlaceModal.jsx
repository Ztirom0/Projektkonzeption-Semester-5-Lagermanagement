import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { addPlace } from "./storageDummyData";

export default function EditPlaceModal({
  locationId,
  zoneId,
  place,
  onClose
}) {
  const isEdit = !!place;
  const [code, setCode] = useState(place?.code ?? "");
  const [capacity, setCapacity] = useState(place?.capacity ?? 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    // aktuell nur "anlegen"-Usecase (kein Update nötig in deinem Flow)
    addPlace(locationId, zoneId, code.trim(), Number(capacity));
    onClose();
  };

  return (
    <CenteredModal
      title={isEdit ? "Platz bearbeiten" : "Platz anlegen"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
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
          >
            Abbrechen
          </button>
          <button type="submit" className="btn btn-success">
            {isEdit ? "Speichern" : "Anlegen"}
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
