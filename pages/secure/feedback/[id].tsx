import { Feedback, FeedbackService } from "@services/Feedback";
import { LangContext } from "hooks/lan";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlockViewer from "../../../components/BlockViewer";

const FeedbackDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const feedbackService = new FeedbackService();
  const [feedback, setFeedback] = useState<Feedback>({
    customerId: "",
    chefId: "",
    orderId: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const { textFormat } = useContext(LangContext);

  const { id } = router.query;
  const toast = useRef<Toast>(null);

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let idVal: string = id?.toString() || "";
      let d = await feedbackService.getFeedbackDetails(idVal);
      if (d.error == undefined) {
        setFeedback(d.data);
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
        header={t("FEEDBACK_DETAILS")}
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
                    {feedback.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CUSTOMER_ID")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.customerId}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {" "}
                    {t("CHEF_ID")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.chefId}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {" "}
                    {t("ORDER_ID")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.orderId}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("RATING")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.rating}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("COMMENT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.comment}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("KITCHEN")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {feedback.kitchen}
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

FeedbackDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default FeedbackDetails;
