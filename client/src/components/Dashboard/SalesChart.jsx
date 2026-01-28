// src/components/Dashboard/SalesChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="card shadow-sm mb-5 chart-card">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">📈 Verkaufsübersicht (letzte 30 Tage)</h5>
      </div>
      <div className="card-body">
        {data.length > 0 ? (
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
  );
}
