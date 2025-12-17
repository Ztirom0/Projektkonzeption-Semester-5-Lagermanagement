import { useEffect, useState } from "react";
import i18n from "../i18n";

export default function DummyProducts({ onBack }) {
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(true);

    console.log(apiResult)

    useEffect(() => {
    const loadProducts = async () => {
        try {
        const res = await fetch(`/api/products/all`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Fehler beim Laden der Produkte");

        const text = await res.text(); // dein Controller liefert String
        setApiResult(text);

        } catch (err) {
        console.error(err);
        setApiResult("❌ API error");
        } finally {
        setLoading(false);
        }
    };

    loadProducts();
    }, []);

  const products = [
    { id: 1, name: "Produkt A", sku: "A-001", unit: "Stück" },
    { id: 2, name: "Produkt B", sku: "B-002", unit: "Stück" },
    { id: 3, name: "Produkt C", sku: "C-003", unit: "Karton" },
    { id: 4, name: "Produkt D", sku: "D-004", unit: "Palette" }
  ];

  const [search, setSearch] = useState("");

  // Filterfunktion für Dummy-Produkte
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

   return (
  <div className="container py-4">
    <h1 className="mb-3">{i18n.t("products.title")}</h1>
    <p className="text-muted">{i18n.t("products.description")}</p>

    {/* ✅ API Ergebnis anzeigen */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {loading ? (
          <p className="text-muted">{i18n.t("common.loading")}</p>
        ) : (
          <pre className="bg-light p-3 rounded">{apiResult}</pre>
        )}
      </div>
    </div>

    {/* Kennzahlen */}
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h6 className="text-muted">Produkte insgesamt</h6>
            <h2>{products.length}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h6 className="text-muted">Kritische Bestände</h6>
            <h2>0</h2> {/* später dynamisch */}
          </div>
        </div>
      </div>
    </div>

    {/* Suchfeld */}
    <div className="input-group mb-3">
      <span className="input-group-text">🔍</span>
      <input
        type="text"
        className="form-control"
        placeholder="Produkte suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Tabelle mit Dummy-Produkten */}
    <div className="card shadow-sm">
      <div className="card-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Einheit</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.unit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Keine Produkte gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Zurück-Button */}
    <button className="btn btn-secondary mt-4" onClick={onBack}>
      ⬅️ {i18n.t("common.back")}
    </button>
  </div>
);
}
