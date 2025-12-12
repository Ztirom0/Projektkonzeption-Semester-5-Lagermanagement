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
    { id: 1, name: "Dummy Product A" },
    { id: 2, name: "Dummy Product B" }
  ];

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

      {/* ✅ Dummy Produkte */}
      <ul className="list-group mb-4">
        {products.map((p) => (
          <li key={p.id} className="list-group-item">
            {p.name}
          </li>
        ))}
      </ul>

      <button className="btn btn-secondary" onClick={onBack}>
        ⬅️ {i18n.t("common.back")}
      </button>
    </div>
  );
}
