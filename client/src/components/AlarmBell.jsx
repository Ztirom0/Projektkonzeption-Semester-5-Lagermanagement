// src/components/AlarmBell.jsx
// Zeigt eine Glocke mit Badge für kritische Bestandswarnungen

import { useEffect, useState } from "react";
import { getAllItems } from "../api/itemsApi";
import { getInventory, getInventoryHistory } from "../api/inventoryApi";
import { getSales } from "../api/salesApi";
import { calculateAlerts } from "../api/alertsApi";
import { calculateAllInventoryStatuses } from "../api/inventoryCalculations";

export default function AlarmBell({ onOpen }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Items, aktueller Bestand und Verkäufe parallel laden
        const [items, inventoryList, sales] = await Promise.all([
          getAllItems(),
          getInventory(),
          getSales()
        ]);

        // Bestandsverlauf der letzten 180 Tage für jedes Item
        const historyResults = await Promise.all(
          items.map(item =>
            getInventoryHistory(item.id, 180).catch(() => [])
          )
        );
        const combinedHistory = historyResults.flat();

        // Statusdaten berechnen (Bestand, Verbrauch, Resttage, etc.)
        const statuses = calculateAllInventoryStatuses(
          items,
          inventoryList,
          sales,
          combinedHistory
        );

        // Alerts basierend auf Statusdaten berechnen
        const calculatedAlerts = calculateAlerts(statuses);
        setAlerts(calculatedAlerts);

      } catch {
        // Fehler werden bewusst ignoriert, um UI nicht zu blockieren
      }
    };

    load();

    // Regelmäßige Aktualisierung alle 5 Sekunden
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const count = alerts.length;

  return (
    <button
      className="btn position-relative"
      onClick={onOpen}
      style={{ fontSize: "1.6rem" }}
    >
      🔔

      {/* Badge nur anzeigen, wenn Alerts vorhanden */}
      {count > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {count}
        </span>
      )}
    </button>
  );
}
