// Möglicherweise erst bei der Lagerübersicht
export default function ProductChart() {
  const data = [
    { label: "Standort A (Hochregal)", value: 700 },
    { label: "Standort B (Kühlhaus)", value: 250 },
    { label: "Standort C (Blocklager)", value: 120 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Bestandsmenge pro Standort</h5>
        {data.map((d, i) => (
          <div key={i} className="mb-2">
            <small>{d.label}</small>
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(d.value / maxValue) * 100}%` }}
              >
                {d.value} Stück
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
