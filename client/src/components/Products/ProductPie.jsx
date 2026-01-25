// ProductPie.jsx
export default function ProductPie() {
  const categories = [
    { name: "A-Artikel", value: 60, color: "bg-success" },
    { name: "B-Artikel", value: 25, color: "bg-info" },
    { name: "C-Artikel", value: 15, color: "bg-warning" }
  ];

  const total = categories.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Artikel nach Kategorie</h5>
        {categories.map((c, i) => (
          <div key={i} className="mb-2">
            <small>{c.name} ({c.value}%)</small>
            <div className="progress" style={{ height: "20px" }}>
              <div
                className={`progress-bar ${c.color}`}
                role="progressbar"
                style={{ width: `${(c.value / total) * 100}%` }}
              >
                {Math.round((c.value / total) * 100)}%
              </div>
            </div>
          </div>
        ))}
        <p className="mt-3 text-muted">Gesamt: {total}%</p>
      </div>
    </div>
  );
}
