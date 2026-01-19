// src/components/Products/DummyProducts.jsx

import { useState, useMemo } from "react";
import i18n from "../../i18n";

import ProductStats from "./ProductStats.jsx";
import ProductSearch from "./ProductSearch.jsx";
import ProductToolbar from "./ProductToolbar.jsx";
import ProductTable from "./ProductTable.jsx";
import ProductPie from "./ProductPie.jsx";
import ProductActions from "./ProductActions.jsx";

import CreateProductModal from "./CreateProductModal.jsx";

import { products } from "./productDummyData";
import { locations } from "../Lager/storageDummyData";

function getInventoryForProduct(productId) {
  const allItems = locations.flatMap((loc) => loc.items);
  const items = allItems.filter((i) => i.productId === productId);

  if (items.length === 0) {
    return { quantity: 0, minQuantity: 0, status: "unknown" };
  }

  const quantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const minQuantity = Math.max(...items.map((i) => i.minQuantity));

  let status = "ok";
  if (quantity <= minQuantity) status = "critical";
  else if (quantity <= minQuantity * 1.5) status = "low";

  return { quantity, minQuantity, status };
}

export default function DummyProducts({ onBack }) {
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState("all");
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const filteredProducts = useMemo(() => {
    const base = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    if (viewFilter === "all") return base;

    return base.filter(
      (p) => getInventoryForProduct(p.id).status === viewFilter
    );
  }, [search, viewFilter]);

  const stats = {
    totalProducts: products.length,
    criticalCount: products.filter(
      (p) => getInventoryForProduct(p.id).status === "critical"
    ).length,
    lowCount: products.filter(
      (p) => getInventoryForProduct(p.id).status === "low"
    ).length,
    okCount: products.filter(
      (p) => getInventoryForProduct(p.id).status === "ok"
    ).length
  };

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
        inventoryByItemId={Object.fromEntries(
          products.map((p) => [
            p.id,
            getInventoryForProduct(p.id)
          ])
        )}
      />

      {showCreateProduct && (
        <CreateProductModal
          onSave={(prod) => {
            products.push({
              id: Date.now(),
              ...prod
            });
            setShowCreateProduct(false);
          }}
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
