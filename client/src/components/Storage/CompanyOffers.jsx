import "./styles/CompanyOffers.scss";
import { useTasks } from "../../context/TaskContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CompanyOffers({ company, onOverride,marketingCosts }) {
  const offers = company?.offers || [];
  const { addTask, removeTask } = useTasks();
  const { t } = useTranslation();

  useEffect(() => {
    const hasOffer = offers.length > 0;
    const taskId = "no-offers";
    const hasProducts = company?.storage?.products?.length > 0;

    if (!hasOffer && hasProducts) {
      addTask("⚠️ You provide no offer on the market", taskId);
    } else {
      removeTask(taskId);
    }
  }, [company?.offers]);

  return (
    <div className="company-offers card p-3">
      <h5 className="mb-3">{t("companyOffers.title")}</h5>

      {offers.length === 0 ? (
        <p className="text-muted">{t("companyOffers.noOffers")}</p>
      ) : (
        <ul className="list-group offer-list">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{offer.product.name}</strong>

                <span className="text-muted ms-2">
                  {t("companyOffers.unitsForEach", { quantity: offer.quantity, price: offer.price.toFixed(2) })}
                </span>

                {offer.marketing !== undefined && (
                  <div className="text-muted small mt-1">
                    {t("companyOffers.marketingLine", { marketing: offer.marketing, calc: offer.marketing * offer.quantity * marketingCosts })}
                  </div>
                )}
              </div>

              <button
                disabled={true}
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onOverride?.(offer)}
              >
                {t("companyOffers.changeSoon")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
