// src/components/Dashboard/MainDashboard.jsx

import { useState, useEffect } from "react";
import { getAllItems } from "../../api/itemsApi";
import { getSales } from "../../api/salesApi";
import { getInventoryHistory } from "../../api/inventoryApi";
import { getInventoryStatus } from "../../api/inventoryStatusApi";
import { getLocations } from "../../api/storageApi";
import { getAlerts } from "../../api/alertsApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalItems || 0}</div>
              <div className="stat-label">Artikel im System</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockItems || 0}</div>
              <div className="stat-label">Niedriger Bestand</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card stat-card-info">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalLocations || 0}</div>
              <div className="stat-label">Lagerstandorte</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card stat-card-danger">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-value">{stats.criticalAlerts || 0}</div>
              <div className="stat-label">Kritische Meldungen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card shadow-sm mb-5 chart-card">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">📈 Verkaufsübersicht (letzte 30 Tage)</h5>
        </div>
        <div className="card-body">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="verkauf" 
                  stroke="#0d6efd" 
                  strokeWidth={2}
                  dot={{ fill: '#0d6efd', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Verkaufte Menge"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted py-5">
              Keine Verkaufsdaten verfügbar
            </div>
          )}
        </div>
      </div>

      {/* Critical Items */}
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">⏰ Artikel mit kritischem Bestand</h5>
          <small className="text-muted">Weniger als 5 Tage Bestand verbleibend</small>
        </div>
        <div className="card-body">
          {inventoryStatus.filter(s => s?.daysRemaining !== undefined && s.daysRemaining <= 5).length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Artikel</th>
                    <th>SKU</th>
                    <th>Aktueller Bestand</th>
                    <th>Tage verbleibend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryStatus
                    .filter(s => s?.daysRemaining !== undefined && s.daysRemaining <= 5)
                    .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                    .map(status => (
                      <tr key={status.itemId}>
                        <td className="fw-semibold">{status.itemName || 'N/A'}</td>
                        <td><code>{status.sku || 'N/A'}</code></td>
                        <td>{status.currentQuantity || 0} Stück</td>
                        <td>
                          <span className={`badge ${(status.daysRemaining || 0) <= 2 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {status.daysRemaining !== undefined ? status.daysRemaining : 'N/A'} Tage
                          </span>
                        </td>
                        <td>
                          {status.reorderRecommended ? (
                            <span className="badge bg-danger">Nachbestellung nötig</span>
                          ) : (
                            <span className="badge bg-info">Beobachten</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              ✓ Alle Artikel haben ausreichend Bestand
            </div>
          )}
        </div>
      </div>

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
