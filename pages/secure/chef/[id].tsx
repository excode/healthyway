import config from "@config/index";
import { Chef, ChefKey, ChefService } from "@services/Chef";
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

const ChefDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const chefService = new ChefService();
  const [chef, setChef] = useState<Chef>({
    name: "",
    email: "",
    expertise: "",
  });
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

  const downloadFile = (data: Chef, dbColName: ChefKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (newUploadedFileName: string, colName: ChefKey) => {
    let _chef = { ...chef, [colName]: newUploadedFileName };
    setChef(_chef);
  };
  const showUploadDialog = (
    chef: Chef,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setChef({ ...chef });
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

  const photoBodyTemplate = () => {
    let imageURL = config.serverURI + "/" + chef.photo;
    let fileURL = "/file_icon.png";
    let fileNoURL = "/file_icon_na.png";
    let contetnt;

    let acceptFile = "images/*";
    if (chef.photo != undefined && chef.photo != "") {
      contetnt = (
        <Image
          onError={(e: any) => defaultImage(e)}
          onMouseOver={(e: any) => setCurrentImage(chef.id ?? "")}
          src={imageURL}
          alt="photo"
          preview
          downloadable
          width="250"
        />
      );
    } else if (chef.photo == undefined || chef.photo == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(chef.id ?? "")}
          src="/photo_na.png"
          alt="photo"
          width="250"
        />
      );
    }
    return (
      <>
        <div className="card flex justify-content-center">{contetnt}</div>

        {currentImage == chef.id && (
          <Button
            icon="pi pi-upload"
            severity="secondary"
            onClick={(e) => showUploadDialog(chef, "photo", acceptFile)}
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
      let d = await chefService.getChefDetails(idVal);
      if (d.error == undefined) {
        setChef(d.data);
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
        header={t("CHEF_DETAILS")}
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
              {photoBodyTemplate()}
              <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.createBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("CREATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.createAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_BY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.updateBy}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("UPDATED_AT")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.updateAt}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.name}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("EMAIL")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.email}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("EXPERTISE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.expertise &&
                      chef.expertise.map((t: any, k: any) => (
                        <Chip key={k} label={t}></Chip>
                      ))}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("ADDRESS")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.address}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("PHONE_NUMBER")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.phoneNumber}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">{t("KITCHEN")}</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {chef.kitchen}
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
              updateFileName(e, uploadInfo?.dbColName as keyof Chef)
            }
            url={uploadInfo?.url}
            table="chef"
            tableId={chef.id}
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

ChefDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default ChefDetails;
