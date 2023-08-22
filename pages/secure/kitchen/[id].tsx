import { Kitchen, KitchenService } from "@services/Kitchen";
import { LangContext } from "hooks/lan";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlockViewer from "../../../components/BlockViewer";

const UsersDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  // const usersService = new UsersService();
  const kitchenService = new KitchenService();
  const [kitchen, setKitchen] = useState<Kitchen>({} as Kitchen);
  //   const [users, setUsers] = useState<Users>({
  //     firstName: "",
  //     email: "",
  //     lastName: "",
  //     kitchen: "",
  //   });
  const [loading, setLoading] = useState(false);
  const { textFormat } = useContext(LangContext);
  const { id } = router.query;
  const toast = useRef<Toast>(null);

  const dataUserTypes = [
    { value: 0, name: "Admin" },
    { value: 1, name: "Kitchen" },
    { value: 2, name: "Chef" },
    { value: 3, name: "Customer" },
  ];

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let idVal: string = id?.toString() || "";
      let d = await kitchenService.getKitchenDetails(idVal);
      if (d.error == undefined) {
        setKitchen(d.data);
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
        header={t("KITCHEN_DETAILS")}
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
                    {t("KITCHEN")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {kitchen.kitchenName}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("KITCHEN_S_CHEF")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {kitchen.chefId}
                  </div>
                </li>

                {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {kitchen.mobile}
                  </div>
                </li> */}

                {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Country</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {kitchen.country}
                  </div>
                </li> */}

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("ADDRESS")}
                  </div>
                  <li>
                    {kitchen.address ? (
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 mt-1">
                        {/* <span className="underline">
                          {kitchen.address.addressPreference}:
                        </span> */}
                        <div className="mt-1">
                          <span className="font-semibold">{t("ZONE")}: </span>
                          {kitchen.address.zone},
                          <span className="font-semibold">
                            {t("BUILDING")}:{" "}
                          </span>
                          {kitchen.address.building},
                          <span className="font-semibold"> {t("UNITE")}: </span>
                          {kitchen.address.unit},
                          <span className="font-semibold">{t("STREET")}:</span>
                          {kitchen.address.streetName}
                        </div>
                        <div>
                          <span className="font-semibold">
                            {" "}
                            {t("LATITUDE")}:
                          </span>
                          {kitchen.address.geoTag &&
                            kitchen.address.geoTag.coordinates[0]}
                          ,
                          <span className="font-semibold">
                            {t("LONGITUDE")}:
                          </span>
                          {kitchen.address.geoTag &&
                            kitchen.address.geoTag.coordinates[1]}
                        </div>
                      </div>
                    ) : (
                      <div>No address available</div>
                    )}{" "}
                  </li>
                </li>
              </ul>
            </>
          )}
        </div>
      </BlockViewer>
    </>
  );
};

UsersDetails.getInitialProps = (ctx: any) => {
  const { id } = ctx.query;

  return {
    id,
  };
};

export default UsersDetails;
