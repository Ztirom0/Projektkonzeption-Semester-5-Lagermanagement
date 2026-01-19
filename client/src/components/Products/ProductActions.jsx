import { useState } from "react";
import CreateProductModal from "./CreateProductModal";
import { products } from "./productDummyData";
import { addItemToLocation } from "../Lager/storageDummyData";

export default function ProductActions() {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (data) => {
    const newProduct = {
      id: Date.now(),
      name: data.name,
      sku: data.sku,
      unit: data.unit
    };

    products.push(newProduct);

    addItemToLocation(
      data.locationId,
      data.placeId,
      newProduct.id,
      data.quantity,
      data.minQuantity
    );

    setShowModal(false);
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title">Aktionen</h5>

        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          ➕ Artikel anlegen
        </button>

        {showModal && (
          <CreateProductModal
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
