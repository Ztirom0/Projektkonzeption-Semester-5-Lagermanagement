// src/components/Dashboard/SalesChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SalesChart({ data, forecastMethod, onForecastMethodChange }) {
  const hasForecast = data?.some(d => d.prognose !== undefined && d.prognose !== null);

  return (
    <div className="card shadow-sm mb-5 chart-card">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h5 className="mb-0">📈 Verkaufsübersicht & Prognose</h5>
          {onForecastMethodChange && (
            <div className="d-flex align-items-center gap-0">
              <small className="text-muted">Prognosemethode:</small>
              <select
                className="form-select form-select-sm"
                value={forecastMethod}
                onChange={(e) => onForecastMethodChange(e.target.value)}
              >
                <option value="moving-average">Gleitender Durchschnitt</option>
                <option value="linear-regression">Lineare Regression</option>
                <option value="exponential-smoothing">Exponentielle Glättung</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="card-body">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
                stroke="#1b4fd8" 
                strokeWidth={3}
                dot={{ fill: '#1b4fd8', r: 4 }}
                activeDot={{ r: 6 }}
                name="Verkaufte Menge"
              />
              {hasForecast && (
                <Line
                  type="monotone"
                  dataKey="prognose"
                  stroke="#e0a800"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ fill: '#ffc107', r: 3 }}
                  name="Prognose (Nachfrage)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted py-5">
            Keine Verkaufsdaten verfügbar
          </div>
        )}
      </div>
    </div>
  );
}
