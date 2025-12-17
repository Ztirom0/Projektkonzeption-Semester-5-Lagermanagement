import { useState, useMemo } from "react";
import i18n from "../../i18n"; 
import ProductStats from "./ProductStats.jsx";
import ProductSearch from "./ProductSearch.jsx";
import ProductToolbar from "./ProductToolbar.jsx";
import ProductTable from "./ProductTable.jsx";
//import ProductChart from "./ProductChart.jsx";
import ProductPie from "./ProductPie.jsx";
import ProductActions from "./ProductActions.jsx";

export default function DummyProducts({ onBack }) {

  /* const [apiResult, setApiResult] = useState(null);
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
        }df
    }; 

    loadProducts();
    }, []); */

 // Dummy Produkte
  const products = [
    { id: 1, name: "Produkt A", sku: "A-001", unit: "Stück" },
    { id: 2, name: "Produkt B", sku: "B-002", unit: "Stück" },
    { id: 3, name: "Produkt C", sku: "C-003", unit: "Karton" },
    { id: 4, name: "Produkt D", sku: "D-004", unit: "Palette" }
  ];
   // Such- und Filterzustand
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState("all");
  // Dummy Bestände (später aus /inventory API)
  const inventoryByItemId = {
    1: { quantity: 80, minQuantity: 20, status: "ok" },
    2: { quantity: 8, minQuantity: 15, status: "critical" },
    3: { quantity: 30, minQuantity: 25, status: "low" },
    4: { quantity: 120, minQuantity: 30, status: "ok" }
  };
  // Filterlogik
  const filteredProducts = useMemo(() => {
    const base = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );
    if (viewFilter === "all") return base;
    return base.filter((p) => inventoryByItemId[p.id]?.status === viewFilter);
  }, [products, search, viewFilter]);
  // Kennzahlen
  const stats = {
    totalProducts: products.length,
    criticalCount: Object.values(inventoryByItemId).filter((x) => x.status === "critical").length,
    lowCount: Object.values(inventoryByItemId).filter((x) => x.status === "low").length,
    okCount: Object.values(inventoryByItemId).filter((x) => x.status === "ok").length
  };

  return (
  <div className="container py-4">
    <h1 className="mb-2">📊 Bestandübersicht</h1>
    <p className="text-muted mb-4">Alle Artikel, Bestände und Status auf einen Blick</p>

    {/* ✅ API Ergebnis anzeigen 
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {loading ? (
          <p className="text-muted">{i18n.t("common.loading")}</p>
        ) : (
          <pre className="bg-light p-3 rounded">{apiResult}</pre>
        )}
      </div>
    </div> */}

    {/* Kennzahlen */}
      <ProductStats stats={stats} />

      {/* Diagramme */}
      <div className="row mb-4">
       {/*  <div className="col-md-8">
          <ProductChart />
        </div>*/}
        <div className="col-md-4">
          <ProductPie />
        </div>
      </div>

      {/* Toolbar + Suche */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <ProductToolbar viewFilter={viewFilter} onChangeFilter={setViewFilter} />
          <ProductSearch value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Tabelle */} 
      <ProductTable products={filteredProducts} inventoryByItemId={inventoryByItemId} />
    

      {/* Aktionen */}
      <ProductActions />

      {/* Zurück */}
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary mt-4" onClick={onBack}>
          ⬅️ {i18n.t("common.back")}
        </button>
      </div>
    </div>
  );
}
