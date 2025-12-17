import { useState } from "react";

export default function ProductActions() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // später durch echten API-Call ersetzen:
    // fetch("/items", { method: "POST", body: JSON.stringify({ name, sku, unit }) })

    console.log("Artikel angelegt:", { name, sku, unit });

    // Felder zurücksetzen
    setName("");
    setSku("");
    setUnit("");
    setShowForm(false);
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title">Aktionen</h5>

        {!showForm ? (
          <button
            className="btn btn-success"
            onClick={() => setShowForm(true)}
          >
            ➕ Artikel anlegen
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="row g-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Artikelname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Einheit (z. B. Stück)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-success">
                ✅ Speichern
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                ❌ Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
