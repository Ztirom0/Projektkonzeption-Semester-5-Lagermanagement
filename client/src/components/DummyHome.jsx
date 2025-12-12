import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlarmBell from "./AlarmBell";
import DummyStorages from "./DummyStorages";
import DummyProducts from "./DummyProducts";

export default function DummyHome() {
    const [view, setView] = useState("home");
    const { t } = useTranslation();
    console.log(useTranslation);

  return (
    <div className="container py-4">
      <AlarmBell />

      {view === "home" && (
        <div className="text-center">
          <h1 className="mb-3">{t("home.title")}</h1>
          <p className="text-muted mb-4">{t("home.welcome")}</p>

          <div className="d-flex flex-column gap-3 align-items-center">
            <button
              className="btn btn-primary w-50"
              onClick={() => setView("storages")}
            >
              📦 {t("home.toStorages")}
            </button>

            <button
              className="btn btn-success w-50"
              onClick={() => setView("products")}
            >
              🛒 {t("home.toProducts")}
            </button>
          </div>
        </div>
      )}

      {view === "storages" && <DummyStorages onBack={() => setView("home")} />}
      {view === "products" && <DummyProducts onBack={() => setView("home")} />}
    </div>
  );
}
