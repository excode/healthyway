import config from "@config/index";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import {
  MealItem,
  MealItemKey,
  MealItemQuery,
  MealItemService,
} from "@services/MealItem";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
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
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

import CustomFileUpload from "@layout/fileUpload";
import { UploadInfo } from "@services/UploadInfo";
import { Image } from "primereact/image";

import { Kitchen, KitchenService } from "@services/Kitchen";
import { MealGroup, MealGroupService } from "@services/MealGroup";

const MealItemPage = () => {
  const { asPath } = useRouter();
  const validation = [
    { id: "groupName", type: validate.text, required: true },
    { id: "name", type: validate.text, max: 20, min: 0, required: true },
    { id: "code", type: validate.text, max: 20, min: 2, required: true },
    { id: "weekdays", type: validate.array, required: true },
    { id: "mealType", type: validate.array, required: true },
    {
      id: "description",
      type: validate.text,
      max: 200,
      min: 0,
      required: true,
    },
    { id: "price", type: validate.number, max: 5, min: 0, required: true },
    { id: "active", type: validate.boolean, required: true },
  ];
  let emptyMealItem: MealItem = {
    name: "",
    price: 0,
    groupName: "",
    code: "",
    weekdays: [],
    active: false,
    mealType: [],
    kitchen: "",
  };
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [backupMealItems, setBackupMealItems] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mealItemDialog, setMealItemDialog] = useState(false);
  const [deleteMealItemDialog, setDeleteMealItemDialog] = useState(false);
  const [deleteMealItemsDialog, setDeleteMealItemsDialog] = useState(false);
  const [mealItem, setMealItem] = useState<MealItem>(emptyMealItem);
  const [selectedMealItems, setSelectedMealItems] = useState<MealItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MealItem[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const mealitemService = new MealItemService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [currentImage, setCurrentImage] = useState("");
  const mealgroupService = new MealGroupService();
  const [datamealGroups, setDataMealGroups] = useState<MealGroup[]>([]);
  const kitchenService = new KitchenService();
  const [datakitchens, setDataKitchens] = useState<Kitchen[]>([]);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await mealitemService.getMealItem({ limit: row });
      if (d.error == undefined) {
        setMealItems(d.docs);
        setBackupMealItems(d.docs);
        setLoading(false);
        setTotalRecords(d.count);

        let dataMealGroups_ = await mealgroupService.getMealGroupAll({});
        setDataMealGroups(dataMealGroups_.data);

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

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      groupName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      description: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      price: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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
      weekdays: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      active: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      mealType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
  };

  const imageBodyTemplate = (rowData: MealItem) => {
    let imageURL = config.serverURI + "/" + rowData.image;
    let fileURL = "/file_icon.png";
    let fileNoURL = "/file_icon_na.png";
    let contetnt;

    let acceptFile = "images/*";
    if (rowData.image != undefined && rowData.image != "") {
      contetnt = (
        <Image
          onError={(e: any) => defaultImage(e)}
          onMouseOver={(e: any) => setCurrentImage(rowData.id ?? "")}
          src={imageURL}
          alt="image"
          preview
          downloadable
          width="50"
        />
      );
    } else if (rowData.image == undefined || rowData.image == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(rowData.id ?? "")}
          src="/photo_na.png"
          alt="image"
          width="100"
        />
      );
    }
    return (
      <>
        <div className="card flex justify-content-center">{contetnt}</div>

        {currentImage == rowData.id && (
          <Button
            icon="pi pi-upload"
            severity="secondary"
            onClick={(e) => showUploadDialog(rowData, "image", acceptFile)}
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

  const dataweekdayss = [
    { value: "Sunday", name: "Sunday" },
    { value: "Monday", name: "Monday" },
    { value: "Tuesday", name: "Tuesday" },
    { value: "Wednesday", name: "Wednesday" },
    { value: "Thursday", name: "Thursday" },
    { value: "Friday", name: "Friday" },
    { value: "Saturday", name: "Saturday" },
  ];

  const datamealTypes = [
    { value: "Lunch", name: "Lunch" },
    { value: "Dinner", name: "Dinner" },
    { value: "Breakfast", name: "Breakfast" },
  ];

  const downloadFile = (data: MealItem, dbColName: MealItemKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: MealItemKey
  ) => {
    let _mealItem = { ...mealItem, [colName]: newUploadedFileName };
    let _mealItems = [...mealItems];
    const index = _mealItems.findIndex((c) => c.id === mealItem.id);
    if (index !== -1) {
      _mealItems[index] = _mealItem;
    }
    setMealItem(_mealItem);
    setMealItems(_mealItems);
  };
  const showUploadDialog = (
    mealItem: MealItem,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setMealItem({ ...mealItem });
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

  const priceFilterTemplate = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
      />
    );
  };
  const groupNameFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">GroupName Picker</div>
        <Dropdown
          value={options.value}
          options={datamealGroups}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="name"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };
  const weekdaysFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">Weekdays Picker</div>
        <MultiSelect
          value={options.value}
          options={dataweekdayss}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="Week Days"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };

  const activeFilterTemplate = (options: any) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterCallback(e.value)}
      />
    );
  };

  const mealTypeFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">MealType Picker</div>
        <MultiSelect
          value={options.value}
          options={datamealTypes}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="Meal type"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
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
    setMealItem(emptyMealItem);
    setSubmitted(false);
    setMealItemDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMealItemDialog(false);
  };

  const hideDeleteMealItemDialog = () => {
    setDeleteMealItemDialog(false);
  };

  const hideDeleteMealItemsDialog = () => {
    setDeleteMealItemsDialog(false);
  };

  const saveMealItem = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(mealItem, validation);
    if (validationErrors.length == 0) {
      let _mealItems: MealItem[] = [...mealItems];
      let _mealItem: MealItem = { ...mealItem };
      if (mealItem.id) {
        let d = await mealitemService.updateMealItem(_mealItem);
        if (d.error == undefined) {
          const index = _mealItems.findIndex((c) => c.id === mealItem.id);
          if (index !== -1) {
            _mealItems[index] = { ..._mealItem };
            // _mealItems[index] = _mealItem;
            //_mealItems.splice(index, 1, {..._mealItem,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealItem Updated",
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
        let d = await mealitemService.addMealItem(_mealItem);
        if (d.error == undefined) {
          var newID = d.id;
          // _mealItems.unshift({..._mealItem,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealItem Updated",
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

      setMealItems(_mealItems);
      setBackupMealItems(_mealItems);
      setMealItemDialog(false);
      setMealItem(emptyMealItem);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editMealItem = (mealItem: MealItem) => {
    setMealItem({ ...mealItem });
    setMealItemDialog(true);
  };

  const confirmDeleteMealItem = (mealItem: MealItem) => {
    setMealItem(mealItem);
    setDeleteMealItemDialog(true);
  };

  const deleteMealItem = async () => {
    let d = await mealitemService.deleteMealItem(mealItem.id ?? "");
    if (d.error == undefined) {
      let _mealItems = mealItems.filter((val) => val.id !== mealItem.id);
      setMealItems(_mealItems);
      setBackupMealItems(_mealItems);
      setDeleteMealItemDialog(false);
      setMealItem(emptyMealItem);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "MealItem Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealItem Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteMealItemsDialog(true);
  };

  const deleteSelectedMealItems = () => {
    let _mealItems = mealItems.filter(
      (val) => !selectedMealItems.includes(val)
    );
    setMealItems(_mealItems);
    setDeleteMealItemsDialog(false);
    setSelectedMealItems([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "MealItems Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: MealItemKey) => {
    let val = (e.target && e.target.value) || "";
    let _mealItem: MealItem = { ...mealItem };
    _mealItem[name] = val;
    setMealItem(_mealItem);
  };
  const onInputBooleanChange = (e: any, name: MealItemKey) => {
    let val = e.target.value;
    let _mealItem: MealItem = { ...mealItem };
    _mealItem[name] = val;

    setMealItem(_mealItem);
  };
  const onInputChange = (e: any, name: MealItemKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = mealItem[name];

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

    let _mealItem: MealItem = { ...mealItem };
    _mealItem[name] = val;

    setMealItem(_mealItem);
  };

  const onInputNumberChange = (e: any, name: MealItemKey) => {
    let val = e.value || 0;
    let _mealItem = { ...mealItem };
    _mealItem[name] = val;

    setMealItem(_mealItem);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: MealItemQuery = {};
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

    let d = await mealitemService.getMealItem(searchObj);
    if (d.error == undefined) {
      setMealItems(d.docs);
      setBackupMealItems(d.docs);
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
      let _mealItems = [...mealItems];
      let filtered = _mealItems.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setMealItems(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setMealItems(backupMealItems);
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
            disabled={!selectedMealItems || !selectedMealItems.length}
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

  const actionBodyTemplate = (rowData: MealItem) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editMealItem(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteMealItem(rowData)}
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
      <h5 className="m-0">Manage MealItems</h5>
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

  const mealItemDialogFooter = (
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
        onClick={saveMealItem}
      />
    </>
  );
  const deleteMealItemDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealItemDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteMealItem}
      />
    </>
  );
  const deleteMealItemsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealItemsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMealItems}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={mealItems}
            selection={selectedMealItems}
            onSelectionChange={(e) =>
              setSelectedMealItems(e.value as MealItem[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealItems"
            emptyMessage="No MealItems found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="image"
              header="image"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              body={imageBodyTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="groupName"
              header="Group Name"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="groupName"
              filter
              filterElement={groupNameFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="name"
              header="name"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by name"
            ></Column>

            <Column
              showAddButton={false}
              field="description"
              header="description"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by description"
            ></Column>

            <Column
              showAddButton={false}
              field="price"
              header="price"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              dataType="numeric"
              filter
              filterElement={priceFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="code"
              header="Code"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by code"
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
            visible={mealItemDialog}
            style={{ width: "450px" }}
            header="MealItem Details"
            modal
            className="p-fluid"
            footer={mealItemDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label className="font-bold" htmlFor="groupName">
                Group Name
              </label>
              <Dropdown
                id="groupName"
                optionLabel="name"
                optionValue="name"
                value={mealItem.groupName}
                options={datamealGroups}
                onChange={(e) => onInputChange(e, "groupName")}
              />
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="name">
                Name
              </label>
              <InputText
                id="name"
                value={mealItem.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                className={classNames({
                  "p-invalid": submitted && !mealItem.name,
                })}
              />
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="code">
                Code
              </label>
              <InputText
                id="code"
                value={mealItem.code}
                onChange={(e) => onInputChange(e, "code")}
                required
                className={classNames({
                  "p-invalid": submitted && !mealItem.code,
                })}
              />
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="weekdays">
                Week Days
              </label>
              <div className="">
                <div className="grid gap-3 mt-3">
                  {dataweekdayss.map((item) => {
                    return (
                      <div key={item.value} className="flex align-items-center">
                        <div className="flex align-items-center">
                          <Checkbox
                            inputId={item.value}
                            name="weekdays"
                            value={item}
                            onChange={(e) => onInputChange(e, "weekdays")}
                            checked={mealItem.weekdays.some(
                              (i: any) => i === item.value
                            )}
                          />
                          <label htmlFor={item.value} className="ml-2">
                            {item.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="mealType ">
                Meal type
              </label>
              <div className="flex gap-3 mt-2">
                {datamealTypes.map((item) => {
                  return (
                    <div
                      key={item.value}
                      className="flex gap-1 mb-1 align-items-center"
                    >
                      <Checkbox
                        inputId={item.value}
                        name="mealType"
                        value={item}
                        onChange={(e) => onInputChange(e, "mealType")}
                        checked={mealItem.mealType.some(
                          (i: any) => i === item.value
                        )}
                      />
                      <label htmlFor={item.value} className="ml-0">
                        {item.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="description">
                Description
              </label>
              <InputTextarea
                id="description"
                value={mealItem.description}
                onChange={(e) => onInputChange(e, "description")}
                rows={5}
                cols={30}
                required
                className={classNames({
                  "p-invalid": submitted && !mealItem.description,
                })}
              />
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="price">
                Price
              </label>
              <InputNumber
                id="price"
                value={mealItem.price}
                onValueChange={(e) => onInputNumberChange(e, "price")}
              />
            </div>

            <div className="field">
              <label className="font-bold" htmlFor="active">
                Active
              </label>
              <TriStateCheckbox
                name="active"
                id="active"
                value={mealItem.active}
                onChange={(e) => onInputBooleanChange(e, "active")}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealItemDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealItemDialogFooter}
            onHide={hideDeleteMealItemDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealItem && (
                <span>
                  Are you sure you want to delete <b>MealItem record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealItemsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealItemsDialogFooter}
            onHide={hideDeleteMealItemsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealItem && (
                <span>
                  Are you sure you want to delete the selected MealItem?
                </span>
              )}
            </div>
          </Dialog>

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
                  updateFileName(e, uploadInfo?.dbColName as keyof MealItem)
                }
                url={uploadInfo?.url}
                table="mealItem"
                tableId={mealItem.id}
                maxFileSize={1000000}
                accept={uploadInfo?.accept}
                fieldName="uploadFile"
                dbColName={uploadInfo?.dbColName}
              />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MealItemPage;
