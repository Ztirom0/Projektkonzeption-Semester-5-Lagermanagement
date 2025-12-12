import { useState } from "react";
import { useAlarms } from "../context/AlarmContext";
import i18n from "../i18n";

export default function AlarmBell() {
  const { alarms } = useAlarms();
  const [open, setOpen] = useState(false);

  return (
    <div className="position-relative mb-3">
      <button
        className="btn btn-outline-secondary position-relative"
        onClick={() => setOpen((o) => !o)}
      >
        🔔
        {alarms.length > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {alarms.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="card position-absolute end-0 mt-2 shadow"
          style={{ minWidth: "260px", zIndex: 200 }}
        >
          <div className="card-body p-2">
            <h6 className="mb-2">📋 {i18n.t("alarms.title")}</h6>

            {alarms.length === 0 ? (
              <p className="text-muted">{i18n.t("alarms.none")}</p>
            ) : (
              <ul className="list-group">
                {alarms.map((a) => (
                  <li key={a.id} className="list-group-item">
                    {a.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
