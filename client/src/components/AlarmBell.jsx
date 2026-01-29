// src/components/AlarmBell.jsx

import { useEffect, useState } from "react";
import { getAllItems } from "../api/itemsApi";
import { getInventory } from "../api/inventoryApi";
import { getSales } from "../api/salesApi";
import { calculateAlerts } from "../api/alertsApi";
import { calculateAllInventoryStatuses } from "../api/inventoryCalculations";

export default function AlarmBell({ onOpen }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Lade alle notwendigen Daten
        const [items, inventoryList, sales] = await Promise.all([
          getAllItems(),
          getInventory(),
          getSales()
        ]);
        
        // Berechne Status im Frontend
        const statuses = calculateAllInventoryStatuses(items, inventoryList, sales);
        
        // Berechne Alerts im Frontend
        const calculatedAlerts = calculateAlerts(statuses);
        setAlerts(calculatedAlerts);
      } catch (err) {
      }
    };

    load();
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
