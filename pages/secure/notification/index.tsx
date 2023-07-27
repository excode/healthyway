import { validate, validateForm } from "@lib/validation";
import { Chef, ChefService } from "@services/Chef";
import { SortType } from "@services/CommonTypes";
import {
  Notification,
  NotificationKey,
  NotificationQuery,
  NotificationService,
} from "@services/Notification";
import { LangContext } from "hooks/lan";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { AutoComplete } from "primereact/autocomplete";
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
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";

const NotificationPage = () => {
  const { asPath } = useRouter();
  const validation = [
    { id: "chefId", type: validate.text, required: true },
    { id: "message", type: validate.text, max: 500, min: 0, required: true },
    { id: "status", type: validate.text, required: true },
  ];
  let emptyNotification: Notification = {
    chefId: "",
    message: "",
    status: "",
  };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [backupNotifications, setBackupNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [deleteNotificationDialog, setDeleteNotificationDialog] =
    useState(false);
  const [deleteNotificationsDialog, setDeleteNotificationsDialog] =
    useState(false);
  const [notification, setNotification] =
    useState<Notification>(emptyNotification);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Notification[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Notification[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const notificationService = new NotificationService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());
  const { textFormat } = useContext(LangContext);

  const chefService = new ChefService();
  const [sugchefs, setSugChefs] = useState<Chef[]>([]);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await notificationService.getNotification({ limit: row });
      console.log(d);
      if (d.error == undefined) {
        setNotifications(d.docs);
        setBackupNotifications(d.docs);
        setLoading(false);
        setTotalRecords(d.count);

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
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      chefId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      message: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      createBy: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      createAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      updateBy: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      updateAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const searchChef = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataChef_ = await chefService.getChefSuggestions(e.query.trim());
      setSugChefs(dataChef_.data);
    }
  };

  const datastatuss = [
    { value: "Pendind", name: "Pendind" },
    { value: "Read", name: "Read" },
  ];

  const createAtFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const updateAtFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const chefIdFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        completeMethod={searchChef}
        suggestions={sugchefs}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a chefId"
        className="p-column-filter"
      />
    );
  };

  const statusFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">Status Picker</div>
        <Dropdown
          value={options.value}
          options={datastatuss}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
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
    setNotification(emptyNotification);
    setSubmitted(false);
    setNotificationDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setNotificationDialog(false);
  };

  const hideDeleteNotificationDialog = () => {
    setDeleteNotificationDialog(false);
  };

  const hideDeleteNotificationsDialog = () => {
    setDeleteNotificationsDialog(false);
  };

  const saveNotification = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(notification, validation);
    if (validationErrors.length == 0) {
      let _notifications: Notification[] = [...notifications];
      let _notification: Notification = { ...notification };
      if (notification.id) {
        let d = await notificationService.updateNotification(_notification);
        if (d.error == undefined) {
          const index = _notifications.findIndex(
            (c) => c.id === notification.id
          );
          if (index !== -1) {
            _notifications[index] = { ..._notification };
            // _notifications[index] = _notification;
            //_notifications.splice(index, 1, {..._notification,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Notification Updated",
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
        let d = await notificationService.addNotification(_notification);
        if (d.error == undefined) {
          var newID = d.id;
          // _notifications.unshift({..._notification,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Notification Updated",
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

      setNotifications(_notifications);
      setBackupNotifications(_notifications);
      setNotificationDialog(false);
      setNotification(emptyNotification);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editNotification = (notification: Notification) => {
    setNotification({ ...notification });
    setNotificationDialog(true);
  };

  const confirmDeleteNotification = (notification: Notification) => {
    setNotification(notification);
    setDeleteNotificationDialog(true);
  };

  const deleteNotification = async () => {
    let d = await notificationService.deleteNotification(notification.id ?? "");
    if (d.error == undefined) {
      let _notifications = notifications.filter(
        (val) => val.id !== notification.id
      );
      setNotifications(_notifications);
      setBackupNotifications(_notifications);
      setDeleteNotificationDialog(false);
      setNotification(emptyNotification);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Notification Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Notification Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteNotificationsDialog(true);
  };

  const deleteSelectedNotifications = () => {
    let _notifications = notifications.filter(
      (val) => !selectedNotifications.includes(val)
    );
    setNotifications(_notifications);
    setDeleteNotificationsDialog(false);
    setSelectedNotifications([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Notifications Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: NotificationKey) => {
    let val = (e.target && e.target.value) || "";
    let _notification: Notification = { ...notification };
    _notification[name] = val;
    setNotification(_notification);
  };
  const onInputBooleanChange = (e: any, name: NotificationKey) => {
    let val = e.target.value;
    let _notification: Notification = { ...notification };
    _notification[name] = val;

    setNotification(_notification);
  };
  const onInputChange = (e: any, name: NotificationKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = notification[name];

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

    let _notification: Notification = { ...notification };
    _notification[name] = val;

    setNotification(_notification);
  };

  const onInputNumberChange = (e: any, name: NotificationKey) => {
    let val = e.value || 0;
    let _notification = { ...notification };
    _notification[name] = val;

    setNotification(_notification);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: NotificationQuery = {};
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

    let d = await notificationService.getNotification(searchObj);
    if (d.error == undefined) {
      setNotifications(d.docs);
      setBackupNotifications(d.docs);
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
      let _notifications = [...notifications];
      let filtered = _notifications.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setNotifications(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setNotifications(backupNotifications);
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
            disabled={!selectedNotifications || !selectedNotifications.length}
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

  const actionBodyTemplate = (rowData: Notification) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editNotification(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteNotification(rowData)}
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

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Notifications</h5>
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

  const notificationDialogFooter = (
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
        onClick={saveNotification}
      />
    </>
  );
  const deleteNotificationDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteNotificationDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteNotification}
      />
    </>
  );
  const deleteNotificationsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteNotificationsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedNotifications}
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
            value={notifications}
            selection={selectedNotifications}
            onSelectionChange={(e) =>
              setSelectedNotifications(e.value as Notification[])
            }
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Notifications"
            emptyMessage="No Notifications found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="chefId"
              header="chefId"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="chefId"
              filter
              filterElement={chefIdFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="message"
              header="message"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by message"
            ></Column>

            <Column
              showAddButton={false}
              field="status"
              header="Status"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="status"
              filter
              filterElement={statusFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="createBy"
              header="Created By"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by createBy"
            ></Column>

            <Column
              showAddButton={false}
              field="createAt"
              header="Created At"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="createAt"
              dataType="date"
              filter
              filterElement={createAtFilterTemplate}
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={notificationDialog}
            style={{ width: "450px" }}
            header="Notification Details"
            modal
            className="p-fluid"
            footer={notificationDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="chefId">chefId</label>
                <AutoComplete
                  field="name"
                  id="chefId"
                  completeMethod={searchChef}
                  value={notification.chefId}
                  suggestions={sugchefs}
                  onChange={(e) => onInputChange(e, "chefId")}
                />
              </div>

              <div className="field">
                <label htmlFor="message">message</label>
                <InputText
                  id="message"
                  value={notification.message}
                  onChange={(e) => onInputChange(e, "message")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !notification.message,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="status">Status</label>
                <Dropdown
                  id="status"
                  optionLabel="name"
                  value={notification.status}
                  options={datastatuss}
                  onChange={(e) => onInputChange(e, "status")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteNotificationDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteNotificationDialogFooter}
            onHide={hideDeleteNotificationDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {notification && (
                <span>
                  Are you sure you want to delete <b>Notification record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteNotificationsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteNotificationsDialogFooter}
            onHide={hideDeleteNotificationsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {notification && (
                <span>
                  Are you sure you want to delete the selected Notification?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
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
