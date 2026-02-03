// src/components/Products/ProductSearch.jsx

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { getAllItems } from "../../api/itemsApi";
import { getInventory } from "../../api/inventoryApi";
import { getSales } from "../../api/salesApi";
import { calculateAllInventoryStatuses } from "../../api/inventoryCalculations";

export default function ProductSearch({ items: itemsProp, onSelect, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterType, setFilterType] = useState("all");
  const [itemsWithInventory, setItemsWithInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [inventory, sales] = await Promise.all([
          getInventory(),
          getSales()
        ]);

        const itemsRes = itemsProp && itemsProp.length > 0 ? itemsProp : await getAllItems();

        // Berechne Status für jedes Item
        const statuses = calculateAllInventoryStatuses(itemsRes, inventory, sales);
        
        // Merge Items mit berechneten Status-Daten
        const merged = itemsRes.map(item => {
          const status = statuses.find(s => s.itemId === item.id);
          const minQuantity = item.minQuantity ?? 0;
          
          return {
            ...item,
            currentQuantity: status?.currentQuantity ?? 0,
            minQuantity,
            dailySalesRate: status?.dailySalesRate ?? 0,
            daysRemaining: status?.daysRemaining ?? 0
          };
        });
        setItemsWithInventory(merged);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [itemsProp]);




  const filtered = useMemo(() => {
    let result = itemsWithInventory || [];

    // Textsuche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term) ||
          item.unit?.toLowerCase().includes(term)
      );
    }

    // Filterung
    if (filterType === "low-stock") {
      result = result.filter(item => item.currentQuantity <= item.minQuantity);
    } else if (filterType === "out-of-stock") {
      result = result.filter(item => item.currentQuantity === 0);
    }

    // Sortierung
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "sku":
          return a.sku.localeCompare(b.sku);
        case "stock":
          return b.currentQuantity - a.currentQuantity;
        case "min-first":
          return (
            (a.currentQuantity <= a.minQuantity ? 0 : 1) -
            (b.currentQuantity <= b.minQuantity ? 0 : 1)
          );
        default:
          return 0;
      }
    });
    return result;
  }, [itemsWithInventory, searchTerm, sortBy, filterType]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Lade Produkte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-search">
      {/* Header mit Add-Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">🔍 Produktsuche & Filter</h5>
        <button className="btn btn-primary btn-sm" onClick={onAddNew}>
          + Neues Produkt
        </button>
      </div>

      {/* Suchleiste */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Produkt nach Name oder SKU suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter & Sort */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Filter</label>
          <select
            className="form-select form-select-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Alle Produkte</option>
            <option value="low-stock">⚠️ Niedriger Bestand</option>
            <option value="out-of-stock">Ausverkauft</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Sortierung</label>
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Nach Name (A-Z)</option>
            <option value="sku">Nach SKU</option>
            <option value="stock">Nach Bestand (absteigend)</option>
            <option value="min-first">Niedrig Bestand zuerst</option>
          </select>
        </div>
      </div>

      {/* Ergebnisse */}
      {filtered.length > 0 ? (
        <div className="product-results">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>SKU</th>
                  <th>Einheit</th>
                  <th>Bestand</th>
                  <th>Min. Menge</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isLow = item.currentQuantity <= item.minQuantity;
                  const isEmpty = item.currentQuantity === 0;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelect?.(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="fw-semibold">{item.name}</td>
                      <td>
                        <code className="bg-light p-0 rounded">{item.sku}</code>
                      </td>
                      <td>{item.unit}</td>
                      <td>
                        <span className="badge bg-secondary">{item.currentQuantity}</span>
                      </td>
                      <td>{item.minQuantity}</td>
                      <td>
                        {isEmpty ? (
                          <span className="badge bg-danger">Ausverkauft</span>
                        ) : isLow ? (
                          <span className="badge bg-warning text-dark">⚠️ Niedrig</span>
                        ) : (
                          <span className="badge bg-success">✓ OK</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(item);
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <small className="text-muted d-block mt-3">
            {filtered.length} von {itemsWithInventory?.length || 0} Produkten angezeigt
          </small>
        </div>
      ) : (
        <div className="alert alert-info text-center py-5">
          {searchTerm ? (
            <>
              <h6>😕 Keine Produkte gefunden</h6>
              <p className="text-muted mb-3">Versuchen Sie andere Suchbegriffe oder Filter</p>
            </>
          ) : (
            <>
              <h6>Keine Produkte vorhanden</h6>
              <p className="text-muted mb-3">Erstellen Sie das erste Produkt um zu starten</p>
            </>
          )}
          <button className="btn btn-primary btn-sm" onClick={onAddNew}>
            + Produkt hinzufügen
          </button>
        </div>
      )}

      <style>{`
        .product-search {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-search .form-control:focus,
        .product-search .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }

        .product-results table tbody tr {
          transition: background-color 0.2s ease;
        }

        .product-results table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
