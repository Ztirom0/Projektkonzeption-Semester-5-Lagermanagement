export default function Navigation({ onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">
        {/* Branding → Klick führt zur DummyHome (overview) */}
        <button
          className="navbar-brand fw-bold btn btn-link text-white text-decoration-none"
          onClick={() => onNavigate("overview")}
        >
          HOME
        </button>

        {/* Toggle für Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Navigation umschalten"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavigate("products")}
              >
                🛒 Produkte
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavigate("storages")}
              >
                🏭 Lagerverwaltung
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavigate("reports")}
              >
                📑 Berichte
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
