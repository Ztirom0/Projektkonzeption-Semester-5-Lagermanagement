import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/CreateOffer.scss";

export default function CreateOffer({ company, setCompany, marketingCosts }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [marketing, setMarketing] = useState(0);

  const marketingCostFinal = Number(marketing * quantity * marketingCosts) || 0;
  const products = company.storage.products;
  const selectedBatch = products.find(p => p.product.id === parseInt(selectedProductId));

  const handleSubmit = async () => {
    if (!selectedBatch || quantity > selectedBatch.quantity || quantity < 1 || price <= 0) {
      alert(t("createOffer.invalidData"));
      return;
    }

    const offerData = {
      productId: selectedProductId,
      quantity,
      price: parseFloat(price),
      marketing,
    };

    try {
      const res = await fetch(`/api/storage/offers/${company.info.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });

      if (!res.ok) throw new Error("Fehler beim Erstellen des Angebots");

      const updatedOffers = await res.json();
      const updatedProducts = products.map(batch => {
        if (batch.product.id === parseInt(selectedProductId)) {
          return {
            ...batch,
            quantity: batch.quantity - quantity,
          };
        }
        return batch;
      });

      setCompany({
        ...company,
        offers: updatedOffers,
        storage: {
          ...company.storage,
          products: updatedProducts,
        },
      });

      // Reset
      setShowForm(false);
      setSelectedProductId("");
      setQuantity(1);
      setPrice("");
      setMarketing(0);
    } catch (err) {
      console.error(err);
      alert("❌ " + t("createOffer.errorCreate"));
    }
  };

  return (
    <div className="create-offer card p-2 mb-2">
      {!showForm ? (
        <button className="btn btn-success w-100" onClick={() => setShowForm(true)}>
          ➕ {t("createOffer.openForm")}
        </button>
      ) : (
        <>
          <div className="mb-2">
            <select
              className="form-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">{t("createOffer.chooseProduct")}</option>
              {products.map((batch) => (
                <option key={batch.product.id} value={batch.product.id}>
                  {batch.product.name} ({t("createOffer.storage")}: {batch.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="row g-2">
            <div className="col">
              <label className="form-label">
                {t("common.quantity")}: {quantity} / {selectedBatch?.quantity || 0}
              </label>
              <input
                type="range"
                className="form-range p-0 mt-2"
                style={{ height: "8px" }}
                min="1"
                max={selectedBatch?.quantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={!selectedBatch}
              />
            </div>
            <div className="col">
              <label className="form-label">{t("common.price")}</label>
              <input
                type="number"
                className="form-control"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t("createOffer.pricePlaceholder")}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              {t("createOffer.marketing")}: {marketing} / 10
            </label>
            <input
              type="range"
              className="form-range p-0 mt-2"
              style={{ height: "8px" }}
              min="0"
              max="10"
              value={marketing}
              onChange={(e) => setMarketing(Number(e.target.value))}
            />
            <small className="text-muted"> {t("createOffer.marketingInfo", {marketingCosts: marketingCosts})}</small>
            <div className="mt-1">
              <strong>{t("createOffer.marketingCosts")}:</strong> {marketingCostFinal.toLocaleString()} €
            </div>
          </div>

          <div className="mt-2 d-flex gap-2">
            <button
              className= {!selectedProductId || quantity < 1 || price <= 0 ? "btn btn-secondary" :  "btn btn-success"}
              onClick={handleSubmit}
              disabled={!selectedProductId || quantity < 1 || price <= 0}
            >
              {t("common.create")}
            </button>
            <button className="btn btn-danger" onClick={() => setShowForm(false)}>
              {t("common.cancel")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
