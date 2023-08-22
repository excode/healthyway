import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { Ingredient, IngredientService } from "@services/Ingredient";
import {
  Inventory,
  InventoryKey,
  InventoryQuery,
  InventoryService,
} from "@services/Inventory";
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

const InventoryPage = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const validation = [
    { id: "itemCode", type: validate.text, required: true },
    { id: "itemName", type: validate.text, max: 90, min: 0, required: false },
    { id: "quantity", type: validate.number, max: 4, min: 0, required: true },
    { id: "note", type: validate.text, max: 0, min: 0, required: false },
  ];
  let emptyInventory: Inventory = {
    itemCode: "",
    quantity: 0,
  };
  const [inventorys, setInventorys] = useState<Inventory[]>([]);
  const [backupInventorys, setBackupInventorys] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [deleteInventoryDialog, setDeleteInventoryDialog] = useState(false);
  const [deleteInventorysDialog, setDeleteInventorysDialog] = useState(false);
  const [inventory, setInventory] = useState<Inventory>(emptyInventory);
  const [selectedInventorys, setSelectedInventorys] = useState<Inventory[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Inventory[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const inventoryService = new InventoryService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const ingredientService = new IngredientService();
  const [sugingredients, setSugIngredients] = useState<Ingredient[]>([]);
  const { textFormat } = useContext(LangContext);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await inventoryService.getInventory({ limit: row });
      if (d.error == undefined) {
        setInventorys(d.docs);
        setBackupInventorys(d.docs);
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
      itemCode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      itemName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      quantity: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      note: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      createAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
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
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const searchIngredient = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataIngredient_ = await ingredientService.getIngredientSuggestions(
        e.query.trim()
      );
      setSugIngredients(dataIngredient_.data);
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

  const itemCodeFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchIngredient}
        suggestions={sugingredients}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a itemCode"
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
  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setInventory(emptyInventory);
    setSubmitted(false);
    setInventoryDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setInventoryDialog(false);
  };

  const hideDeleteInventoryDialog = () => {
    setDeleteInventoryDialog(false);
  };

  const hideDeleteInventorysDialog = () => {
    setDeleteInventorysDialog(false);
  };

  const saveInventory = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(inventory, validation);
    if (validationErrors.length == 0) {
      let _inventorys: Inventory[] = [...inventorys];
      let _inventory: Inventory = { ...inventory };
      if (inventory.id) {
        let d = await inventoryService.updateInventory(_inventory);
        if (d.error == undefined) {
          const index = _inventorys.findIndex((c) => c.id === inventory.id);
          if (index !== -1) {
            _inventorys[index] = { ..._inventory };
            // _inventorys[index] = _inventory;
            //_inventorys.splice(index, 1, {..._inventory,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Inventory Updated",
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
        let d = await inventoryService.addInventory(_inventory);
        if (d.error == undefined) {
          var newID = d.id;
          // _inventorys.unshift({..._inventory,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Inventory Updated",
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

      setInventorys(_inventorys);
      setBackupInventorys(_inventorys);
      setInventoryDialog(false);
      setInventory(emptyInventory);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editInventory = (inventory: Inventory) => {
    setInventory({ ...inventory });
    setInventoryDialog(true);
  };

  const confirmDeleteInventory = (inventory: Inventory) => {
    setInventory(inventory);
    setDeleteInventoryDialog(true);
  };

  const deleteInventory = async () => {
    let d = await inventoryService.deleteInventory(inventory.id ?? "");
    if (d.error == undefined) {
      let _inventorys = inventorys.filter((val) => val.id !== inventory.id);
      setInventorys(_inventorys);
      setBackupInventorys(_inventorys);
      setDeleteInventoryDialog(false);
      setInventory(emptyInventory);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Inventory Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Inventory Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteInventorysDialog(true);
  };

  const deleteSelectedInventorys = () => {
    let _inventorys = inventorys.filter(
      (val) => !selectedInventorys.includes(val)
    );
    setInventorys(_inventorys);
    setDeleteInventorysDialog(false);
    setSelectedInventorys([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Inventorys Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: InventoryKey) => {
    let val = (e.target && e.target.value) || "";
    let _inventory: Inventory = { ...inventory };
    _inventory[name] = val;
    setInventory(_inventory);
  };
  const onInputBooleanChange = (e: any, name: InventoryKey) => {
    let val = e.target.value;
    let _inventory: Inventory = { ...inventory };
    _inventory[name] = val;

    setInventory(_inventory);
  };
  const onInputChange = (e: any, name: InventoryKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = inventory[name];

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

    let _inventory: Inventory = { ...inventory };
    _inventory[name] = val;

    setInventory(_inventory);
  };

  const onInputNumberChange = (e: any, name: InventoryKey) => {
    let val = e.value || 0;
    let _inventory = { ...inventory };
    _inventory[name] = val;
    setInventory(_inventory);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: InventoryQuery = {};
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

    let d = await inventoryService.getInventory(searchObj);
    if (d.error == undefined) {
      setInventorys(d.docs);
      setBackupInventorys(d.docs);
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
      let _inventorys = [...inventorys];
      let filtered = _inventorys.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setInventorys(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setInventorys(backupInventorys);
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
            disabled={!selectedInventorys || !selectedInventorys.length}
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

  const actionBodyTemplate = (rowData: Inventory) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editInventory(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteInventory(rowData)}
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
      <h5 className="m-0">{t("MANAGE_INVENTORY")}</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: any) => localFilter(e.target.value)}
          placeholder={t("LOCAL_SEARCH")}
        />
      </span>
    </div>
  );

  const inventoryDialogFooter = (
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
        onClick={saveInventory}
      />
    </>
  );
  const deleteInventoryDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteInventoryDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteInventory}
      />
    </>
  );
  const deleteInventorysDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteInventorysDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedInventorys}
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
            value={inventorys}
            selection={selectedInventorys}
            onSelectionChange={(e) =>
              setSelectedInventorys(e.value as Inventory[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Inventorys"
            emptyMessage="No Inventorys found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="itemCode"
              header={t("ITEM_CODE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="itemCode"
              filter
              filterElement={itemCodeFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="itemName"
              header={t("ITEM_NAME")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by itemName"
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
              field="note"
              header={t("NOTES")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by note"
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
              field="createBy"
              header={t("CREATED_BY")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by createBy"
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={inventoryDialog}
            style={{ width: "450px" }}
            header={t("INVENTORY_DETAILS")}
            modal
            className="p-fluid"
            footer={inventoryDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="itemCode"> {t("ITEM_CODE")}</label>
                <AutoComplete
                  field="name"
                  id="itemCode"
                  multiple
                  completeMethod={searchIngredient}
                  value={inventory.itemCode}
                  suggestions={sugingredients}
                  onChange={(e) => onInputChange(e, "itemCode")}
                />
              </div>

              <div className="field">
                <label htmlFor="itemName"> {t("ITEM_NAME")}</label>
                <InputText
                  id="itemName"
                  value={inventory.itemName}
                  onChange={(e) => onInputChange(e, "itemName")}
                />
              </div>

              <div className="field">
                <label htmlFor="quantity"> {t("QUANTITY")}</label>
                <InputNumber
                  id="quantity"
                  value={inventory.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>

              <div className="field">
                <label htmlFor="note"> {t("NOTES")}</label>
                <InputText
                  id="note"
                  value={inventory.note}
                  onChange={(e) => onInputChange(e, "note")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteInventoryDialog}
            style={{ width: "450px" }}
            header={t("CONFIRM")}
            modal
            footer={deleteInventoryDialogFooter}
            onHide={hideDeleteInventoryDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {inventory && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")} <b>Inventory record</b>
                  ?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteInventorysDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteInventorysDialogFooter}
            onHide={hideDeleteInventorysDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {inventory && (
                <span>
                  Are you sure you want to delete the selected Inventory?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

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
