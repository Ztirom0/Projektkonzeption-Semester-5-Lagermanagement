import { createContext, useContext, useState } from "react";

const AlarmContext = createContext();

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = (text, id = Date.now()) => {
    setAlarms((prev) => {
      const exists = prev.find((t) => t.id === id);
      return exists ? prev : [...prev, { id, text }];
    });
  };

  const removeAlarm = (id) => {
    setAlarms((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AlarmContext.Provider value={{ alarms, addAlarm, removeAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarms() {
  return useContext(AlarmContext);
}
