// src/components/Dashboard/SalesChart.jsx
// -----------------------------------------------------------------------------
// Diese Komponente rendert das Verkaufs- und Prognose-Diagramm im Dashboard.
// Sie nutzt Recharts, um historische Verkaufsdaten und zukünftige Prognosen
// gemeinsam darzustellen. Zusätzlich kann der Nutzer die Prognosemethode ändern.
// -----------------------------------------------------------------------------

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine
} from "recharts";

export default function SalesChart({ data, forecastMethod, onForecastMethodChange }) {

  // Prüft, ob Prognosedaten existieren (mindestens ein Eintrag mit "prognose")
  const hasForecast = data?.some(d => d.prognose !== undefined && d.prognose !== null);

  // Index des ersten Prognosepunkts
  const forecastStartIndex = hasForecast
    ? data.findIndex(d => d.prognose !== undefined && d.prognose !== null)
    : -1;

  // Label (Datum) des ersten Prognosepunkts
  const forecastStartLabel =
    forecastStartIndex >= 0 ? data[forecastStartIndex]?.date : null;

  // Hintergrundbereich beginnt meist einen Tag nach dem ersten Prognosepunkt
  const forecastBackgroundStartLabel =
    forecastStartIndex >= 0 && data[forecastStartIndex + 1]
      ? data[forecastStartIndex + 1]?.date
      : forecastStartLabel;

  // Letztes Datum der Datenreihe (Ende des Prognosebereichs)
  const forecastEndLabel =
    data && data.length > 0 ? data[data.length - 1]?.date : null;

  // Debug-Ausgabe für den Start des Prognosebereichs
  if (hasForecast) {
    console.log("[SalesChart] Prognose-Bereich Start:", forecastBackgroundStartLabel);
  }

  return (
    <div className="card shadow-sm mb-5 chart-card">

      {/* Kopfbereich der Karte */}
      <div className="card-header bg-white border-bottom">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h5 className="mb-0">Verkaufsübersicht & Prognose</h5>

          {/* Auswahl der Prognosemethode */}
          {onForecastMethodChange && (
            <div className="d-flex align-items-center gap-0">
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

      {/* Diagrammbereich */}
      <div className="card-body">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>

              {/* Hintergrundgitter */}
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

              {/* Achsen */}
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />

              {/* Tooltip mit angepasstem Styling */}
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />

              {/* Legende */}
              <Legend />

              {/* Markierung des Prognosebereichs */}
              {hasForecast && forecastBackgroundStartLabel && forecastEndLabel && (
                <>
                  {/* Gelber Hintergrundbereich für Prognose */}
                  <ReferenceArea
                    x1={forecastBackgroundStartLabel}
                    x2={forecastEndLabel}
                    fill="rgba(255, 193, 7, 0.15)"
                  />

                  {/* Vertikale Linie am Start der Prognose */}
                  <ReferenceLine
                    x={forecastBackgroundStartLabel}
                    stroke="#ffc107"
                    strokeDasharray="5 5"
                  />
                </>
              )}

              {/* Linie: Historische Verkäufe */}
              <Line
                type="monotone"
                dataKey="verkauf"
                stroke="#1b4fd8"
                strokeWidth={3}
                dot={{ fill: '#1b4fd8', r: 4 }}
                activeDot={{ r: 6 }}
                name="Verkaufte Menge"
              />

              {/* Linie: Prognosewerte */}
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
          // Fallback, wenn keine Daten vorhanden sind
          <div className="text-center text-muted py-5">
            Keine Verkaufsdaten verfügbar
          </div>
        )}
      </div>
    </div>
  );
}
