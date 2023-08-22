import config from "@config/index";
import { MealGroup, MealGroupKey, MealGroupService } from "@services/MealGroup";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import BlockViewer from "../../../components/BlockViewer";

import CustomFileUpload from "@layout/fileUpload";
import { UploadInfo } from "@services/UploadInfo";
import { LangContext } from "hooks/lan";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

const MealGroupDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const mealgroupService = new MealGroupService();
  const [mealGroup, setMealGroup] = useState<MealGroup>({ name: "" });
  const [loading, setLoading] = useState(false);
  const { textFormat } = useContext(LangContext);
  const { id } = router.query;
  const toast = useRef<Toast>(null);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [currentImage, setCurrentImage] = useState("");

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  const downloadFile = (data: MealGroup, dbColName: MealGroupKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: MealGroupKey
  ) => {
    let _mealGroup = { ...mealGroup, [colName]: newUploadedFileName };
    setMealGroup(_mealGroup);
  };
  const showUploadDialog = (
    mealGroup: MealGroup,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setMealGroup({ ...mealGroup });
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
    let imageURL = config.serverURI + "/" + mealGroup.image;
    let fileURL = "/file_icon.png";
    let fileNoURL = "/file_icon_na.png";
    let contetnt;

    let acceptFile = "images/*";
    if (mealGroup.image != undefined && mealGroup.image != "") {
      contetnt = (
        <Image
          onError={(e: any) => defaultImage(e)}
          onMouseOver={(e: any) => setCurrentImage(mealGroup.id ?? "")}
          src={imageURL}
          alt="image"
          preview
          downloadable
          width="250"
        />
      );
    } else if (mealGroup.image == undefined || mealGroup.image == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(mealGroup.id ?? "")}
          src="/photo_na.png"
          alt="image"
          width="250"
        />
      );
    }
    return (
      <>
        <div className="card flex justify-content-center">{contetnt}</div>

        {currentImage == mealGroup.id && (
          <Button
            icon="pi pi-upload"
            severity="secondary"
            onClick={(e) => showUploadDialog(mealGroup, "image", acceptFile)}
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
      let d = await mealgroupService.getMealGroupDetails(idVal);
      if (d.error == undefined) {
        setMealGroup(d.data);
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
        header={t("MEAL_GROUP_DETAILS")}
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
                    {mealGroup.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealGroup.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATE_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealGroup.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealGroup.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {mealGroup.name}
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
              updateFileName(e, uploadInfo?.dbColName as keyof MealGroup)
            }
            url={uploadInfo?.url}
            table="mealGroup"
            tableId={mealGroup.id}
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

MealGroupDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default MealGroupDetails;
