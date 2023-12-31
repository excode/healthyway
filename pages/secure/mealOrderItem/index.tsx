import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { MealItem, MealItemService } from "@services/MealItem";
import { MealOrder, MealOrderService } from "@services/MealOrder";
import {
  MealOrderItem,
  MealOrderItemKey,
  MealOrderItemQuery,
  MealOrderItemService,
} from "@services/MealOrderItem";
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
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MealOrderItemPage = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const validation = [
    { id: "quantity", type: validate.number, max: 30, min: 0, required: true },
    { id: "note", type: validate.text, max: 30, min: 0, required: false },
  ];
  let emptyMealOrderItem: MealOrderItem = {
    mealOrder: "",
    quantity: 0,
    mealItem: "",
    subTotal: 0,
  };
  const [mealOrderItems, setMealOrderItems] = useState<MealOrderItem[]>([]);
  const [backupMealOrderItems, setBackupMealOrderItems] = useState<
    MealOrderItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [mealOrderItemDialog, setMealOrderItemDialog] = useState(false);
  const [deleteMealOrderItemDialog, setDeleteMealOrderItemDialog] =
    useState(false);
  const [deleteMealOrderItemsDialog, setDeleteMealOrderItemsDialog] =
    useState(false);
  const [mealOrderItem, setMealOrderItem] =
    useState<MealOrderItem>(emptyMealOrderItem);
  const [selectedMealOrderItems, setSelectedMealOrderItems] = useState<
    MealOrderItem[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MealOrderItem[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const mealorderitemService = new MealOrderItemService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const mealorderService = new MealOrderService();
  const [sugmealOrders, setSugMealOrders] = useState<MealOrder[]>([]);

  const mealitemService = new MealItemService();
  const [sugmealItems, setSugMealItems] = useState<MealItem[]>([]);
  const { textFormat } = useContext(LangContext);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await mealorderitemService.getMealOrderItem({ limit: row });
      if (d.error == undefined) {
        setMealOrderItems(d.docs);
        setBackupMealOrderItems(d.docs);
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
      mealOrder: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      quantity: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      mealItem: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      note: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      subTotal: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const searchMealOrder = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataMealOrder_ = await mealorderService.getMealOrderSuggestions(
        e.query.trim()
      );
      setSugMealOrders(dataMealOrder_.data);
    }
  };

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

  const mealOrderFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="invoiceNo"
        value={options.value}
        completeMethod={searchMealOrder}
        suggestions={sugmealOrders}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a mealOrder"
        className="p-column-filter"
      />
    );
  };

  const quantityFilterTemplate = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
      />
    );
  };
  const mealItemFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchMealItem}
        suggestions={sugmealItems}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a mealItem"
        className="p-column-filter"
      />
    );
  };

  const subTotalFilterTemplate = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
      />
    );
  };
  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setMealOrderItem(emptyMealOrderItem);
    setSubmitted(false);
    setMealOrderItemDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMealOrderItemDialog(false);
  };

  const hideDeleteMealOrderItemDialog = () => {
    setDeleteMealOrderItemDialog(false);
  };

  const hideDeleteMealOrderItemsDialog = () => {
    setDeleteMealOrderItemsDialog(false);
  };

  const saveMealOrderItem = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(mealOrderItem, validation);
    if (validationErrors.length == 0) {
      let _mealOrderItems: MealOrderItem[] = [...mealOrderItems];
      let _mealOrderItem: MealOrderItem = { ...mealOrderItem };
      if (mealOrderItem.id) {
        let d = await mealorderitemService.updateMealOrderItem(_mealOrderItem);
        if (d.error == undefined) {
          const index = _mealOrderItems.findIndex(
            (c) => c.id === mealOrderItem.id
          );
          if (index !== -1) {
            _mealOrderItems[index] = { ..._mealOrderItem };
            // _mealOrderItems[index] = _mealOrderItem;
            //_mealOrderItems.splice(index, 1, {..._mealOrderItem,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealOrderItem Updated",
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
        let d = await mealorderitemService.addMealOrderItem(_mealOrderItem);
        if (d.error == undefined) {
          var newID = d.id;
          // _mealOrderItems.unshift({..._mealOrderItem,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealOrderItem Updated",
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

      setMealOrderItems(_mealOrderItems);
      setBackupMealOrderItems(_mealOrderItems);
      setMealOrderItemDialog(false);
      setMealOrderItem(emptyMealOrderItem);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editMealOrderItem = (mealOrderItem: MealOrderItem) => {
    setMealOrderItem({ ...mealOrderItem });
    setMealOrderItemDialog(true);
  };

  const confirmDeleteMealOrderItem = (mealOrderItem: MealOrderItem) => {
    setMealOrderItem(mealOrderItem);
    setDeleteMealOrderItemDialog(true);
  };

  const deleteMealOrderItem = async () => {
    let d = await mealorderitemService.deleteMealOrderItem(
      mealOrderItem.id ?? ""
    );
    if (d.error == undefined) {
      let _mealOrderItems = mealOrderItems.filter(
        (val) => val.id !== mealOrderItem.id
      );
      setMealOrderItems(_mealOrderItems);
      setBackupMealOrderItems(_mealOrderItems);
      setDeleteMealOrderItemDialog(false);
      setMealOrderItem(emptyMealOrderItem);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "MealOrderItem Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealOrderItem Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteMealOrderItemsDialog(true);
  };

  const deleteSelectedMealOrderItems = () => {
    let _mealOrderItems = mealOrderItems.filter(
      (val) => !selectedMealOrderItems.includes(val)
    );
    setMealOrderItems(_mealOrderItems);
    setDeleteMealOrderItemsDialog(false);
    setSelectedMealOrderItems([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "MealOrderItems Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: MealOrderItemKey) => {
    let val = (e.target && e.target.value) || "";
    let _mealOrderItem: MealOrderItem = { ...mealOrderItem };
    _mealOrderItem[name] = val;
    setMealOrderItem(_mealOrderItem);
  };
  const onInputBooleanChange = (e: any, name: MealOrderItemKey) => {
    let val = e.target.value;
    let _mealOrderItem: MealOrderItem = { ...mealOrderItem };
    _mealOrderItem[name] = val;

    setMealOrderItem(_mealOrderItem);
  };
  const onInputChange = (e: any, name: MealOrderItemKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = mealOrderItem[name];

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

    let _mealOrderItem: MealOrderItem = { ...mealOrderItem };
    _mealOrderItem[name] = val;

    setMealOrderItem(_mealOrderItem);
  };

  const onInputNumberChange = (e: any, name: MealOrderItemKey) => {
    let val = e.value || 0;
    let _mealOrderItem = { ...mealOrderItem };
    _mealOrderItem[name] = val;

    setMealOrderItem(_mealOrderItem);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: MealOrderItemQuery = {};
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

    let d = await mealorderitemService.getMealOrderItem(searchObj);
    if (d.error == undefined) {
      setMealOrderItems(d.docs);
      setBackupMealOrderItems(d.docs);
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
      let _mealOrderItems = [...mealOrderItems];
      let filtered = _mealOrderItems.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setMealOrderItems(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setMealOrderItems(backupMealOrderItems);
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
            disabled={!selectedMealOrderItems || !selectedMealOrderItems.length}
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

  const actionBodyTemplate = (rowData: MealOrderItem) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editMealOrderItem(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteMealOrderItem(rowData)}
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
      <h5 className="m-0">{t("MANAGE_MEAL_ORDER_ITEMS")}</h5>
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

  const mealOrderItemDialogFooter = (
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
        onClick={saveMealOrderItem}
      />
    </>
  );
  const deleteMealOrderItemDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealOrderItemDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteMealOrderItem}
      />
    </>
  );
  const deleteMealOrderItemsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealOrderItemsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMealOrderItems}
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
            value={mealOrderItems}
            selection={selectedMealOrderItems}
            onSelectionChange={(e) =>
              setSelectedMealOrderItems(e.value as MealOrderItem[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealOrderItems"
            emptyMessage="No MealOrderItems found."
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
              header={t("CREATED_BY")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by createBy"
            ></Column>

            <Column
              showAddButton={false}
              field="createAt"
              header={t("CREATED_AT")}
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
              header={t("UPDATE_BY")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by updateBy"
            ></Column>

            <Column
              showAddButton={false}
              field="updateAt"
              header={t("UPDATED_AT")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="updateAt"
              dataType="date"
              filter
              filterElement={updateAtFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="mealOrder"
              header={t("MEAL_ORDER_NO")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="mealOrder"
              filter
              filterElement={mealOrderFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="quantity"
              header={t("QUANTITY")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              dataType="numeric"
              filter
              filterElement={quantityFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="mealItem"
              header={t("MEAL_ITEMS")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="mealItem"
              filter
              filterElement={mealItemFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="code"
              header={t("CODE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by code"
            ></Column>

            <Column
              showAddButton={false}
              field="note"
              header={t("SPECIAL_NOTE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by note"
            ></Column>

            <Column
              showAddButton={false}
              field="subTotal"
              header={t("SUB_TOTAL")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              dataType="numeric"
              filter
              filterElement={subTotalFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="kitchen"
              header={t("KITCHEN")}
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
            visible={mealOrderItemDialog}
            style={{ width: "450px" }}
            header={t("MEAL_ORDER_ITEM")}
            modal
            className="p-fluid"
            footer={mealOrderItemDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="quantity"> {t("QUANTITY")}</label>
                <InputNumber
                  id="quantity"
                  value={mealOrderItem.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>

              <div className="field">
                <label htmlFor="note"> {t("SPECIAL_NOTE")}</label>
                <InputText
                  id="note"
                  value={mealOrderItem.note}
                  onChange={(e) => onInputChange(e, "note")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealOrderItemDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealOrderItemDialogFooter}
            onHide={hideDeleteMealOrderItemDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealOrderItem && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                  <b>MealOrderItem record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealOrderItemsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealOrderItemsDialogFooter}
            onHide={hideDeleteMealOrderItemsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealOrderItem && (
                <span>
                  Are you sure you want to delete the selected MealOrderItem?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MealOrderItemPage;

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
