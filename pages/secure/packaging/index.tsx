import config from "@config/configs";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { Customer, CustomerService } from "@services/Customer";
import {
  MealOrder,
  MealOrderKey,
  MealOrderQuery,
  MealOrderService,
} from "@services/MealOrder";
import { LangContext } from "hooks/lan";
import moment from "moment";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";
import Image from "next/image";
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
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import packaged from "/public/layout/images/package.png";

const MealOrderPage = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const validation = [
    { id: "invoiceNo", type: validate.text, max: 30, min: 0, required: true },
    { id: "customerName", type: validate.text, required: true },
    { id: "customerEmail", type: validate.text, required: false },
    { id: "customerPhone", type: validate.text, required: false },
    {
      id: "Instruction",
      type: validate.text,
      max: 500,
      min: 0,
      required: true,
    },
    { id: "orderType", type: validate.text, required: true },
    { id: "location", type: validate.text, max: 50, min: 0, required: true },
  ];
  let emptyMealOrder: MealOrder = {
    customerName: "",
    orderDate: new Date(),
    deliveryDate: new Date(),
    deliveryAddress: {},
    Instruction: "",
    location: "",
    orderType: "",
    status: "",
    invoiceNo: "",
    totalAmount: 0,
  };

  const [mealOrders, setMealOrders] = useState<MealOrder[]>([]);
  const [mealOrder, setMealOrder] = useState<MealOrder>(emptyMealOrder);
  const [backupMealOrders, setBackupMealOrders] = useState<MealOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [mealOrderDialog, setMealOrderDialog] = useState(false);
  const [cookingMealOrderDialog, setCookingMealOrderDialog] = useState(false);
  const [mealOrderConfirmationDialog, setMealOrderConfirmationDialog] =
    useState({ actionType: "", isVisible: false });
  const [deleteMealOrdersDialog, setDeleteMealOrdersDialog] = useState(false);
  const [selectedMealOrders, setSelectedMealOrders] = useState<MealOrder[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MealOrder[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const mealorderService = new MealOrderService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());
  const { textFormat } = useContext(LangContext);

  const customerService = new CustomerService();
  const [sugcustomers, setSugCustomers] = useState<Customer[]>([]);
  const [timeLeft, setTimeLeft] = useState("");

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await mealorderService.getMealOrder({ status: "prepared" });
      // console.log(d);
      if (d.error == undefined) {
        setMealOrders(d.docs);
        setBackupMealOrders(d.docs);
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
      createBy: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      updateBy: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      updateAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      orderDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      deliveryDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      deliveryAddress: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      Instruction: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      orderType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      location: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      createAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      customerName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      invoiceNo: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      totalAmount: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      customerEmail: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      customerPhone: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const searchCustomer = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataCustomer_ = await customerService.getCustomerSuggestions(
        e.query.trim()
      );
      setSugCustomers(dataCustomer_.data);
    }
  };

  const dataorderTypes = [
    { value: "Home Delivery", name: "Home Delivery" },
    { value: "Dine-in", name: "Dine-in" },
    { value: "Take-Away", name: "Take-Away" },
  ];

  const dataStatus = [
    { value: "pending", name: "pending" },
    { value: "cooking", name: "cooking" },
    { value: "prepared", name: "prepared" },
    { value: "cancelled", name: "cancelled" },
    { value: "packaged", name: "packaged" },
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

  const customerNameFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        completeMethod={searchCustomer}
        suggestions={sugcustomers}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a customerName"
        className="p-column-filter"
      />
    );
  };

  const orderDateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const deliveryDateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const orderTypeFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">{t("ORDER_TYPE_PICKER")}</div>
        <Dropdown
          value={options.value}
          options={dataorderTypes}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const statusFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold"> {t("STATUS_PICKER")}</div>
        <Dropdown
          value={options.value}
          options={dataStatus}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const totalAmountFilterTemplate = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
      />
    );
  };
  const customerEmailFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="email"
        value={options.value}
        completeMethod={searchCustomer}
        suggestions={sugcustomers}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a customerEmail"
        className="p-column-filter"
      />
    );
  };

  const customerPhoneFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="mobile"
        value={options.value}
        completeMethod={searchCustomer}
        suggestions={sugcustomers}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a customerPhone"
        className="p-column-filter"
      />
    );
  };

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setMealOrder(emptyMealOrder);
    setSubmitted(false);
    setMealOrderDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMealOrderDialog(false);
  };

  const hideMealOrderConfirmationDialog = () => {
    setMealOrderConfirmationDialog({ actionType: "", isVisible: false });
  };

  const hideDeleteMealOrderDialog = () => {
    setCookingMealOrderDialog(false);
  };

  const hideDeleteMealOrdersDialog = () => {
    setDeleteMealOrdersDialog(false);
  };

  const saveMealOrder = async () => {
    hideMealOrderConfirmationDialog();
    setSubmitted(true);
    const validationErrors: string[] = validateForm(mealOrder, validation);
    if (validationErrors.length == 0) {
      let _mealOrders: MealOrder[] = [...mealOrders];
      let _mealOrder: MealOrder = { ...mealOrder };
      if (mealOrder.id) {
        let d = await mealorderService.updateMealOrder(_mealOrder);
        if (d.error === undefined) {
          const index = _mealOrders.findIndex((c) => c.id === mealOrder.id);

          if (index !== -1) {
            _mealOrders[index] = { ..._mealOrder };
            // _mealOrders[index] = _mealOrder;
            //_mealOrders.splice(index, 1, {..._mealOrder,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: `${_mealOrder.item?.name} packaging done. Now ready to delivered"`,
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
        let d = await mealorderService.addMealOrder(_mealOrder);
        if (d.error == undefined) {
          var newID = d.id;
          // _mealOrders.unshift({..._mealOrder,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealOrder Updated",
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
      const filteredMealOrders = _mealOrders.filter(
        (m) => m.status !== "packaged"
      );
      setMealOrders(filteredMealOrders);
      setBackupMealOrders(_mealOrders);
      setMealOrderDialog(false);
      setMealOrder(emptyMealOrder);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editMealOrder = (mealOrder: MealOrder) => {
    setMealOrder({ ...mealOrder });
    setMealOrderDialog(true);
  };

  const confirmMealOrderAction = (mealOrder: MealOrder, actionName: string) => {
    const temp = { ...mealOrder };
    temp.status = actionName;
    setMealOrder(temp);
    setMealOrderConfirmationDialog({ actionType: actionName, isVisible: true });
    // setCookingMealOrderDialog(true);
  };

  const confirmCookingMealOrder = (mealOrder: MealOrder) => {
    const temp = { ...mealOrder };
    temp.status = dataStatus[1].value;
    setMealOrder(temp);
    setCookingMealOrderDialog(true);
  };

  // const confirmDeleteMealOrder = (mealOrder: MealOrder) => {
  //   setMealOrder(mealOrder);
  //   setCookingMealOrderDialog(true);
  // };

  const deleteMealOrder = async () => {
    let d = await mealorderService.deleteMealOrder(mealOrder.id ?? "");
    if (d.error == undefined) {
      let _mealOrders = mealOrders.filter((val) => val.id !== mealOrder.id);
      setMealOrders(_mealOrders);
      setBackupMealOrders(_mealOrders);
      setCookingMealOrderDialog(false);
      setMealOrder(emptyMealOrder);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "MealOrder Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealOrder Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteMealOrdersDialog(true);
  };

  const deleteSelectedMealOrders = () => {
    let _mealOrders = mealOrders.filter(
      (val) => !selectedMealOrders.includes(val)
    );
    setMealOrders(_mealOrders);
    setDeleteMealOrdersDialog(false);
    setSelectedMealOrders([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "MealOrders Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: MealOrderKey) => {
    let val = (e.target && e.target.value) || "";
    let _mealOrder: MealOrder = { ...mealOrder };
    _mealOrder[name] = val;
    setMealOrder(_mealOrder);
  };
  const onInputBooleanChange = (e: any, name: MealOrderKey) => {
    let val = e.target.value;
    let _mealOrder: MealOrder = { ...mealOrder };
    _mealOrder[name] = val;

    setMealOrder(_mealOrder);
  };
  const onInputChange = (e: any, name: MealOrderKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = mealOrder[name];

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

    let _mealOrder: MealOrder = { ...mealOrder };
    _mealOrder[name] = val;

    setMealOrder(_mealOrder);
  };

  const onInputNumberChange = (e: any, name: MealOrderKey) => {
    let val = e.value || 0;
    let _mealOrder = { ...mealOrder };
    _mealOrder[name] = val;

    setMealOrder(_mealOrder);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: MealOrderQuery = {};
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

    let d = await mealorderService.getMealOrder(searchObj);
    if (d.error == undefined) {
      setMealOrders(d.docs);
      setBackupMealOrders(d.docs);
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
      let _mealOrders = [...mealOrders];
      let filtered = _mealOrders.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setMealOrders(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setMealOrders(backupMealOrders);
    }
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label={t("NEW")}
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label={t("DELETE")}
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedMealOrders || !selectedMealOrders.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label={t("EXPORT")}
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: MealOrder) => {
    return (
      <div className="flex align-content-center gap-2">
        <Button
          name="completed"
          // icon="pi pi-arrow-right-arrow-left"
          className="p-button-rounded p-button-success gap-3 "
          onClick={() => confirmMealOrderAction(rowData, "packaged")}
        >
          <Image src={packaged} alt="packaging" width={18} /> {t("PACKAGED")}
        </Button>
        {/* <Button
          name="cooking"
          className="p-button-rounded p-button-info "
          onClick={() => confirmMealOrderAction(rowData, dataStatus[1].value)}
          // onClick={() => confirmCookingMealOrder(rowData)}
        >
          <Image src={cooking} alt="cooking" width={18} />
        </Button>
      */}

        <Button
          name={t("CANCELLED")}
          icon="pi pi-times"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmMealOrderAction(rowData, dataStatus[3].value)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0"> {t("MANAGE_MEAL_ORDERS")}</h5>
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

  const mealOrderDialogFooter = (
    <>
      <Button
        label={t("CANCEL")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label={t("SAVE")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveMealOrder}
      />
    </>
  );
  const mealOrderConfirmationDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideMealOrderConfirmationDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveMealOrder}
      />
    </>
  );
  const cookingMealOrderDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealOrderDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveMealOrder}
      />
    </>
  );

  const deleteMealOrdersDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealOrdersDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMealOrders}
      />
    </>
  );

  const headerTemplate = (data: MealOrder) => {
    const date = moment(data.deliveryDate).format("dddd, DD MMMM");
    return (
      <div className="flex align-items-center gap-2 ">
        <span className="font-semibold capitalize text-lg">
          {t("READY_TO_DISPATCHED")}
        </span>
        {/* <span>{date}</span> */}
        {/* <span>{data.deliveryDate}</span> */}
      </div>
    );
  };

  const calculateSessionMealTotal = (data: MealOrder) => {
    return mealOrders.reduce((total, meal) => {
      if (meal.status === data.status) {
        if (meal.quantity) return total + meal.quantity;
      }
      return total;
    }, 0);
  };

  const footerTemplate = (data: MealOrder) => {
    return (
      <React.Fragment>
        <td colSpan={5}>
          <div className="flex justify-content-end font-bold w-full">
            {t("TOTAL")} {data.status}: {calculateSessionMealTotal(data)}
          </div>
        </td>
      </React.Fragment>
    );
  };
  const updateTimeDifference = (rowData: MealOrder) => {
    const endTime = new Date();
    if (rowData?.session === "breakfast") {
      endTime.setHours(6, 0, 0);
    } else if (rowData?.session === "lunch") {
      endTime.setHours(12, 0, 0);
    } else if (rowData?.session === "dinner") {
      endTime.setHours(19, 0, 0);
    }

    const currentTime = new Date();
    const ti = endTime.getTime() - currentTime.getTime();

    const hours = Math.floor(ti / (1000 * 60 * 60));
    const minutes = Math.floor((ti % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ti % (1000 * 60)) / 1000);
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    // setTimeLeft(formattedTime);
    return formattedTime;
  };

  const timeLeftBodyTemplate = (rowData: MealOrder) => {
    // const time = updateTimeDifference(rowData);
    // setInterval(updateTimeDifference, 1000);
    const time = moment(rowData.deliveryDate).format("HH:mm");
    return time;
  };

  const statusBodyTemplate = (data: MealOrder) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case "pending":
          return "warning";

        case "prepared":
          return "success";

        case "cancelled":
          return "danger";

        case "cooking":
          return "info";
      }
    };
    return <Tag value={data.status} severity={getSeverity(data.status)} />;
  };

  const addressBodyTemplate = (data: MealOrder) => {
    return (
      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 mt-1">
        <span className="underline">
          {data.deliveryAddress.addressPreference}:
        </span>
        <div className="mt-1">
          <span className="font-semibold"> {t("ZONE")}: </span>
          {data.deliveryAddress.zone},
          <span className="font-semibold"> {t("BUILDING")}: </span>
          {data.deliveryAddress.building},
          <span className="font-semibold"> {t("UNITE")}: </span>
          {data.deliveryAddress.unit},
          <span className="font-semibold"> {t("STREET")}: </span>
          {data.deliveryAddress.streetName}
        </div>
      </div>
    );
  };

  const nameBodyTemplate = (data: MealOrder) => {
    let imageURL = config.serverURI + "/" + data.item?.image;

    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={data.item?.name}
          src={imageURL}
          className="rounded"
          width="32"
        />
        <span className="capitalize font-bold">{data.item?.name}</span>
      </div>
    );
  };

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
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            value={mealOrders}
            rowGroupMode="subheader"
            groupRowsBy="status"
            sortMode="single"
            sortField="session"
            sortOrder={1}
            scrollable
            loading={loading}
            scrollHeight="600px"
            rowGroupHeaderTemplate={headerTemplate}
            rowGroupFooterTemplate={footerTemplate}
            emptyMessage="No Data Found"
            tableStyle={{ minWidth: "50rem" }}
            selectionMode="single"
          >
            <Column
              field="item.name"
              header="Meal Name"
              body={nameBodyTemplate}
              style={{ minWidth: "200px" }}
            ></Column>
            <Column
              field="session"
              header={t("SESSION")}
              className="capitalize"
              // body={countryBodyTemplate}
              style={{ minWidth: "100px" }}
            ></Column>

            <Column
              field="quantity"
              header={t("QUANTITY")}
              style={{ minWidth: "50px" }}
            ></Column>
            <Column
              header={t("DELIVERY_TIME")}
              body={timeLeftBodyTemplate}
              style={{ minWidth: "150px" }}
            ></Column>
            <Column
              // field="status"
              header={t("STATUS")}
              body={statusBodyTemplate}
              style={{ minWidth: "100px" }}
            ></Column>

            <Column
              field="invoiceNo"
              header={t("INVOICE_NO")}
              style={{ minWidth: "150px" }}
            ></Column>
            <Column
              field="customerPhone"
              header={t("CUSTOMER_PHONE")}
              style={{ minWidth: "150px" }}
            ></Column>
            <Column
              field="customerPhone"
              header={t("DELIVERY_ADDRESS")}
              style={{ minWidth: "150px" }}
              body={addressBodyTemplate}
            ></Column>
            <Column
              // field="customerPhone"
              header={t("ACTION")}
              style={{ minWidth: "100px" }}
              body={actionBodyTemplate}
            ></Column>
          </DataTable>

          <Dialog
            visible={mealOrderDialog}
            style={{ width: "450px" }}
            header={t("MEAL_ORDER_DETAILS")}
            modal
            className="p-fluid"
            footer={mealOrderDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="invoiceNo"> {t("INVOICE_NO")}</label>
                <InputText
                  id="invoiceNo"
                  value={mealOrder.invoiceNo}
                  onChange={(e) => onInputChange(e, "invoiceNo")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealOrder.invoiceNo,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="customerName"> {t("CUSTOMER_NAME")}</label>
                <AutoComplete
                  field="name"
                  id="customerName"
                  completeMethod={searchCustomer}
                  value={mealOrder.customerName}
                  suggestions={sugcustomers}
                  onChange={(e) => onInputChange(e, "customerName")}
                />
              </div>

              <div className="field">
                <label htmlFor="customerEmail"> {t("EMAIL")}</label>
                <AutoComplete
                  field="email"
                  id="customerEmail"
                  completeMethod={searchCustomer}
                  value={mealOrder.customerEmail}
                  suggestions={sugcustomers}
                  onChange={(e) => onInputChange(e, "customerEmail")}
                />
              </div>

              <div className="field">
                <label htmlFor="customerPhone">{t("PHONE")}</label>
                <AutoComplete
                  field="mobile"
                  id="customerPhone"
                  completeMethod={searchCustomer}
                  value={mealOrder.customerPhone}
                  suggestions={sugcustomers}
                  onChange={(e) => onInputChange(e, "customerPhone")}
                />
              </div>

              <div className="field">
                <label htmlFor="Instruction"> {t("INSTRUCTION")}</label>
                <InputText
                  id="Instruction"
                  value={mealOrder.Instruction}
                  onChange={(e) => onInputChange(e, "Instruction")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealOrder.Instruction,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="orderType"> {t("ORDER_TYPE")}</label>
                <Dropdown
                  id="orderType"
                  optionLabel="name"
                  value={mealOrder.orderType}
                  options={dataorderTypes}
                  onChange={(e) => onInputChange(e, "orderType")}
                />
              </div>

              <div className="field">
                <label htmlFor="location"> {t("LOCATION")}</label>
                <InputText
                  id="location"
                  value={mealOrder.location}
                  onChange={(e) => onInputChange(e, "location")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealOrder.location,
                  })}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={mealOrderConfirmationDialog.isVisible}
            style={{ width: "450px" }}
            header={`Confirm ${mealOrderConfirmationDialog.actionType}`}
            modal
            footer={mealOrderConfirmationDialogFooter}
            onHide={hideMealOrderConfirmationDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3 text-red-500"
                style={{ fontSize: "2rem" }}
              />
              {mealOrder && (
                <span>
                  Are you sure you want to{" "}
                  <span
                    className={`${
                      mealOrderConfirmationDialog.actionType ===
                        dataStatus[3].value && "text-red-500"
                    } `}
                  >
                    {mealOrderConfirmationDialog.actionType}{" "}
                  </span>
                  <b>{mealOrder.item?.name}</b> for{" "}
                  <b>{mealOrder.customerName}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={cookingMealOrderDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={cookingMealOrderDialogFooter}
            onHide={hideDeleteMealOrderDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3 text-red-500"
                style={{ fontSize: "2rem" }}
              />
              {mealOrder && (
                <span>
                  Are you sure you want to cancel <b>{mealOrder.item?.name}</b>{" "}
                  for <b>{mealOrder.customerName}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealOrdersDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealOrdersDialogFooter}
            onHide={hideDeleteMealOrdersDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealOrder && (
                <span>
                  Are you sure you want to delete the selected MealOrder?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MealOrderPage;

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
