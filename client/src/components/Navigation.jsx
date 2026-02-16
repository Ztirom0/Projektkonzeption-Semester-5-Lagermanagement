// src/components/Navigation.jsx
// Steuert Navigation, aktives Menü und Sidebar‑Zustand 
import { useState } from "react";

export default function Navigation({ onNavigate }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuStructure = [
    {
      id: "dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
      description: "Hauptübersicht & Kennzahlen",
      action: () => {
        onNavigate("dashboard");
        setActiveMenu("dashboard");
      }
    },
    {
      id: "products",
      icon: "bi-box-seam",
      label: "Produktverwaltung",
      description: "Artikel & Bestand verwalten",
      action: () => {
        onNavigate("products");
        setActiveMenu("products");
      }
    },
    {
      id: "lager",
      icon: "bi-building",
      label: "Lagerlogistik",
      description: "Lagerverwaltung & Struktur",
      action: () => {
        onNavigate("lager");
        setActiveMenu("lager");
      }
    },
    {
      id: "reports",
      icon: "bi-graph-up",
      label: "Berichte",
      description: "Datenanalyse & Prognosen",
      action: () => {
        onNavigate("reports");
        setActiveMenu("reports");
      }
    }
  ];

  return (
    <nav className="main-sidebar-nav">
      {/* Sidebar Container */}
      <div className={`sidebar-container ${sidebarOpen ? "open" : "closed"}`}>
        {/* Header mit Toggle */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon"></span>
            {sidebarOpen && <span className="brand-text">SmartStock</span>}
          </div>
          <button 
            className="btn-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Sidebar schließen" : "Öffnen"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu">
          {menuStructure.map((item) => (
            <div key={item.id} className="menu-group">
              <button
                className={`menu-item ${activeMenu === item.id ? "active" : ""} ${item.submenu ? "has-submenu" : ""}`}
                onClick={() => {
                  if (item.submenu) {
                    setExpandedMenu(expandedMenu === item.id ? null : item.id);
                  } else {
                    item.action?.();
                    setActiveMenu(item.id);
                  }
                }}
              >
                <span className="menu-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                {sidebarOpen && (
                  <>
                    <div className="menu-content">
                      <div className="menu-label">{item.label}</div>
                      {item.description && (
                        <div className="menu-desc">{item.description}</div>
                      )}
                    </div>
                    {item.submenu && (
                      <span className={`menu-chevron ${expandedMenu === item.id ? "expanded" : ""}`}>
                        ▼
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {sidebarOpen && item.submenu && expandedMenu === item.id && (
                <div className="submenu-list">
                  {item.submenu.map((subitem, idx) => (
                    <button
                      key={idx}
                      className="submenu-item"
                      onClick={() => {
                        subitem.action?.();
                        setActiveMenu(item.id);
                      }}
                    >
                      <span className="submenu-icon">{subitem.icon || "•"}</span>
                      <span className="submenu-label">{subitem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {sidebarOpen && (
            <>
              <span className="footer-icon">
                <i className="bi bi-info-circle"></i>
              </span>
              <span className="footer-text">Lagerverwaltungssystem v1.0</span>
            </>
          )}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="mobile-nav-header">
        <button className="btn-mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="bi bi-list"></i>
        </button>
        <div className="mobile-title">
          <i className="bi bi-box-seam me-0"></i>
          SmartStock
        </div>
      </div>

      <style>{`

        .sidebar-container {
          display: flex;
          flex-direction: column;
          width: 300px;
          height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          border-right: 1px solid #e9ecef;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .sidebar-container.closed {
          width: 80px;
        }

        /* Header */
        .sidebar-header {
          padding: 20px 16px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-text {
          white-space: nowrap;
        }

        .btn-sidebar-toggle {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .btn-sidebar-toggle:hover {
          background: rgba(255,255,255,0.3);
        }

        /* Menu */
        .sidebar-menu {
          flex: 1;
          padding: 12px 8px;
          overflow-y: auto;
        }

        .menu-group {
          margin-bottom: 6px;
        }

        .menu-item {
          width: 100%;
          padding: 12px 14px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #495057;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .menu-item:hover {
          background-color: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
        }

        .menu-item.active {
          background: linear-gradient(90deg, rgba(13, 110, 253, 0.15), rgba(13, 110, 253, 0.08));
          color: #0d6efd;
          font-weight: 600;
        }

        .menu-icon {
          min-width: 20px;
          text-align: center;
          font-size: 1rem;
        }

        .menu-content {
          flex: 1;
          min-width: 0;
        }

        .menu-label {
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-desc {
          font-size: 0.8rem;
          color: #6c757d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }

        .menu-chevron {
          font-size: 0.7rem;
          transition: transform 0.3s ease;
          color: #adb5bd;
        }

        .menu-chevron.expanded {
          transform: rotate(180deg);
        }

        /* Submenu */
        .submenu-list {
          background: rgba(13, 110, 253, 0.05);
          border-left: 2px solid #0d6efd;
          padding: 6px 0;
          margin: 4px 8px;
          border-radius: 6px;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 400px;
          }
        }

        .submenu-item {
          width: 100%;
          padding: 10px 14px;
          padding-left: 40px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #6c757d;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .submenu-item:hover {
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }

        .submenu-icon {
          font-size: 0.8rem;
        }

        .submenu-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Footer */
        .sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
          font-size: 0.8rem;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .footer-icon {
          font-size: 0.9rem;
        }

        .footer-text {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Mobile */
        .mobile-nav-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1001;
        }

        .btn-mobile-menu {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #495057;
          padding: 0 8px;
        }

        .mobile-title {
          font-weight: bold;
          font-size: 1rem;
          color: #212529;
        }

        /* Responsive */
        @media (max-width: 767px) {
          .sidebar-container {
            position: absolute;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: 999;
            width: 0;
          }

          .sidebar-container.open {
            width: 280px;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
          }

          body {
            padding-top: 56px;
          }
        }

        @media (min-width: 768px) {
          .mobile-nav-header {
            display: none !important;
          }

          body {
            padding-top: 0;
          }
        }
      `}</style>
    </nav>
  );
}
