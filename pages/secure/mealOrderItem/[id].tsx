import { MealOrderItem, MealOrderItemService } from "@services/MealOrderItem";
import { LangContext } from "hooks/lan";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlockViewer from "../../../components/BlockViewer";

const MealOrderItemDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const mealorderitemService = new MealOrderItemService();
  const [mealOrderItem, setMealOrderItem] = useState<MealOrderItem>({
    mealOrder: "",
    quantity: 0,
    mealItem: "",
    subTotal: 0,
  });
  const [loading, setLoading] = useState(false);
  const { id } = router.query;
  const toast = useRef<Toast>(null);
  const { textFormat } = useContext(LangContext);

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let idVal: string = id?.toString() || "";
      let d = await mealorderitemService.getMealOrderItemDetails(idVal);
      if (d.error == undefined) {
        setMealOrderItem(d.data);
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
        header={t("MEAL_ORDER_ITEM_DETAILS")}
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
                    {mealOrderItem.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("MEAL_ORDER_NO")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.mealOrder}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("QUANTITY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.quantity}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("MEAL_ITEMS")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.mealItem}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CODE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.code}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("SPECIAL_NOTE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.note}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("SUB_TOTAL")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.subTotal}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("KITCHEN")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealOrderItem.kitchen}
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

MealOrderItemDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default MealOrderItemDetails;
