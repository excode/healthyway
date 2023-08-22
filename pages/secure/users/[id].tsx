import { Users, UsersService } from "@services/Users";
import { LangContext } from "hooks/lan";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlockViewer from "../../../components/BlockViewer";

const UsersDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { textFormat } = useContext(LangContext);
  const usersService = new UsersService();
  const [users, setUsers] = useState<Users>({} as Users);
  //   const [users, setUsers] = useState<Users>({
  //     firstName: "",
  //     email: "",
  //     lastName: "",
  //     kitchen: "",
  //   });
  const [loading, setLoading] = useState(false);
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
      let d = await usersService.getUsersDetails(idVal);
      if (d.error == undefined) {
        setUsers(d.data);
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
        header={t("USERS_DETAILS")}
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
                    {t("FIRST_NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.firstName}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("LAST_NAME")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.lastName}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("EMAIL")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.email}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("MOBILE")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.mobile}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("COUNTRY")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.country}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("ADDRESS")}
                  </div>
                  <li>
                    {users.address?.length > 0 ? (
                      users.address?.map((a) => (
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 mt-1">
                          <span className="underline">
                            {a.addressPreference}:
                          </span>
                          <div className="mt-1">
                            <span className="font-semibold">{t("ZONE")}: </span>
                            {a.zone},
                            <span className="font-semibold">
                              {" "}
                              {t("BUILDING")}:{" "}
                            </span>
                            {a.building},
                            <span className="font-semibold">
                              {" "}
                              {t("UNITE")}:{" "}
                            </span>
                            {a.unit},
                            <span className="font-semibold">
                              {" "}
                              {t("STREET")}:{" "}
                            </span>
                            {a.streetName}
                          </div>
                          <div>
                            <span className="font-semibold">
                              {t("LATITUDE")}:
                            </span>
                            {a.geoTag && a.geoTag.coordinates[0]},
                            <span className="font-semibold">
                              {t("LONGITUDE")}:
                            </span>
                            {a.geoTag && a.geoTag.coordinates[1]}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No address available</div>
                    )}{" "}
                  </li>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    {t("USER_TYPES")}
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    <p>
                      {users.userType >= 0 ? (
                        dataUserTypes[users.userType].name
                      ) : (
                        <span>{t("USER_TYPE_NOT_SET_YET")}</span>
                      )}
                    </p>
                  </div>
                </li>

                {users.kitchen !== 3 || (
                  <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                      {t("KITCHEN")}
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                      {users.kitchen}
                    </div>
                  </li>
                )}
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
