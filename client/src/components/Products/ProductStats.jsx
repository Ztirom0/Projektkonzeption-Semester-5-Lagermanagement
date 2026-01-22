export default function ProductStats({ stats }) {
  const { totalProducts, criticalCount, lowCount, okCount } = stats;

  return (
    <div className="row mb-4">
      <div className="col-md-2 mb-3">
        <div className="card text-bg-primary shadow-sm">
          <div className="card-body text-center">
            <h6>Produkte</h6>
            <h3>{totalProducts}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card text-bg-danger shadow-sm">
          <div className="card-body text-center">
            <h6>Kritisch</h6>
            <h3>{criticalCount}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card text-bg-warning shadow-sm">
          <div className="card-body text-center">
            <h6>Niedrig</h6>
            <h3>{lowCount}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card text-bg-success shadow-sm">
          <div className="card-body text-center">
            <h6>OK</h6>
            <h3>{okCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
