import { useEffect } from "react";
import i18n from "../i18n";
import { useAlarms } from "../context/AlarmContext";
import AlarmBell from "./AlarmBell";

export default function DummyStorages({ onBack }) {
  const { addAlarm, removeAlarm } = useAlarms();

  useEffect(() => {
    const alarmId = "overflow";

    if (overflow) {
      addAlarm(i18n.t("alarms.overflow"), alarmId);
    } else {
      removeAlarm(alarmId);
    }
  }, []);

  return (
    <div className="container py-4">
      <AlarmBell />

      <h1 className="mb-3">{i18n.t("storages.title")}</h1>
      <p className="text-muted">{i18n.t("storages.description")}</p>

      <ul className="list-group mb-4">
        {company.storage.products.map((p) => (
          <li key={p.id} className="list-group-item">
            {p.name}
          </li>
        ))}
      </ul>

      <button className="btn btn-secondary" onClick={onBack}>
        ⬅️ {i18n.t("common.back")}
      </button>
    </div>
  );
}
