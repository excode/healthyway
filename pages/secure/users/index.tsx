import { GetLoginResponse } from "@lib/httpRequest";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { Kitchen, KitchenService } from "@services/Kitchen";
import { UserData } from "@services/Login";
import {
  AddressKey,
  AddressType,
  Users,
  UsersKey,
  UsersQuery,
  UsersService,
} from "@services/Users";
// import { LangContext } from "hooks/lan";
import { LangContext } from "hooks/lan";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableFilterEvent,
  DataTableFilterMeta,
} from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import countryData from "../../utilities/countryData.json";
const UsersPage = () => {
  const { asPath } = useRouter();
  const [userData, setUserData] = useState<UserData>({ email: "" });
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const validation = [
    { id: "firstName", type: validate.text, max: 50, min: 2, required: true },
    {
      id: "password",
      type: validate.password,
      max: 20,
      min: 6,
      required: true,
    },
    { id: "email", type: validate.email, max: 150, min: 0, required: true },
    { id: "mobile", type: validate.text, max: 20, min: 8, required: false },
    { id: "country", type: validate.text, required: false },
    { id: "userType", type: validate.int, required: false },
    { id: "lastName", type: validate.text, max: 20, min: 2, required: true },
    { id: "kitchen", type: validate.text, required: true },
  ];
  // let emptyUsers: Users = {
  //   firstName: "",
  //   email: "",
  //   lastName: "",
  // };

  const [userss, setUserss] = useState<Users[]>([]);
  const [backupUserss, setBackupUserss] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersDialog, setUsersDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [deleteUserssDialog, setDeleteUserssDialog] = useState(false);
  const [users, setUsers] = useState<Users>({} as Users);
  // const [users, setUsers] = useState<Users>(emptyUsers);
  const [selectedUserss, setSelectedUserss] = useState<Users[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Users[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const usersService = new UsersService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());
  // const coordinates = [Number, Number];
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [longitude, setLongitude] = useState<any>(0);
  const [latitude, setLatitude] = useState<any>(0);
  const [userAddress, setUserAddress] = useState<AddressType>(
    {} as AddressType
  );
  const kitchenService = new KitchenService();
  const [datakitchens, setDataKitchens] = useState<Kitchen[]>([]);
  const { textFormat } = useContext(LangContext);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await usersService.getUsers({ limit: row });
      if (d.error == undefined) {
        setUserss(d.docs);
        setBackupUserss(d.docs);
        setLoading(false);
        setTotalRecords(d.count);
        let dataKitchens_ = await kitchenService.getKitchenAll({});
        setDataKitchens(dataKitchens_.data);

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
    initFilters1();
  }, [refreshFlag]);
  useEffect(() => {
    const data: GetLoginResponse = cookies.user;
    let token: string = data.accessToken || "";
    const decoded: UserData = jwt_decode<JwtPayload>(token) as UserData;
    setUserData(decoded);
  }, []);
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      mobile: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      country: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      userType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      lastName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
  };

  const datacountrys = countryData;

  const dataUserTypes = [
    { value: 0, name: "Admin" },
    { value: 1, name: "Kitchen" },
    { value: 2, name: "Chef" },
    { value: 3, name: "Customer" },
  ];

  const countryFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">Country Picker</div>
        <Dropdown
          value={options.value}
          options={datacountrys}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const userTypeFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">UserType Picker</div>
        <Dropdown
          value={options.value}
          options={dataUserTypes.filter(
            (e) => e.value > userData!.permissionLevel!
          )}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const emailOTPExpiresFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const mobileOTPExpiresFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const kitchenFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">Kitchen Picker</div>
        <Dropdown
          value={options.value}
          options={datakitchens}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="kitchenName"
          optionValue="id"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setUsers({} as Users);
    // setUsers(emptyUsers);
    setSubmitted(false);
    setUsersDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUsersDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const hideDeleteUserssDialog = () => {
    setDeleteUserssDialog(false);
  };

  const saveUsers = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(users, validation);
    if (validationErrors.length == 0) {
      let _userss: Users[] = [...userss];
      // const address = { ...userAddress };
      let _users: Users = { ...users, address: [userAddress] };

      if (users.id) {
        let d = await usersService.updateUsers(_users);
        if (d.error == undefined) {
          const index = _userss.findIndex((c) => c.id === users.id);
          if (index !== -1) {
            _userss[index] = { ..._users };
            // _userss[index] = _users;
            //_userss.splice(index, 1, {..._users,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Users Updated",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: d.error,
            life: 3000,
          });
        }
      } else {
        console.log({ _users });
        let d = await usersService.addUsers(_users);
        if (d.error == undefined) {
          var newID = d.id;
          // _userss.unshift({..._users,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Users Updated",
            life: 3000,
          });
          // TRIGGER REFRESH
          setRefreshFlag(Date.now());
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: d.error,
            life: 3000,
          });
        }
      }

      setUserss(_userss);
      setBackupUserss(_userss);
      setUsersDialog(false);
      setUsers({} as Users);
      setUserAddress({} as AddressType);
      setLongitude(0);
      setLatitude(0);
      // setUsers(emptyUsers);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editUsers = (users: Users) => {
    setUsers({ ...users });
    setUsersDialog(true);
  };

  const confirmDeleteUsers = (users: Users) => {
    setUsers(users);
    setDeleteUsersDialog(true);
  };

  const deleteUsers = async () => {
    let d = await usersService.deleteUsers(users.id ?? "");
    if (d.error == undefined) {
      let _userss = userss.filter((val) => val.id !== users.id);
      setUserss(_userss);
      setBackupUserss(_userss);
      setDeleteUsersDialog(false);
      setUsers({} as Users);
      // setUsers(emptyUsers);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Users Deleted",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: d.error,
        life: 3000,
      });
    }

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUserssDialog(true);
  };

  const deleteSelectedUserss = () => {
    let _userss = userss.filter((val) => !selectedUserss.includes(val));
    setUserss(_userss);
    setDeleteUserssDialog(false);
    setSelectedUserss([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Userss Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: UsersKey) => {
    let val = (e.target && e.target.value) || "";
    let _users: Users = { ...users };
    _users[name] = val;
    setUsers(_users);
  };
  const onInputBooleanChange = (e: any, name: UsersKey) => {
    let val = e.target.value;
    let _users: Users = { ...users };
    _users[name] = val;

    setUsers(_users);
  };
  const onInputChange = (e: any, name: UsersKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = users[name];

        if (ctrlType == "radio") {
          aVal = val.value;
        } else if (ctrlType == "checkbox") {
          if (e.checked) {
            aVal.push(val.value);
          } else {
            aVal = aVal.filter((d: any) => d !== e.target.value.value);
          }
        }
        val = aVal;
      } else {
        val = val[name] ? val[name] : val;
      }
    }

    let _users: Users = { ...users };
    _users[name] = val;

    setUsers(_users);
  };

  const onAddressChange = (e: any, name: AddressKey) => {
    let value = (e.target && e.target.value) || undefined;
    const temp = { ...userAddress };
    temp[name] = value;

    // Assuming 'temp' is defined and has a 'geoTag' property
    if (temp.geoTag) {
      // Make sure 'geoTag' is not undefined
      if (!temp.geoTag.coordinates) {
        // If 'coordinates' is not defined, initialize it as an empty array or with appropriate default values
        temp.geoTag.coordinates = [0, 0];
      } else {
        // If 'coordinates' is already defined, update its values
        temp.geoTag.coordinates[0] = longitude;
        temp.geoTag.coordinates[1] = latitude;
      }
    } else {
      // If 'geoTag' is undefined, create it with the coordinates
      temp.geoTag = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    setUserAddress(temp);
    console.log(userAddress);
  };

  const onInputNumberChange = (e: any, name: UsersKey) => {
    let val = e.value || 0;
    let _users = { ...users };
    _users[name] = val;

    setUsers(_users);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: UsersQuery = {};
    for (const key in e.filters) {
      if (e.filters[key].constraints) {
        if (e.filters[key].constraints[0].value) {
          searchObj = {
            ...searchObj,
            [key]: e.filters[key].constraints[0].value,
            [key + "_mode"]: e.filters[key].constraints[0].matchMode,
          };
        }
      }
    }
    if (type == 0) {
      // FILTER Data and start with page 0
      searchObj = { ...searchObj, page: 0, limit: row };
    } else if (type == 1) {
      // Change page number
      searchObj = { ...searchObj, page: e.page, limit: row };
    } else if (type == 2) {
      // Change page number
      let sort: SortType = {};
      if (sortOrders) {
        let currentSortOrder = sortOrders[e.sortField] == 1 ? -1 : 1;
        sort = { ...sortOrders, [e.sortField]: currentSortOrder };
      } else {
        sort = { [e.sortField]: 1 };
      }

      setSortOrders(sort);

      searchObj = {
        ...searchObj,
        page: e.page,
        limit: row,
        sortBy: e.sortField,
        sortDirection: sortOrders[e.sortField],
      };
    }
    if (e.rows !== row) {
      setRow(e.rows);
      searchObj = { ...searchObj, page: 0, limit: e.rows };
    }

    let d = await usersService.getUsers(searchObj);
    if (d.error == undefined) {
      setUserss(d.docs);
      setBackupUserss(d.docs);
      setLoading(false);
      setTotalRecords(d.count);
      toast.current?.show({
        severity: "success",
        summary: "Loaded",
        detail: "Data retrived",
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
  };
  const filterAction = async (e: DataTableFilterEvent) => {
    await getNewData(e, 0);
  };
  const changePage = async (e: DataTableFilterEvent) => {
    await getNewData(e, 1);
  };
  const sortData = async (e: DataTableFilterEvent) => {
    await getNewData(e, 2);
  };

  const localFilter = (val: string) => {
    if (val.length > 1) {
      let _userss = [...userss];
      let filtered = _userss.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setUserss(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setUserss(backupUserss);
    }
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedUserss || !selectedUserss.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: Users) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success "
          onClick={() => editUsers(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mx-2"
          onClick={() => confirmDeleteUsers(rowData)}
        />

        <Link
          href={{
            pathname: asPath + "/" + rowData.id,
          }}
        >
          <Button
            icon="pi pi-book"
            className="p-button-rounded p-button-success"
          />
        </Link>
      </>
    );
  };

  const userTypeBodyTamplate = (rowData: Users) => {
    return rowData.userType > -1
      ? dataUserTypes[rowData.userType]?.name
      : "N/A";
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Userss</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: any) => localFilter(e.target.value)}
          placeholder="Local Search..."
        />
      </span>
    </div>
  );

  const usersDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUsers}
      />
    </>
  );
  const deleteUsersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteUsers}
      />
    </>
  );
  const deleteUserssDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUserssDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedUserss}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast
            position={`${textFormat === "rtl" ? "top-left" : "top-right"}`}
            ref={toast}
          />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={userss}
            selection={selectedUserss}
            onSelectionChange={(e) => setSelectedUserss(e.value as Users[])}
            dataKey="id"
            loading={loading}
            filters={filters1}
            showGridlines
            filterDisplay="menu"
            onFilter={filterAction}
            paginator
            totalRecords={totalRecords}
            rows={row}
            lazy={true}
            onSort={sortData}
            onPage={changePage}
            rowsPerPageOptions={[1, 5, 10, 25, 50]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Userss"
            emptyMessage="No Userss found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="firstName"
              header="First Name"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by firstName"
            ></Column>

            <Column
              showAddButton={false}
              field="lastName"
              header="Last Name"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by lastName"
            ></Column>

            <Column
              showAddButton={false}
              field="email"
              header="Email"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by email"
            ></Column>

            <Column
              showAddButton={false}
              field="mobile"
              header="Mobile"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by mobile"
            ></Column>

            <Column
              showAddButton={false}
              field="country"
              header="Country"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="country"
              filter
              filterElement={countryFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="userType"
              header="User Types"
              body={userTypeBodyTamplate}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="userType"
              filter
              filterElement={userTypeFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="kitchen"
              header="Kitchen"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="kitchen"
              filter
              filterElement={kitchenFilterTemplate}
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={usersDialog}
            style={{ width: "450px" }}
            header="Users Details"
            modal
            className="p-fluid"
            footer={usersDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="grid ">
                <div className="field col-6">
                  <label htmlFor="firstName">First Name</label>
                  <InputText
                    id="firstName"
                    placeholder="First Name"
                    value={users.firstName}
                    onChange={(e) => onInputChange(e, "firstName")}
                    required
                    className={classNames({
                      "p-invalid": submitted && !users.firstName,
                    })}
                  />
                </div>

                <div className="field col-6">
                  <label htmlFor="lastName">Last Name</label>
                  <InputText
                    id="lastName"
                    placeholder="Last Name"
                    value={users.lastName}
                    onChange={(e) => onInputChange(e, "lastName")}
                    required
                    className={classNames({
                      "p-invalid": submitted && !users.lastName,
                    })}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  placeholder="Email"
                  value={users.email}
                  onChange={(e) => onInputChange(e, "email")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !users.email,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="mobile">Mobile</label>
                <InputText
                  id="mobile"
                  placeholder="Mobile number"
                  value={users.mobile}
                  onChange={(e) => onInputChange(e, "mobile")}
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <Password
                  id="password"
                  value={users.password}
                  onChange={(e) => onInputChange(e, "password")}
                  toggleMask
                  required
                  className={classNames({
                    "p-invalid": submitted && !users.password,
                  })}
                  placeholder="Type a password"
                />
              </div>

              <div className="grid">
                <div className="field col-6">
                  <label htmlFor="country">Country</label>
                  <Dropdown
                    id="country"
                    placeholder="Select Country"
                    optionLabel="name"
                    value={users.country}
                    options={datacountrys}
                    onChange={(e) => onInputChange(e, "country")}
                  />
                </div>
                <div className="field col-6">
                  <label htmlFor="userType">User Types</label>
                  <Dropdown
                    id="userType"
                    optionLabel="name"
                    value={users.userType}
                    options={dataUserTypes.filter(
                      (e) => e.value > userData!.permissionLevel!
                    )}
                    onChange={(e) => onInputChange(e, "userType")}
                    placeholder="Select User Type"
                  />
                </div>
              </div>
              {users.userType === 2 && (
                <div className="field">
                  <label htmlFor="kitchen">Kitchen</label>
                  <Dropdown
                    id="kitchen"
                    optionLabel="kitchenName"
                    optionValue="id"
                    value={users.kitchen}
                    options={datakitchens}
                    onChange={(e) => onInputChange(e, "kitchen")}
                    placeholder="Assign Chef in a kitchen"
                  />
                </div>
              )}
              <div>
                <div className="field">
                  <label htmlFor="kitchen">Address</label> <hr />
                  <div className="mt-5 flex gap-2">
                    <span className="p-float-label">
                      <InputText
                        id="addressPreference"
                        value={userAddress.addressPreference}
                        onChange={(e) =>
                          onAddressChange(e, "addressPreference")
                        }
                      />
                      <label htmlFor="addressPreference">
                        Address Preference
                      </label>
                    </span>
                    <span className="p-float-label">
                      <InputText
                        id="zone"
                        value={userAddress.zone}
                        onChange={(e) => onAddressChange(e, "zone")}
                      />
                      <label htmlFor="username">Zone</label>
                    </span>
                  </div>
                  <div className="field mt-5 flex gap-2">
                    <span className="p-float-label">
                      <InputText
                        id="building"
                        value={userAddress.building}
                        onChange={(e) => onAddressChange(e, "building")}
                      />
                      <label htmlFor="building">Building</label>
                    </span>
                    <span className="p-float-label">
                      <InputText
                        id="unit"
                        value={userAddress.unit}
                        onChange={(e) => onAddressChange(e, "unit")}
                      />
                      <label htmlFor="unit">Unit</label>
                    </span>
                    <span className="p-float-label">
                      <InputText
                        id="streetName"
                        value={userAddress.streetName}
                        onChange={(e) => onAddressChange(e, "streetName")}
                      />
                      <label htmlFor="streetName">Street Name</label>
                    </span>
                  </div>
                  <div className="field mt-5 flex gap-2">
                    <span className="p-float-label">
                      <InputNumber
                        value={longitude}
                        onValueChange={(e: InputNumberValueChangeEvent) =>
                          setLongitude(e.value)
                        }
                        // onValueChange={(e) => onAddressChange(e, "longitude")}
                        maxFractionDigits={4}
                        // minFractionDigits={0}
                      />
                      <label htmlFor="longitude">Longitude</label>
                    </span>
                    <span className="p-float-label">
                      <InputNumber
                        value={latitude}
                        onValueChange={(e: InputNumberValueChangeEvent) =>
                          setLatitude(e.value)
                        }
                        // onValueChange={(e) => onAddressChange(e, "latitude")}
                        maxFractionDigits={4}
                      />
                      <label htmlFor="latitude">Latitude</label>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteUsersDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteUsersDialogFooter}
            onHide={hideDeleteUsersDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {users && (
                <span>
                  Are you sure you want to delete <b>Users record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteUserssDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteUserssDialogFooter}
            onHide={hideDeleteUserssDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {users && (
                <span>Are you sure you want to delete the selected Users?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

export async function getStaticProps(context: any) {
  // extract the locale identifier from the URL
  const { locale } = context;

  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}
