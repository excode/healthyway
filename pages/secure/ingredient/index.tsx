import config from "@config/index";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import {
  Ingredient,
  IngredientKey,
  IngredientQuery,
  IngredientService,
} from "@services/Ingredient";
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
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";

import CustomFileUpload from "@layout/fileUpload";
import { UploadInfo } from "@services/UploadInfo";
import { LangContext } from "hooks/lan";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Image } from "primereact/image";
import { useTranslation } from "react-i18next";

const IngredientPage = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const validation = [
    { id: "name", type: validate.text, max: 30, min: 3, required: true },
    { id: "itemCode", type: validate.text, max: 90, min: 0, required: true },
    { id: "unit", type: validate.text, max: 0, min: 0, required: true },
    {
      id: "description",
      type: validate.text,
      max: 90,
      min: 0,
      required: false,
    },
  ];
  let emptyIngredient: Ingredient = {
    name: "",
    unit: "",
    itemCode: "",
  };
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [backupIngredients, setBackupIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingredientDialog, setIngredientDialog] = useState(false);
  const [deleteIngredientDialog, setDeleteIngredientDialog] = useState(false);
  const [deleteIngredientsDialog, setDeleteIngredientsDialog] = useState(false);
  const [ingredient, setIngredient] = useState<Ingredient>(emptyIngredient);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Ingredient[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const ingredientService = new IngredientService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [currentImage, setCurrentImage] = useState("");
  const { textFormat } = useContext(LangContext);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await ingredientService.getIngredient({ limit: row });
      if (d.error == undefined) {
        setIngredients(d.docs);
        setBackupIngredients(d.docs);
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
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      itemCode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      unit: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      description: {
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
    });
  };

  const imageBodyTemplate = (rowData: Ingredient) => {
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
          width="250"
        />
      );
    } else if (rowData.image == undefined || rowData.image == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(rowData.id ?? "")}
          src="/photo_na.png"
          alt="image"
          width="250"
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

  const downloadFile = (data: Ingredient, dbColName: IngredientKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: IngredientKey
  ) => {
    let _ingredient = { ...ingredient, [colName]: newUploadedFileName };
    let _ingredients = [...ingredients];
    const index = _ingredients.findIndex((c) => c.id === ingredient.id);
    if (index !== -1) {
      _ingredients[index] = _ingredient;
    }
    setIngredient(_ingredient);
    setIngredients(_ingredients);
  };
  const showUploadDialog = (
    ingredient: Ingredient,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setIngredient({ ...ingredient });
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

  const defaultImage = (e: any) => {
    e.target.src = "/photo_na.png";
  };
  const openNew = () => {
    setIngredient(emptyIngredient);
    setSubmitted(false);
    setIngredientDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setIngredientDialog(false);
  };

  const hideDeleteIngredientDialog = () => {
    setDeleteIngredientDialog(false);
  };

  const hideDeleteIngredientsDialog = () => {
    setDeleteIngredientsDialog(false);
  };

  const saveIngredient = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(ingredient, validation);
    if (validationErrors.length == 0) {
      let _ingredients: Ingredient[] = [...ingredients];
      let _ingredient: Ingredient = { ...ingredient };
      if (ingredient.id) {
        let d = await ingredientService.updateIngredient(_ingredient);
        if (d.error == undefined) {
          const index = _ingredients.findIndex((c) => c.id === ingredient.id);
          if (index !== -1) {
            _ingredients[index] = { ..._ingredient };
            // _ingredients[index] = _ingredient;
            //_ingredients.splice(index, 1, {..._ingredient,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Ingredient Updated",
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
        let d = await ingredientService.addIngredient(_ingredient);
        if (d.error == undefined) {
          var newID = d.id;
          // _ingredients.unshift({..._ingredient,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Ingredient Updated",
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

      setIngredients(_ingredients);
      setBackupIngredients(_ingredients);
      setIngredientDialog(false);
      setIngredient(emptyIngredient);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editIngredient = (ingredient: Ingredient) => {
    setIngredient({ ...ingredient });
    setIngredientDialog(true);
  };

  const confirmDeleteIngredient = (ingredient: Ingredient) => {
    setIngredient(ingredient);
    setDeleteIngredientDialog(true);
  };

  const deleteIngredient = async () => {
    let d = await ingredientService.deleteIngredient(ingredient.id ?? "");
    if (d.error == undefined) {
      let _ingredients = ingredients.filter((val) => val.id !== ingredient.id);
      setIngredients(_ingredients);
      setBackupIngredients(_ingredients);
      setDeleteIngredientDialog(false);
      setIngredient(emptyIngredient);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Ingredient Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingredient Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteIngredientsDialog(true);
  };

  const deleteSelectedIngredients = () => {
    let _ingredients = ingredients.filter(
      (val) => !selectedIngredients.includes(val)
    );
    setIngredients(_ingredients);
    setDeleteIngredientsDialog(false);
    setSelectedIngredients([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Ingredients Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: IngredientKey) => {
    let val = (e.target && e.target.value) || "";
    let _ingredient: Ingredient = { ...ingredient };
    _ingredient[name] = val;
    setIngredient(_ingredient);
  };
  const onInputBooleanChange = (e: any, name: IngredientKey) => {
    let val = e.target.value;
    let _ingredient: Ingredient = { ...ingredient };
    _ingredient[name] = val;

    setIngredient(_ingredient);
  };
  const onInputChange = (e: any, name: IngredientKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = ingredient[name];

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

    let _ingredient: Ingredient = { ...ingredient };
    _ingredient[name] = val;

    setIngredient(_ingredient);
  };

  const onInputNumberChange = (e: any, name: IngredientKey) => {
    let val = e.value || 0;
    let _ingredient = { ...ingredient };
    _ingredient[name] = val;

    setIngredient(_ingredient);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: IngredientQuery = {};
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

    let d = await ingredientService.getIngredient(searchObj);
    if (d.error == undefined) {
      setIngredients(d.docs);
      setBackupIngredients(d.docs);
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
      let _ingredients = [...ingredients];
      let filtered = _ingredients.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setIngredients(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setIngredients(backupIngredients);
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
            disabled={!selectedIngredients || !selectedIngredients.length}
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

  const actionBodyTemplate = (rowData: Ingredient) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editIngredient(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteIngredient(rowData)}
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
      <h5 className="m-0"> {t("MANAGE_INGREDIENTS")}</h5>
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

  const ingredientDialogFooter = (
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
        onClick={saveIngredient}
      />
    </>
  );
  const deleteIngredientDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteIngredientDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteIngredient}
      />
    </>
  );
  const deleteIngredientsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteIngredientsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedIngredients}
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
            value={ingredients}
            selection={selectedIngredients}
            onSelectionChange={(e) =>
              setSelectedIngredients(e.value as Ingredient[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Ingredients"
            emptyMessage="No Ingredients found."
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
              header={t("IMAGE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              body={imageBodyTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="name"
              header={t("NAME")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder={t("SEARCH_BY_NAME")}
            ></Column>

            <Column
              showAddButton={false}
              field="itemCode"
              header={t("ITEM_CODE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by itemCode"
            ></Column>

            <Column
              showAddButton={false}
              field="unit"
              header={t("UNIT")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by unit"
            ></Column>

            <Column
              showAddButton={false}
              field="description"
              header={t("DESCRIPTION")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by description"
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
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={ingredientDialog}
            style={{ width: "450px" }}
            header="Ingredient Details"
            modal
            className="p-fluid"
            footer={ingredientDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="name">{t("NAME")}</label>
                <InputText
                  id="name"
                  value={ingredient.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !ingredient.name,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="itemCode"> {t("ITEM_CODE")}</label>
                <InputText
                  id="itemCode"
                  value={ingredient.itemCode}
                  onChange={(e) => onInputChange(e, "itemCode")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !ingredient.itemCode,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="unit"> {t("UNIT")}</label>
                <InputText
                  id="unit"
                  value={ingredient.unit}
                  onChange={(e) => onInputChange(e, "unit")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !ingredient.unit,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="description"> {t("DESCRIPTION")}</label>
                <InputText
                  id="description"
                  value={ingredient.description}
                  onChange={(e) => onInputChange(e, "description")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteIngredientDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteIngredientDialogFooter}
            onHide={hideDeleteIngredientDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {ingredient && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                  <b>Ingredient record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteIngredientsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteIngredientsDialogFooter}
            onHide={hideDeleteIngredientsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {ingredient && (
                <span>
                  Are you sure you want to delete the selected Ingredient?
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
                  updateFileName(e, uploadInfo?.dbColName as keyof Ingredient)
                }
                url={uploadInfo?.url}
                table="ingredient"
                tableId={ingredient.id}
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

export default IngredientPage;

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
