export default function ProductTable({ products, inventoryByItemId }) {
  const getBadge = (status) => {
    if (status === "critical") return <span className="badge bg-danger">Kritisch</span>;
    if (status === "low") return <span className="badge bg-warning">Niedrig</span>;
    return <span className="badge bg-success">OK</span>;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Einheit</th>
              <th className="text-end">Bestand</th>
              <th className="text-end">Mindestbestand</th>
              <th>Status</th>
              <th className="text-end">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => {
                const inv = inventoryByItemId[p.id] || { quantity: 0, minQuantity: 0, status: "ok" };
                return (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.sku}</td>
                    <td>{p.unit}</td>
                    <td className="text-end">{inv.quantity}</td>
                    <td className="text-end">{inv.minQuantity}</td>
                    <td>{getBadge(inv.status)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary">Bearbeiten</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Keine Produkte gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
