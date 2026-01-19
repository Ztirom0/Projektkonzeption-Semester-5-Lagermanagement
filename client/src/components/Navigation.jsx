export default function Navigation({ onNavigate }) {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 vh-100 position-fixed"
      style={{ width: "260px", backgroundColor: "#6f42c1" }} // Lila Sidebar
    >
      {/* Branding */}
      <button
        className="fw-bold btn btn-link text-white text-decoration-none py-3 fs-5 border-bottom"
        onClick={() => onNavigate("overview")}
        style={{ textAlign: "left" }}
      >
        HOME
      </button>

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">

        {/* Produkte */}
        <li className="nav-item border-bottom">
          <button
            className="nav-link text-white py-4 fs-2 w-100 text-start"
            onClick={() => onNavigate("products")}
          >
            🛒 Produkte
          </button>
        </li>

        {/* Lager */}
        <li className="nav-item border-bottom">
          <button
            className="nav-link text-white py-4 fs-2 w-100 text-start"
            onClick={() => onNavigate("lager")}   // <-- WICHTIG: exakt "lager"
          >
            🏭 Lager
          </button>
        </li>

        {/* Berichte */}
        <li className="nav-item border-bottom">
          <button
            className="nav-link text-white py-4 fs-2 w-100 text-start"
            onClick={() => onNavigate("reports")}
          >
            📑 Berichte
          </button>
        </li>

      </ul>

      {/* User Bereich unten */}
      <div className="mt-auto text-white border-top py-4 px-5 fs-5">
        <div className="d-flex align-items-center">
          <strong>UserName</strong>
        </div>
      </div>
    </div>
  );
}
