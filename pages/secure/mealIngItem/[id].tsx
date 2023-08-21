import { MealIngItem, MealIngItemService } from "@services/MealIngItem";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import BlockViewer from "../../../components/BlockViewer";
import { LangContext } from "hooks/lan";
import { useTranslation } from "react-i18next";

const MealIngItemDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const mealingitemService = new MealIngItemService();
  const [mealIngItem, setMealIngItem] = useState<MealIngItem>({
    quantity: 0,
    ingredients: "",
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
      let d = await mealingitemService.getMealIngItemDetails(idVal);
      if (d.error == undefined) {
        setMealIngItem(d.data);
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
        header={t("MEAL_INGREDIENT_DETAILS")}
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
                    {mealIngItem.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("QUANTITY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.quantity}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("INGREDIENTS")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.ingredients}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {" "}
                    {t("KITCHEN")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealIngItem.kitchen}
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

MealIngItemDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default MealIngItemDetails;
