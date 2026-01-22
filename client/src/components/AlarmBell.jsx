// src/components/AlarmBell.jsx

import { useEffect, useState } from "react";
import { fetchAlerts } from "./Lager/storageDummyData";

export default function AlarmBell({ onOpen }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAlerts();
      setAlerts(data);
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
