// src/components/Navigation.jsx

import { useState } from "react";

export default function Navigation({ onNavigate }) {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view) => {
    setActive(view);
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle d-md-none"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <i className="bi bi-list"></i>
      </button>

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "open" : ""
        }`}
      >
        {/* Branding */}
        <div className="sidebar-header">
          <i className="bi bi-boxes sidebar-logo"></i>
          {!collapsed && <span className="sidebar-title">SmartStock</span>}
          <button
            className="collapse-btn d-none d-md-block"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i
              className={`bi ${
                collapsed ? "bi-chevron-right" : "bi-chevron-left"
              }`}
            ></i>
          </button>
        </div>

        {/* Navigation */}
        <ul className="sidebar-nav">
          <li
            className={`sidebar-item ${
              active === "overview" ? "active" : ""
            }`}
            onClick={() => handleNav("overview")}
          >
            <i className="bi bi-house"></i>
            {!collapsed && <span>Übersicht</span>}
          </li>

          <li
            className={`sidebar-item ${
              active === "products" ? "active" : ""
            }`}
            onClick={() => handleNav("products")}
          >
            <i className="bi bi-box-seam"></i>
            {!collapsed && <span>Produkte</span>}
          </li>

          <li
            className={`sidebar-item ${
              active === "lager" ? "active" : ""
            }`}
            onClick={() => handleNav("lager")}
          >
            <i className="bi bi-building"></i>
            {!collapsed && <span>Lager</span>}
          </li>

          <li
            className={`sidebar-item ${
              active === "reports" ? "active" : ""
            }`}
            onClick={() => handleNav("reports")}
          >
            <i className="bi bi-graph-up-arrow"></i>
            {!collapsed && <span>Berichte</span>}
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <i className="bi bi-person-circle me-2"></i>
          {!collapsed && <span>Daniel</span>}
        </div>

        {/* Styles */}
        <style>{`
          .sidebar {
            width: 260px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(18px);
            background: radial-gradient(circle at top left, #f3e9ff 0, #ffffff 45%, #f5f6fa 100%);
            border-right: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 0 30px rgba(15, 23, 42, 0.08);
            transition: all 0.3s ease;
            z-index: 2000;
          }

          .sidebar.collapsed {
            width: 80px;
          }

          .sidebar-toggle {
            position: fixed;
            top: 12px;
            left: 12px;
            z-index: 3000;
            background: #ffffff;
            border: none;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 1.4rem;
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.18);
          }

          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
            }
            .sidebar.open {
              transform: translateX(0);
            }
          }

          .sidebar-header {
            display: flex;
            align-items: center;
            padding: 18px 20px;
            border-bottom: 1px solid rgba(15,23,42,0.06);
            position: relative;
          }

          .collapse-btn {
            margin-left: auto;
            background: transparent;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
          }

          .collapse-btn:hover {
            opacity: 1;
          }

          .sidebar-logo {
            font-size: 2rem;
            margin-right: 10px;
            color: #6f42c1;
          }

          .sidebar-title {
            font-size: 1.35rem;
            font-weight: 700;
            letter-spacing: 0.02em;
          }

          .sidebar-nav {
            list-style: none;
            padding: 0;
            margin-top: 16px;
            flex-grow: 1;
          }

          .sidebar-item {
            display: flex;
            align-items: center;
            padding: 12px 22px;
            font-size: 1rem;
            cursor: pointer;
            color: #1f2933;
            transition: all 0.25s ease;
            border-left: 4px solid transparent;
            position: relative;
            white-space: nowrap;
          }

          .sidebar-item i {
            font-size: 1.3rem;
            margin-right: 10px;
            opacity: 0.85;
          }

          .sidebar.collapsed .sidebar-item i {
            margin-right: 0;
            text-align: center;
            width: 100%;
          }

          .sidebar-item:hover {
            background: rgba(111, 66, 193, 0.06);
            transform: translateX(4px);
          }

          .sidebar-item.active {
            background: rgba(111, 66, 193, 0.12);
            font-weight: 600;
          }

          .sidebar-item.active::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 4px;
            border-radius: 4px;
            background: linear-gradient(180deg, #b388ff, #6f42c1);
            box-shadow: 0 0 14px rgba(111, 66, 193, 0.9);
          }

          .sidebar-footer {
            padding: 16px 22px;
            border-top: 1px solid rgba(15,23,42,0.06);
            font-size: 1rem;
            display: flex;
            align-items: center;
            color: #4b5563;
          }

          .sidebar.collapsed .sidebar-footer span {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
}
