// src/components/Dashboard/MainDashboard.jsx

import { useState, useEffect } from "react";
import { getAllItems } from "../../api/itemsApi";
import { getSales } from "../../api/salesApi";
import { getInventoryStatus } from "../../api/inventoryStatusApi";
import { getLocations } from "../../api/storageApi";
import { getAlerts } from "../../api/alertsApi";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import CriticalItemsTable from "./CriticalItemsTable";

export default function MainDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalLocations: 0,
    criticalAlerts: 0
  });
  const [chartData, setChartData] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Lade Artikel
        const items = await getAllItems();
        setStats(prev => ({ ...prev, totalItems: items.length }));

        // Lade Standorte
        const locations = await getLocations();
        setStats(prev => ({ ...prev, totalLocations: locations.length }));

        // Lade Warnungen
        const alerts = await getAlerts();
        const critical = alerts.filter(a => a.type === "CRITICAL").length;
        setStats(prev => ({ ...prev, criticalAlerts: critical }));

        // Lade Verkaufsdaten für Haupt-Chart
        const sales = await getSales();
        if (sales.length > 0) {
          // Gruppiere nach Datum
          const grouped = {};
          sales.forEach(s => {
            if (!grouped[s.saleDate]) grouped[s.saleDate] = 0;
            grouped[s.saleDate] += s.quantity;
          });
          
          const chartPoints = Object.entries(grouped)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .slice(-30) // Letzte 30 Tage
            .map(([date, qty]) => ({
              date: new Date(date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }),
              verkauf: qty
            }));
          setChartData(chartPoints);
        }

        // Lade Bestandsstatus für alle Items
        const statuses = await Promise.all(
          items.map(item => getInventoryStatus(item.id).catch(err => {
            console.error(`Failed to load status for item ${item.id}:`, err);
            return null;
          }))
        );
        const validStatuses = statuses.filter(Boolean);
        console.log('Loaded inventory statuses:', validStatuses);
        setInventoryStatus(validStatuses);

        // Zähle Items mit niedrigem Bestand
        const lowStock = validStatuses.filter(s => {
          const days = s?.daysRemaining;
          return days !== undefined && days !== null && days <= 5 && days >= 0;
        }).length;
        console.log('Low stock items count:', lowStock);
        setStats(prev => ({ ...prev, lowStockItems: lowStock }));

      } catch (err) {
        console.error("Fehler beim Laden des Dashboards:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-dashboard">
      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <StatCard icon="📦" value={stats.totalItems} label="Artikel im System" variant="primary" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="⚠️" value={stats.lowStockItems} label="Niedriger Bestand" variant="warning" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="📍" value={stats.totalLocations} label="Lagerstandorte" variant="info" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard icon="🚨" value={stats.criticalAlerts} label="Kritische Meldungen" variant="danger" />
        </div>
      </div>

      {/* Main Chart */}
      <SalesChart data={chartData} />

      {/* Critical Items */}
      <CriticalItemsTable items={inventoryStatus} />

      <style>{`
        .main-dashboard {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #ccc;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
        }

        .stat-card-primary { border-left-color: #0d6efd; }
        .stat-card-warning { border-left-color: #ffc107; }
        .stat-card-info { border-left-color: #0dcaf0; }
        .stat-card-danger { border-left-color: #dc3545; }

        .stat-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #212529;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .chart-card {
          border: none;
          overflow: hidden;
        }

        .chart-card .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chart-card .card-header h5 {
          color: white;
        }
      `}</style>
    </div>
  );
}
