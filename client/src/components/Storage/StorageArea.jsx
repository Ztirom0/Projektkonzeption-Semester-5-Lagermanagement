import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/StorageArea.scss";
import CreateOffer from "./CreateOffer";
import CompanyOffers from "./CompanyOffers";
import Tooltip from "../../styles/TooltipInfo";  

export default function StorageArea({ company, setCompany, generalStorageInfos, lobbyGameMode }) {
  const { t } = useTranslation();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const storage = company?.storage;
  if (!storage) return <p>{t("storage.noStorage")}</p>;

  const totalContent = storage.products.reduce(
    (sum, batch) => sum + batch.quantity,
    0
  );

  const formatter = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // aktuelles Level-Objekt aus generalStorageInfos holen
  const currentLevel = generalStorageInfos.find(
    (lvl) => lvl.level === storage.lvl
  );

  // nächstes Level suchen
  const nextLevel = generalStorageInfos.find(
    (lvl) => lvl.level === storage.lvl + 1
  );

  const isOverfilled = totalContent > (currentLevel?.size ?? 0);

  // prüfen ob Upgrade möglich
  const canUpgrade = storage.lvl < company.researchLab.maxStorageLevel;
  const enoughMoney = nextLevel ? nextLevel.price <= company.info.budget : false;

  async function upgradeStorage() {
    const response = await fetch(
      `/api/storage/${company.info.id}/upgrade/${storage.id}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) return;
    setShowUpgrade(false);
    const updatedResponse = await response.json();
    setCompany(prev => ({
      ...prev,
      info: { ...prev.info, budget: updatedResponse.newBudget },
      storage: updatedResponse.info
    }));
  }

return (
  <div className="factory-area storage">
    <div className="storage-container">

      {/* Header + Stats */}
      <div className="storage-header mb-4 p-4 rounded text-white" style={{ backgroundColor: "#343a40" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{t("storage.title")}</h4>
          <span className={`badge storage-level ${isOverfilled ? "blink" : ""}`}>
            {t("common.level")} {storage.lvl}
          </span>
        </div>

        {currentLevel && (
          <div className="d-flex justify-content-around gap-3 text-center">
            <div>
              <div className="small opacity-75">{t("storage.capacity")}</div>
              <div className={`fw-bold ${isOverfilled ? "blink text-white rounded px-2" : ""}`}>
                {totalContent} / {currentLevel.size}
                {isOverfilled && (
                  <span
                    className="warning-icon ms-2"
                    onClick={() => setShowWarning(!showWarning)}
                    title={t("storage.overloadedTitle")}
                  >
                    ⚠️
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="small opacity-75">{t("storage.fixCosts")}</div>
              <div className="fw-bold">{currentLevel.fixCosts}</div>
            </div>
            <div>
              <div className="small opacity-75">{t("storage.penaltyCost")}</div>
              <div className="fw-bold">
                {(lobbyGameMode.storageUnitPenalty * (1 + company.researchLab.storagePenaltyRate)).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning Box */}
      {showWarning && (
        <div className="warning-box fade-in text-white mb-4 p-3 rounded">
          {t("storage.overloaded")}
        </div>
      )}

      {/* Upgrade Card */}
      {showUpgrade && nextLevel && (
        <div className="upgrade-card fade-in mx-auto mb-4 p-3 rounded" style={{ maxWidth: "500px" }}>
          <h5 className="text-center mb-3 fs-6">
            {t("storage.upgradeTo")} {nextLevel.level}
          </h5>
          <div className="upgrade-row mb-2">
            <span>{t("storage.size")}</span> {currentLevel.size} → <b>{nextLevel.size}</b>
          </div>{/*
          <div className="upgrade-row mb-2">
            <span>{t("storage.types")}</span> {currentLevel.diffProductCount} → <b>{nextLevel.diffProductCount}</b>
          </div>*/}
          <div className="upgrade-row mb-3">
            <span>{t("storage.fixCosts")}</span> {currentLevel.fixCosts} → <b>{nextLevel.fixCosts}</b>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-success btn-sm px-3" onClick={upgradeStorage}>
              {t("common.confirm")}
            </button>
            <button className="btn btn-danger btn-sm px-3" onClick={() => setShowUpgrade(false)}>
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      {currentLevel && !showUpgrade && (
        <div className="text-center mb-4">
          {nextLevel ? (
            <button
              className={`btn btn-light btn-sm fw-bold w-100 ${isOverfilled ? "blink" : ""}`}
              onClick={() => setShowUpgrade(true)}
              disabled={!canUpgrade || !enoughMoney}
            >
              {t("storage.upgradeFor")} {formatter.format(nextLevel.price)}
            </button>
          ) : (
            <div className="text-success mt-3 fw-bold">{t("storage.maxLevel")}</div>
          )}

          {(!canUpgrade || !enoughMoney) && (
            <div className="text-danger mt-2" style={{ fontSize: "0.85rem" }}>
              {!enoughMoney ? t("common.notEnoughMoney") : t("storage.researchLocked")}
            </div>
          )}
        </div>
      )}

      {/* Box Grid mit animierten Kisten */}
      <div className="storage-grid mb-4" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
        {storage.products.map((batch, i) => (
          <div key={i} className="box big-box position-relative text-center">
            <div className="box-lid"></div>
            <div className="box-body d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold text-truncate">{batch.product.name}</div>
              <div className="opacity-75">{batch.quantity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom: Offers */}
    <div className="mt-4">
      <CreateOffer company={company} setCompany={setCompany} marketingCosts={lobbyGameMode.marketingCosts} />
      <CompanyOffers company={company} marketingCosts={lobbyGameMode.marketingCosts}/>
    </div>
  </div>
);

}
