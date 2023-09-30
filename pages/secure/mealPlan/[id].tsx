import config from "@config/configs";
import { MealPlan, MealPlanKey, MealPlanService } from "@services/MealPlan";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import BlockViewer from "../../../components/BlockViewer";

import CustomFileUpload from "@layout/fileUpload";
import { UploadInfo } from "@services/UploadInfo";
import { LangContext } from "hooks/lan";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

const MealPlanDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const mealplanService = new MealPlanService();
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    meals: "",
    quantity: 0,
    name: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const { id } = router.query;
  const toast = useRef<Toast>(null);
  const { textFormat } = useContext(LangContext);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [currentImage, setCurrentImage] = useState("");

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  const downloadFile = (data: MealPlan, dbColName: MealPlanKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: MealPlanKey
  ) => {
    let _mealPlan = { ...mealPlan, [colName]: newUploadedFileName };
    setMealPlan(_mealPlan);
  };
  const showUploadDialog = (
    mealPlan: MealPlan,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setMealPlan({ ...mealPlan });
    setUploadDialog(true);
    let data = {
      url: config.serverURI ?? "",
      dbColName: dbColName ?? "",
      accept: accept,
    };
    setUploadInfo(data);
  };
  const hideUploadDialog = () => {
    setUploadDialog(false);
  };

  const imageBodyTemplate = () => {
    let imageURL = config.serverURI + "/" + mealPlan.image;
    let fileURL = "/file_icon.png";
    let fileNoURL = "/file_icon_na.png";
    let contetnt;

    let acceptFile = "images/*";
    if (mealPlan.image != undefined && mealPlan.image != "") {
      contetnt = (
        <Image
          onError={(e: any) => defaultImage(e)}
          onMouseOver={(e: any) => setCurrentImage(mealPlan.id ?? "")}
          src={imageURL}
          alt="image"
          preview
          downloadable
          width="250"
        />
      );
    } else if (mealPlan.image == undefined || mealPlan.image == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(mealPlan.id ?? "")}
          src="/photo_na.png"
          alt="image"
          width="250"
        />
      );
    }
    return (
      <>
        <div className="card flex justify-content-center">{contetnt}</div>

        {currentImage == mealPlan.id && (
          <Button
            icon="pi pi-upload"
            severity="secondary"
            onClick={(e) => showUploadDialog(mealPlan, "image", acceptFile)}
            aria-label="Bookmark"
            style={{
              position: "relative",
              top: "-105px",
              right: "-35px",
            }}
          />
        )}
      </>
    );
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let idVal: string = id?.toString() || "";
      let d = await mealplanService.getMealPlanDetails(idVal);
      if (d.error == undefined) {
        setMealPlan(d.data);
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
        header={t("MEAL_PLAN_DETAILS")}
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
              {imageBodyTemplate()}
              <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("ITEM_NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.meals &&
                      mealPlan.meals.map((t: any, k: any) => (
                        <Chip key={k} label={t}></Chip>
                      ))}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("QUANTITY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.quantity}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.name}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("PRICE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.price}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("DESCRIPTION")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.description}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CODE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealPlan.code}
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </BlockViewer>

      <Dialog
        visible={uploadDialog}
        style={{ width: "450px" }}
        header={`Upload ${uploadInfo?.dbColName}`}
        modal
        onHide={hideUploadDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <CustomFileUpload
            onUpload={(e) =>
              updateFileName(e, uploadInfo?.dbColName as keyof MealPlan)
            }
            url={uploadInfo?.url}
            table="mealPlan"
            tableId={mealPlan.id}
            maxFileSize={1000000}
            accept={uploadInfo?.accept}
            fieldName="uploadFile"
            dbColName={uploadInfo?.dbColName}
          />
        </div>
      </Dialog>
    </>
  );
};

MealPlanDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default MealPlanDetails;
