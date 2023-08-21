import { Subscription, SubscriptionService } from "@services/Subscription";
import { LangContext } from "hooks/lan";
import moment from "moment";
import { useRouter } from "next/router";
import { Chip } from "primereact/chip";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlockViewer from "../../../components/BlockViewer";

const SubscriptionDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const subscriptionService = new SubscriptionService();
  const [subscription, setSubscription] = useState<Subscription>(
    {} as Subscription
  );
  const [loading, setLoading] = useState(false);
  const { id } = router.query;
  const { textFormat } = useContext(LangContext);
  const toast = useRef<Toast>(null);

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let idVal: string = id?.toString() || "";
      let d = await subscriptionService.getSubscriptionDetails(idVal);
      if (d.error == undefined) {
        setSubscription(d.data);
        setLoading(false);
        toast.current?.show({
          severity: "success",
          summary: "Loaded",
          detail: "Data Loaded",
          life: 3000,
        });
      } else {
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: d.error,
          life: 3000,
        });
      }
    })();
  }, []);

  return (
    <>
      <BlockViewer
        header="Subscription details"
        containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8"
      >
        <Toast
          position={`${textFormat === "rtl" ? "top-left" : "top-right"}`}
          ref={toast}
        />
        <div className="surface-section">
          {loading ? (
            <div className="flex justify-content-center flex-wrap">
              <i className="pi pi-spin pi-cog" style={{ fontSize: "5rem" }}></i>
            </div>
          ) : (
            <>
              <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CUSTOMER_ID")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.customerId}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("START_DATE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {moment(new Date(subscription.startDate)).format("LL")}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("END_DATE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {moment(new Date(subscription.endDate)).format("LL")}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("STATUS")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription.status}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("BREAKFAST")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription?.subPlans
                      ? subscription?.subPlans
                          ?.filter((t: any) => t.session === "breakfast")
                          .map((j: any, i: number) => (
                            <Chip key={i} label={j.item.name}></Chip>
                          ))
                      : "N/A"}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("LUNCH")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription?.subPlans
                      ? subscription?.subPlans
                          ?.filter((t: any) => t.session === "lunch")
                          .map((j: any, i: number) => (
                            <Chip key={i} label={j.item.name}></Chip>
                          ))
                      : "N/A"}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("DINNER")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription?.subPlans
                      ? subscription?.subPlans
                          ?.filter((t: any) => t.session === "dinner")
                          .map((j: any, i: number) => (
                            <Chip key={i} label={j.item.name}></Chip>
                          ))
                      : "N/A"}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("KITCHEN")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {subscription?.kitchen}
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </BlockViewer>
    </>
  );
};

SubscriptionDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default SubscriptionDetails;
