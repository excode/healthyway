import config from "@config/index";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { Customer, CustomerService } from "@services/Customer";
import { MealItem, MealItemService } from "@services/MealItem";
import {
  Subscription,
  SubscriptionKey,
  SubscriptionQuery,
  SubscriptionService,
} from "@services/Subscription";
import { Users, UsersService } from "@services/Users";
import { LangContext } from "hooks/lan";
import { useTranslation } from "next-i18next";
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

const SubscriptionPage = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const { textFormat } = useContext(LangContext);
  const validation = [
    { id: "customerId", type: validate.text, required: true },
    { id: "startDate", type: validate.date, max: 0, min: 0, required: true },
    { id: "endDate", type: validate.date, max: 0, min: 0, required: true },
    { id: "status", type: validate.text, required: true },
    { id: "breakfast", type: validate.array, required: true },
    { id: "lunch", type: validate.array, required: true },
    { id: "dinner", type: validate.array, required: true },
    { id: "day", type: validate.text, require: true },
  ];

  interface WeekdayDate {
    weekday: string;
    date: Date;
  }

  let emptySubscription: Subscription = {
    customerId: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "",
    subPlans: [],
  };

  const dataWeekdays = [
    { value: 0, name: "Saturday" },
    { value: 1, name: "Sunday" },
    { value: 2, name: "Monday" },
    { value: 3, name: "Tuesday" },
    { value: 4, name: "Wednesday" },
    { value: 5, name: "Thursday" },
    { value: 6, name: "Friday" },
  ];

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [backupSubscriptions, setBackupSubscriptions] = useState<
    Subscription[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);
  const [deleteSubscriptionDialog, setDeleteSubscriptionDialog] =
    useState(false);
  const [deleteSubscriptionsDialog, setDeleteSubscriptionsDialog] =
    useState(false);
  const [subscription, setSubscription] =
    useState<Subscription>(emptySubscription);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<
    Subscription[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Subscription[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const subscriptionService = new SubscriptionService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const customerService = new CustomerService();
  const [sugcustomers, setSugCustomers] = useState<Customer[]>([]);
  const userService = new UsersService();
  const [sugUsers, setSugUsers] = useState<Users[]>([]);

  const mealitemService = new MealItemService();
  const [sugmealItems, setSugMealItems] = useState<MealItem[]>([]);

  const [allMealItem, setAllMealItem] = useState<MealItem[]>([]);
  const [breakfastMeal, setBreakFastMeal] = useState<MealItem[]>([]);
  const [lunchMeal, setLunchMeal] = useState<MealItem[]>([]);
  const [dinnerMeal, setDinnerMeal] = useState<MealItem[]>([]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await subscriptionService.getSubscription({ limit: row });
      if (d.error == undefined) {
        setSubscriptions(d.docs);
        setBackupSubscriptions(d.docs);
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
  function getWeekdayNames(startDate: Date, endDate: Date): WeekdayDate[] {
    const weekdays: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekdayDates: WeekdayDate[] = [];

    const currentDate: Date = new Date(startDate);

    while (currentDate <= endDate) {
      if (weekdays.includes(weekdays[currentDate.getDay()])) {
        const weekdayName: string = weekdays[currentDate.getDay()];
        const weekdayDate: Date = new Date(currentDate);

        const weekdayObject: WeekdayDate = {
          weekday: weekdayName,
          date: weekdayDate,
        };

        weekdayDates.push(weekdayObject);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weekdayDates;
  }
  const weekDayNames = getWeekdayNames(startDate, endDate);

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      createAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      startDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      endDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      breakfast: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      lunch: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      dinner: {
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
      let dataCustomer_ = await userService.getUsersSuggestions(e.query.trim());
      // let dataCustomer_ = await customerService.getCustomerSuggestions(
      //   e.query.trim()
      // );
      setSugUsers(dataCustomer_.data);
      // setSugCustomers(dataCustomer_.data);
    }
  };

  const datastatuss = [
    { value: "Expired", name: "Expired" },
    { value: " Active", name: " Active" },
  ];

  const searchMealItem = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataMealItem_ = await mealitemService.getMealItemSuggestions(
        e.query.trim()
      );
      setSugMealItems(dataMealItem_.data);
    }
  };

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

  const customerIdFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="firstName"
        // field="name"
        value={options.value}
        completeMethod={searchCustomer}
        // completeMethod={searchCustomer}
        suggestions={sugUsers}
        // suggestions={sugcustomers}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a customerId"
        className="p-column-filter"
      />
    );
  };

  const startDateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const endDateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
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
  const breakfastFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchMealItem}
        suggestions={sugmealItems}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a breakfast"
        className="p-column-filter"
      />
    );
  };

  const lunchFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchMealItem}
        suggestions={sugmealItems}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a lunch"
        className="p-column-filter"
      />
    );
  };

  const dinnerFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchMealItem}
        suggestions={sugmealItems}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a dinner"
        className="p-column-filter"
      />
    );
  };

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = async () => {
    setLoading(true);
    const allMealItem = await mealitemService.getMealItemAll({});
    allMealItem && setLoading(false);
    setAllMealItem(allMealItem?.data);

    const breakFastMeal = allMealItem?.data.filter((meal) =>
      meal.mealType.includes("Breakfast")
    );
    setBreakFastMeal(breakFastMeal);

    const lunchMeal = allMealItem?.data.filter((meal) =>
      meal.mealType.includes("Lunch")
    );
    setLunchMeal(lunchMeal);

    const dinnerMeal = allMealItem?.data.filter((meal) =>
      meal.mealType.includes("Dinner")
    );
    setDinnerMeal(dinnerMeal);

    setSubscription(emptySubscription);
    setSubmitted(false);
    setSubscriptionDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setSubscriptionDialog(false);
  };

  const hideDeleteSubscriptionDialog = () => {
    setDeleteSubscriptionDialog(false);
  };

  const hideDeleteSubscriptionsDialog = () => {
    setDeleteSubscriptionsDialog(false);
  };

  const saveSubscription = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(subscription, validation);
    if (validationErrors.length == 0) {
      let _subscriptions: Subscription[] = [...subscriptions];
      let _subscription: Subscription = { ...subscription };
      if (subscription.id) {
        let d = await subscriptionService.updateSubscription(_subscription);
        if (d.error == undefined) {
          const index = _subscriptions.findIndex(
            (c) => c.id === subscription.id
          );

          if (index !== -1) {
            _subscriptions[index] = {
              ..._subscription,
              startDate: _subscription.startDate.toString(),
              endDate: _subscription.endDate.toString(),
            };
            // _subscriptions[index] = _subscription;
            //_subscriptions.splice(index, 1, {..._subscription,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Subscription Updated",
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
        let d = await subscriptionService.addSubscription(_subscription);
        if (d.error == undefined) {
          var newID = d.id;
          // _subscriptions.unshift({..._subscription,id:newID,startDate:_subscription.startDate.toString(),endDate:_subscription.endDate.toString()})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Subscription Updated",
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

      setSubscriptions(_subscriptions);
      setBackupSubscriptions(_subscriptions);
      setSubscriptionDialog(false);
      setSubscription(emptySubscription);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editSubscription = (subscription: Subscription) => {
    setSubscription({ ...subscription });
    setSubscriptionDialog(true);
  };

  const confirmDeleteSubscription = (subscription: Subscription) => {
    setSubscription(subscription);
    setDeleteSubscriptionDialog(true);
  };

  const deleteSubscription = async () => {
    let d = await subscriptionService.deleteSubscription(subscription.id ?? "");
    if (d.error == undefined) {
      let _subscriptions = subscriptions.filter(
        (val) => val.id !== subscription.id
      );
      setSubscriptions(_subscriptions);
      setBackupSubscriptions(_subscriptions);
      setDeleteSubscriptionDialog(false);
      setSubscription(emptySubscription);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Subscription Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Subscription Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteSubscriptionsDialog(true);
  };

  const deleteSelectedSubscriptions = () => {
    let _subscriptions = subscriptions.filter(
      (val) => !selectedSubscriptions.includes(val)
    );
    setSubscriptions(_subscriptions);
    setDeleteSubscriptionsDialog(false);
    setSelectedSubscriptions([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Subscriptions Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: SubscriptionKey) => {
    let val = (e.target && e.target.value) || "";
    let _subscription: Subscription = { ...subscription };
    _subscription[name] = val;
    setSubscription(_subscription);
  };
  const onInputBooleanChange = (e: any, name: SubscriptionKey) => {
    let val = e.target.value;
    let _subscription: Subscription = { ...subscription };
    _subscription[name] = val;

    setSubscription(_subscription);
  };

  const onInputChange = (e: any, name: SubscriptionKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        if (name === "startDate") {
          setStartDate(val);
        } else if (name === "endDate") {
          setEndDate(val);
        }
        val = val;
      } else if ("value" in val) {
        let aVal = subscription[name];

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

    let _subscription: Subscription = { ...subscription };
    _subscription[name] = val;

    setSubscription(_subscription);
  };

  const onInputNumberChange = (e: any, name: SubscriptionKey) => {
    let val = e.value || 0;
    let _subscription = { ...subscription };
    _subscription[name] = val;

    setSubscription(_subscription);
  };

  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    // let searchObj: any = {};
    let searchObj: SubscriptionQuery = {};
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

    let d = await subscriptionService.getSubscription(searchObj);
    if (d.error == undefined) {
      setSubscriptions(d.docs);
      setBackupSubscriptions(d.docs);
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
      let _subscriptions = [...subscriptions];
      let filtered = _subscriptions.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setSubscriptions(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setSubscriptions(backupSubscriptions);
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            loading={loading}
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
            disabled={!selectedSubscriptions || !selectedSubscriptions.length}
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

  const mealOptionsTemplate = (option: MealItem) => {
    let imageURL = config.serverURI + "/" + option?.image;
    return (
      <div className="flex align-items-center gap-2">
        <img alt={option.name} src={imageURL} style={{ width: "18px" }} />
        <div>{option.name}</div>
      </div>
    );
  };

  const selectedMealTemplate = (option: MealItem, props: any) => {
    let imageURL = config.serverURI + "/" + option?.image;
    // console.log({ props });
    if (option) {
      return (
        <div className=" flex gap-2  align-items-center">
          <img alt={option.name} src={imageURL} style={{ width: "18px" }} />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const actionBodyTemplate = (rowData: Subscription) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editSubscription(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteSubscription(rowData)}
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

  interface MealOption {
    label: string;
    value: string;
    image: string;
  }

  interface MealData {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }

  const daysOfWeek: string[] = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const onMealChange = (
    e: { value: MealItem },
    rowIndex: number,
    columnName: string
  ) => {
    // console.log(e, rowIndex, columnName);
    // console.log({ e });
    let _subscription: Subscription = { ...subscription };
    const weekday = dataWeekdays[rowIndex].name;
    const meal = {
      weekday,
      session: columnName,
      item: e.value,
      quantity: 1,
      status: "pending",
    };
    // const index = _subscription.subPlans?.filter((d) => d.weekday === weekday);
    // console.log(index);
    const index = _subscription.subPlans?.findIndex(
      (d) => d.weekday === weekday && d.session === columnName
    ) as number;

    if (_subscription.subPlans && index !== -1) {
      _subscription.subPlans[index] = meal;
    } else {
      _subscription.subPlans?.push(meal);
    }
    // console.log({ subscription });
    // console.log({ _subscription });
    // _subscription.subPlans[rowIndex][columnName] = e.value;
    setSubscription(_subscription);
  };

  const renderMealDropdown = (
    rowData: MealData,
    rowIndex: any,
    columnName: keyof MealData
  ) => {
    // console.log("data", rowData, rowIndex, columnName);
    let optionType;
    if (columnName === "breakfast") {
      optionType = breakfastMeal;
    } else if (columnName === "lunch") {
      optionType = lunchMeal;
    } else if (columnName === "dinner") {
      optionType = dinnerMeal;
    }
    const weekday = dataWeekdays[rowIndex.rowIndex].name;
    const mealOptionValue = subscription.subPlans?.find(
      (d) => d.weekday === weekday && d.session === columnName
    )?.item;
    // console.log({ mealOptionValue });

    return (
      <Dropdown
        id="mealList"
        value={mealOptionValue}
        options={optionType?.filter((opt) =>
          opt.weekdays.includes(dataWeekdays[rowIndex.rowIndex].name)
        )}
        // opt.weekdays.includes(daysOfWeek[rowIndex?.rowIndex])
        optionLabel="name"
        // optionValue="id"
        valueTemplate={selectedMealTemplate}
        itemTemplate={mealOptionsTemplate}
        placeholder="Select your meal"
        filter
        onChange={(e) => onMealChange(e, rowIndex.rowIndex, columnName)}
      >
        <img
          src={`path/to/images/${rowData[columnName]}.png`}
          alt={rowData[columnName]}
          style={{ width: "50px", height: "50px" }}
        />
      </Dropdown>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Subscriptions</h5>
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

  const subscriptionDialogFooter = (
    <div dir={textFormat} className="flex justify-content-end">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        loading={loading}
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveSubscription}
      />
    </div>
  );
  const deleteSubscriptionDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteSubscriptionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSubscription}
      />
    </>
  );
  const deleteSubscriptionsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteSubscriptionsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedSubscriptions}
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
            value={subscriptions}
            selection={selectedSubscriptions}
            onSelectionChange={(e) =>
              setSelectedSubscriptions(e.value as Subscription[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Subscriptions"
            emptyMessage="No Subscriptions found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="customerId"
              header="Customer Id"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="customerId"
              filter
              filterElement={customerIdFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="startDate"
              header="Start Date"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="startDate"
              dataType="date"
              filter
              filterElement={startDateFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="endDate"
              header="End Date"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="endDate"
              dataType="date"
              filter
              filterElement={endDateFilterTemplate}
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
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={subscriptionDialog}
            style={{ width: "750px" }}
            header="Subscription Details"
            modal
            className="p-fluid"
            footer={subscriptionDialogFooter}
            onHide={hideDialog}
            rtl={true}
          >
            <div dir={textFormat} className="field">
              <label className="font-bold" htmlFor="customerId">
                Customer Id
              </label>
              <AutoComplete
                field="firstName"
                id="customerId"
                completeMethod={searchCustomer}
                value={subscription.customerId}
                suggestions={sugUsers}
                // suggestions={sugcustomers}
                onChange={(e) => onInputChange(e, "customerId")}
              />
            </div>

            <div dir={textFormat} className="flex gap-5">
              <div className="field">
                <label className="font-bold" htmlFor="startDate">
                  Start Date
                </label>
                <Calendar
                  id="startDate"
                  value={
                    subscription.startDate
                      ? new Date(subscription.startDate)
                      : null
                  }
                  onChange={(e) => onInputChange(e, "startDate")}
                  dateFormat="mm/dd/yy"
                  placeholder="mm/dd/yyyy"
                  mask="99/99/9999"
                  required
                  className={classNames({
                    "p-invalid": submitted && !subscription.startDate,
                  })}
                />
              </div>

              <div className="field">
                <label className="font-bold" htmlFor="endDate">
                  End Date
                </label>
                <Calendar
                  id="endDate"
                  value={
                    subscription.endDate ? new Date(subscription.endDate) : null
                  }
                  onChange={(e) => onInputChange(e, "endDate")}
                  dateFormat="mm/dd/yy"
                  placeholder="mm/dd/yyyy"
                  mask="99/99/9999"
                  required
                  className={classNames({
                    "p-invalid": submitted && !subscription.endDate,
                  })}
                />
              </div>
              <div className="field ">
                <label className="font-bold" htmlFor="status">
                  Status
                </label>
                <Dropdown
                  id="status"
                  optionLabel="name"
                  value={subscription.status}
                  options={datastatuss}
                  onChange={(e) => onInputChange(e, "status")}
                />
              </div>
            </div>

            {/* <DataTable value={subscription.subPlans}> */}
            {/* <DataTable value={subPlansData}> */}
            <DataTable dir={textFormat} value={dataWeekdays}>
              <Column field="name" header="Weekday" />
              <Column
                field="breakfast"
                header="Breakfast"
                body={(rowData, rowIndex) =>
                  renderMealDropdown(rowData, rowIndex, "breakfast")
                }
              />
              <Column
                field="lunch"
                header="Lunch"
                body={(rowData, rowIndex) =>
                  renderMealDropdown(rowData, rowIndex, "lunch")
                }
              />
              <Column
                field="dinner"
                header="Dinner"
                body={(rowData, rowIndex) =>
                  renderMealDropdown(rowData, rowIndex, "dinner")
                }
              />
            </DataTable>
          </Dialog>

          <Dialog
            visible={deleteSubscriptionDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteSubscriptionDialogFooter}
            onHide={hideDeleteSubscriptionDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {subscription && (
                <span>
                  Are you sure you want to delete <b>Subscription record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteSubscriptionsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteSubscriptionsDialogFooter}
            onHide={hideDeleteSubscriptionsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {subscription && (
                <span>
                  Are you sure you want to delete the selected Subscription?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

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
