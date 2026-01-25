// src/components/Products/DummyProducts.jsx

import { useEffect, useMemo, useState } from "react";
import i18n from "../../i18n";

import ProductStats from "./ProductStats.jsx";
import ProductSearch from "./ProductSearch.jsx";
import ProductToolbar from "./ProductToolbar.jsx";
import ProductTable from "./ProductTable.jsx";
import CreateProductModal from "./CreateProductModal.jsx";

import { getAllItems, createItem } from "../../api/itemsApi";
import { getInventory } from "../../api/inventoryApi";

function buildInventoryMap(inventory) {
  const map = {};

  inventory.forEach((inv) => {
    const { itemId, quantity, minQuantity } = inv;

    let status = "ok";
    if (quantity <= minQuantity) status = "critical";
    else if (quantity <= minQuantity * 1.5) status = "low";

    map[itemId] = { quantity, minQuantity, status };
  });

  return map;
}

export default function DummyProducts({ onBack }) {
  const [products, setProducts] = useState([]);
  const [inventoryByItemId, setInventoryByItemId] = useState({});
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState("all");
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daten laden
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [itemsRes, inventoryRes] = await Promise.all([
          getAllItems(),
          getInventory()
        ]);

        setProducts(itemsRes);
        setInventoryByItemId(buildInventoryMap(inventoryRes));
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Produktdaten");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const base = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    if (viewFilter === "all") return base;

    return base.filter((p) => {
      const inv = inventoryByItemId[p.id];
      return inv && inv.status === viewFilter;
    });
  }, [products, search, viewFilter, inventoryByItemId]);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    let criticalCount = 0;
    let lowCount = 0;
    let okCount = 0;

    products.forEach((p) => {
      const inv = inventoryByItemId[p.id];
      if (!inv) return;

      if (inv.status === "critical") criticalCount++;
      else if (inv.status === "low") lowCount++;
      else if (inv.status === "ok") okCount++;
    });

    return { totalProducts, criticalCount, lowCount, okCount };
  }, [products, inventoryByItemId]);

  const handleCreateProduct = async (prod) => {
    const newItem = await createItem(prod);
    setProducts((prev) => [...prev, newItem]);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <h1 className="mb-2">📦 Produkte</h1>
        <div>Lade Daten…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h1 className="mb-2">📦 Produkte</h1>
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary mt-3" onClick={onBack}>
          ⬅️ {i18n.t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-2">📦 Produkte</h1>

      <ProductStats stats={stats} />

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowCreateProduct(true)}
            >
              + Artikel anlegen
            </button>
          </div>

          <ProductToolbar
            viewFilter={viewFilter}
            onChangeFilter={setViewFilter}
          />
          <ProductSearch value={search} onChange={setSearch} />
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        inventoryByItemId={inventoryByItemId}
      />

      {showCreateProduct && (
        <CreateProductModal
          onSave={handleCreateProduct}
          onClose={() => setShowCreateProduct(false)}
        />
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary mt-4" onClick={onBack}>
          ⬅️ {i18n.t("common.back")}
        </button>
      </div>
    </div>
  );
}
