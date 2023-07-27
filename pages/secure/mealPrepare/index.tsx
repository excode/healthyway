import { validate, validateForm } from "@lib/validation";
import { Chef, ChefService } from "@services/Chef";
import { SortType } from "@services/CommonTypes";
import { MealOrder, MealOrderService } from "@services/MealOrder";
import {
  MealPrepare,
  MealPrepareKey,
  MealPrepareQuery,
  MealPrepareService,
} from "@services/MealPrepare";
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

const MealPreparePage = () => {
  const { asPath } = useRouter();
  const validation = [
    { id: "chefId", type: validate.text, required: true },
    { id: "orderId", type: validate.text, required: true },
    {
      id: "startTime",
      type: validate.datetime,
      max: 0,
      min: 0,
      required: true,
    },
    { id: "endTime", type: validate.datetime, max: 0, min: 0, required: true },
    { id: "status", type: validate.text, required: true },
    {
      id: "deliveryTime",
      type: validate.datetime,
      max: 0,
      min: 0,
      required: true,
    },
  ];
  let emptyMealPrepare: MealPrepare = {
    chefId: "",
    orderId: "",
    startTime: new Date(),
    endTime: new Date(),
    status: "",
    deliveryTime: new Date(),
  };
  const [mealPrepares, setMealPrepares] = useState<MealPrepare[]>([]);
  const [backupMealPrepares, setBackupMealPrepares] = useState<MealPrepare[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [mealPrepareDialog, setMealPrepareDialog] = useState(false);
  const [deleteMealPrepareDialog, setDeleteMealPrepareDialog] = useState(false);
  const [deleteMealPreparesDialog, setDeleteMealPreparesDialog] =
    useState(false);
  const [mealPrepare, setMealPrepare] = useState<MealPrepare>(emptyMealPrepare);
  const [selectedMealPrepares, setSelectedMealPrepares] = useState<
    MealPrepare[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MealPrepare[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const mealprepareService = new MealPrepareService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());
  const { textFormat } = useContext(LangContext);

  const chefService = new ChefService();
  const [sugchefs, setSugChefs] = useState<Chef[]>([]);

  const mealorderService = new MealOrderService();
  const [sugmealOrders, setSugMealOrders] = useState<MealOrder[]>([]);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await mealprepareService.getMealPrepare({ limit: row });
      if (d.error == undefined) {
        setMealPrepares(d.docs);
        setBackupMealPrepares(d.docs);
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
      chefId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      orderId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      startTime: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      endTime: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      deliveryTime: {
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

  const searchMealOrder = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataMealOrder_ = await mealorderService.getMealOrderSuggestions(
        e.query.trim()
      );
      setSugMealOrders(dataMealOrder_.data);
    }
  };

  const datastatuss = [
    { value: "Pending", name: "Pending" },
    { value: " Running", name: " Running" },
    { value: "Completed", name: "Completed" },
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

  const orderIdFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="invoiceNo"
        value={options.value}
        completeMethod={searchMealOrder}
        suggestions={sugmealOrders}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a orderId"
        className="p-column-filter"
      />
    );
  };

  const startTimeFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const endTimeFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
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
  const deliveryTimeFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setMealPrepare(emptyMealPrepare);
    setSubmitted(false);
    setMealPrepareDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMealPrepareDialog(false);
  };

  const hideDeleteMealPrepareDialog = () => {
    setDeleteMealPrepareDialog(false);
  };

  const hideDeleteMealPreparesDialog = () => {
    setDeleteMealPreparesDialog(false);
  };

  const saveMealPrepare = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(mealPrepare, validation);
    if (validationErrors.length == 0) {
      let _mealPrepares: MealPrepare[] = [...mealPrepares];
      let _mealPrepare: MealPrepare = { ...mealPrepare };
      if (mealPrepare.id) {
        let d = await mealprepareService.updateMealPrepare(_mealPrepare);
        if (d.error == undefined) {
          const index = _mealPrepares.findIndex((c) => c.id === mealPrepare.id);
          if (index !== -1) {
            _mealPrepares[index] = { ..._mealPrepare };
            // _mealPrepares[index] = _mealPrepare;
            //_mealPrepares.splice(index, 1, {..._mealPrepare,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealPrepare Updated",
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
        let d = await mealprepareService.addMealPrepare(_mealPrepare);
        if (d.error == undefined) {
          var newID = d.id;
          // _mealPrepares.unshift({..._mealPrepare,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealPrepare Updated",
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

      setMealPrepares(_mealPrepares);
      setBackupMealPrepares(_mealPrepares);
      setMealPrepareDialog(false);
      setMealPrepare(emptyMealPrepare);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editMealPrepare = (mealPrepare: MealPrepare) => {
    setMealPrepare({ ...mealPrepare });
    setMealPrepareDialog(true);
  };

  const confirmDeleteMealPrepare = (mealPrepare: MealPrepare) => {
    setMealPrepare(mealPrepare);
    setDeleteMealPrepareDialog(true);
  };

  const deleteMealPrepare = async () => {
    let d = await mealprepareService.deleteMealPrepare(mealPrepare.id ?? "");
    if (d.error == undefined) {
      let _mealPrepares = mealPrepares.filter(
        (val) => val.id !== mealPrepare.id
      );
      setMealPrepares(_mealPrepares);
      setBackupMealPrepares(_mealPrepares);
      setDeleteMealPrepareDialog(false);
      setMealPrepare(emptyMealPrepare);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "MealPrepare Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealPrepare Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteMealPreparesDialog(true);
  };

  const deleteSelectedMealPrepares = () => {
    let _mealPrepares = mealPrepares.filter(
      (val) => !selectedMealPrepares.includes(val)
    );
    setMealPrepares(_mealPrepares);
    setDeleteMealPreparesDialog(false);
    setSelectedMealPrepares([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "MealPrepares Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: MealPrepareKey) => {
    let val = (e.target && e.target.value) || "";
    let _mealPrepare: MealPrepare = { ...mealPrepare };
    _mealPrepare[name] = val;
    setMealPrepare(_mealPrepare);
  };
  const onInputBooleanChange = (e: any, name: MealPrepareKey) => {
    let val = e.target.value;
    let _mealPrepare: MealPrepare = { ...mealPrepare };
    _mealPrepare[name] = val;

    setMealPrepare(_mealPrepare);
  };
  const onInputChange = (e: any, name: MealPrepareKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = mealPrepare[name];

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

    let _mealPrepare: MealPrepare = { ...mealPrepare };
    _mealPrepare[name] = val;

    setMealPrepare(_mealPrepare);
  };

  const onInputNumberChange = (e: any, name: MealPrepareKey) => {
    let val = e.value || 0;
    let _mealPrepare = { ...mealPrepare };
    _mealPrepare[name] = val;

    setMealPrepare(_mealPrepare);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: MealPrepareQuery = {};
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

    let d = await mealprepareService.getMealPrepare(searchObj);
    if (d.error == undefined) {
      setMealPrepares(d.docs);
      setBackupMealPrepares(d.docs);
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
      let _mealPrepares = [...mealPrepares];
      let filtered = _mealPrepares.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setMealPrepares(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setMealPrepares(backupMealPrepares);
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
            disabled={!selectedMealPrepares || !selectedMealPrepares.length}
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

  const actionBodyTemplate = (rowData: MealPrepare) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editMealPrepare(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteMealPrepare(rowData)}
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
      <h5 className="m-0">Manage MealPrepares</h5>
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

  const mealPrepareDialogFooter = (
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
        onClick={saveMealPrepare}
      />
    </>
  );
  const deleteMealPrepareDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealPrepareDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteMealPrepare}
      />
    </>
  );
  const deleteMealPreparesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealPreparesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMealPrepares}
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
            value={mealPrepares}
            selection={selectedMealPrepares}
            onSelectionChange={(e) =>
              setSelectedMealPrepares(e.value as MealPrepare[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealPrepares"
            emptyMessage="No MealPrepares found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
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
              showAddButton={false}
              field="updateBy"
              header="Update By"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by updateBy"
            ></Column>

            <Column
              showAddButton={false}
              field="updateAt"
              header="Update At"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="updateAt"
              dataType="date"
              filter
              filterElement={updateAtFilterTemplate}
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
              field="orderId"
              header="orderId"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="orderId"
              filter
              filterElement={orderIdFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="startTime"
              header="startTime"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="startTime"
              dataType="date"
              filter
              filterElement={startTimeFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="endTime"
              header="endTime"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="endTime"
              dataType="date"
              filter
              filterElement={endTimeFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="status"
              header="status"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="status"
              filter
              filterElement={statusFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="deliveryTime"
              header="Delivery Time"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="deliveryTime"
              dataType="date"
              filter
              filterElement={deliveryTimeFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="kitchen"
              header="Kitchen"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by kitchen"
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={mealPrepareDialog}
            style={{ width: "450px" }}
            header="MealPrepare Details"
            modal
            className="p-fluid"
            footer={mealPrepareDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="chefId">chefId</label>
                <AutoComplete
                  field="name"
                  id="chefId"
                  completeMethod={searchChef}
                  value={mealPrepare.chefId}
                  suggestions={sugchefs}
                  onChange={(e) => onInputChange(e, "chefId")}
                />
              </div>

              <div className="field">
                <label htmlFor="orderId">orderId</label>
                <AutoComplete
                  field="invoiceNo"
                  id="orderId"
                  completeMethod={searchMealOrder}
                  value={mealPrepare.orderId}
                  suggestions={sugmealOrders}
                  onChange={(e) => onInputChange(e, "orderId")}
                />
              </div>

              <div className="field">
                <label htmlFor="startTime">startTime</label>
                <Calendar
                  id="startTime"
                  value={
                    mealPrepare.startTime
                      ? new Date(mealPrepare.startTime)
                      : null
                  }
                  onChange={(e) => onInputChange(e, "startTime")}
                  showTime
                  hourFormat="12"
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealPrepare.startTime,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="endTime">endTime</label>
                <Calendar
                  id="endTime"
                  value={
                    mealPrepare.endTime ? new Date(mealPrepare.endTime) : null
                  }
                  onChange={(e) => onInputChange(e, "endTime")}
                  showTime
                  hourFormat="12"
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealPrepare.endTime,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="status">status</label>
                <Dropdown
                  id="status"
                  optionLabel="name"
                  value={mealPrepare.status}
                  options={datastatuss}
                  onChange={(e) => onInputChange(e, "status")}
                />
              </div>

              <div className="field">
                <label htmlFor="deliveryTime">Delivery Time</label>
                <Calendar
                  id="deliveryTime"
                  value={
                    mealPrepare.deliveryTime
                      ? new Date(mealPrepare.deliveryTime)
                      : null
                  }
                  onChange={(e) => onInputChange(e, "deliveryTime")}
                  showTime
                  hourFormat="12"
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealPrepare.deliveryTime,
                  })}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealPrepareDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealPrepareDialogFooter}
            onHide={hideDeleteMealPrepareDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealPrepare && (
                <span>
                  Are you sure you want to delete <b>MealPrepare record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealPreparesDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealPreparesDialogFooter}
            onHide={hideDeleteMealPreparesDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealPrepare && (
                <span>
                  Are you sure you want to delete the selected MealPrepare?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MealPreparePage;

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
