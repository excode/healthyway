import { Users, UsersService } from "@services/Users";
import { LangContext } from "hooks/lan";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import BlockViewer from "../../../components/BlockViewer";

const UsersDetails = () => {
  const router = useRouter();
  const usersService = new UsersService();
  const [users, setUsers] = useState<Users>({} as Users);
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
        header="Kitchen details"
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
                    First Name
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.firstName}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">
                    Last Name
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.lastName}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.email}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.mobile}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Country</div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {users.country}
                  </div>
                </li>

                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                  <div className="text-500 w-6 md:w-2 font-medium">Address</div>
                  <li>
                    {users.address?.length > 0 ||
                    Array.isArray(users.address) ? (
                      users.address.map((a) => (
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 mt-1">
                          <span className="underline">
                            {a.addressPreference}:
                          </span>
                          <div className="mt-1">
                            <span className="font-semibold">Zone: </span>
                            {a.zone},
                            <span className="font-semibold"> Building: </span>
                            {a.building},
                            <span className="font-semibold"> Unite: </span>
                            {a.unit},
                            <span className="font-semibold"> Street: </span>
                            {a.streetName}
                          </div>
                          <div>
                            <span className="font-semibold">Latitude: </span>
                            {a.geoTag.coordinates[0]},
                            <span className="font-semibold"> Longitude: </span>
                            {a.geoTag.coordinates[1]}
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
                    User Types
                  </div>
                  <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    <p>
                      {users.userType >= 0 ? (
                        dataUserTypes[users.userType].name
                      ) : (
                        <span>User type not set yet!</span>
                      )}
                    </p>
                  </div>
                </li>

                {users.kitchen !== 3 || (
                  <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                      Kitchen
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
