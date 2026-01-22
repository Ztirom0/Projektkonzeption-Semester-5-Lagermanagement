import { useState } from "react";
import CenteredModal from "../UI/CenteredModal";
import { addLocation } from "./storageDummyData";

export default function AddLocationModal({ onClose }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addLocation(name.trim());
    onClose();
  };

  return (
    <CenteredModal title="Lagerort anlegen" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name des Lagerorts</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Standort A"
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
            Speichern
          </button>
        </div>
      </form>
    </CenteredModal>
  );
}
