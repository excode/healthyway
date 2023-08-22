import config from "@config/index";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { MealPlan, MealPlanService } from "@services/MealPlan";
import {
  Promotions,
  PromotionsKey,
  PromotionsQuery,
  PromotionsService,
} from "@services/Promotions";
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

const PromotionsPage = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const validation = [
    { id: "name", type: validate.text, max: 50, min: 0, required: true },
    {
      id: "description",
      type: validate.text,
      max: 200,
      min: 0,
      required: true,
    },
    {
      id: "startDate",
      type: validate.datetime,
      max: 0,
      min: 0,
      required: true,
    },
    { id: "endDate", type: validate.datetime, max: 0, min: 0, required: true },
    { id: "discount", type: validate.text, max: 10, min: 0, required: true },
  ];
  let emptyPromotions: Promotions = {
    mealPlan: [],
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    discount: "",
  };
  const [promotionss, setPromotionss] = useState<Promotions[]>([]);
  const [backupPromotionss, setBackupPromotionss] = useState<Promotions[]>([]);
  const [loading, setLoading] = useState(false);
  const [promotionsDialog, setPromotionsDialog] = useState(false);
  const [deletePromotionsDialog, setDeletePromotionsDialog] = useState(false);
  const [deletePromotionssDialog, setDeletePromotionssDialog] = useState(false);
  const [promotions, setPromotions] = useState<Promotions>(emptyPromotions);
  const [selectedPromotionss, setSelectedPromotionss] = useState<Promotions[]>(
    []
  );
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Promotions[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const promotionsService = new PromotionsService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());
  const { textFormat } = useContext(LangContext);
  const mealplanService = new MealPlanService();
  const [sugmealPlans, setSugMealPlans] = useState<MealPlan[]>([]);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
  const [currentImage, setCurrentImage] = useState("");

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await promotionsService.getPromotions({ limit: row });
      if (d.error == undefined) {
        setPromotionss(d.docs);
        setBackupPromotionss(d.docs);
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
      mealPlan: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      description: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      startDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      endDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      discount: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const searchMealPlan = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataMealPlan_ = await mealplanService.getMealPlanSuggestions(
        e.query.trim()
      );
      setSugMealPlans(dataMealPlan_.data);
    }
  };

  const imageBodyTemplate = (rowData: Promotions) => {
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

  const downloadFile = (data: Promotions, dbColName: PromotionsKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: PromotionsKey
  ) => {
    let _promotions = { ...promotions, [colName]: newUploadedFileName };
    let _promotionss = [...promotionss];
    const index = _promotionss.findIndex((c) => c.id === promotions.id);
    if (index !== -1) {
      _promotionss[index] = _promotions;
    }
    setPromotions(_promotions);
    setPromotionss(_promotionss);
  };
  const showUploadDialog = (
    promotions: Promotions,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setPromotions({ ...promotions });
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

  const mealPlanFilterTemplate = (options: any) => {
    return (
      <AutoComplete
        field="name"
        value={options.value}
        multiple
        completeMethod={searchMealPlan}
        suggestions={sugmealPlans}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a mealPlan"
        className="p-column-filter"
      />
    );
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

  const startDateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        showTime
        hourFormat="12"
      />
    );
  };

  const endDateFilterTemplate = (options: any) => {
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
    setPromotions(emptyPromotions);
    setSubmitted(false);
    setPromotionsDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPromotionsDialog(false);
  };

  const hideDeletePromotionsDialog = () => {
    setDeletePromotionsDialog(false);
  };

  const hideDeletePromotionssDialog = () => {
    setDeletePromotionssDialog(false);
  };

  const savePromotions = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(promotions, validation);
    if (validationErrors.length == 0) {
      let _promotionss: Promotions[] = [...promotionss];
      let _promotions: Promotions = { ...promotions };
      if (promotions.id) {
        let d = await promotionsService.updatePromotions(_promotions);
        if (d.error == undefined) {
          const index = _promotionss.findIndex((c) => c.id === promotions.id);
          if (index !== -1) {
            _promotionss[index] = { ..._promotions };
            // _promotionss[index] = _promotions;
            //_promotionss.splice(index, 1, {..._promotions,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Promotions Updated",
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
        let d = await promotionsService.addPromotions(_promotions);
        if (d.error == undefined) {
          var newID = d.id;
          // _promotionss.unshift({..._promotions,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Promotions Updated",
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

      setPromotionss(_promotionss);
      setBackupPromotionss(_promotionss);
      setPromotionsDialog(false);
      setPromotions(emptyPromotions);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editPromotions = (promotions: Promotions) => {
    setPromotions({ ...promotions });
    setPromotionsDialog(true);
  };

  const confirmDeletePromotions = (promotions: Promotions) => {
    setPromotions(promotions);
    setDeletePromotionsDialog(true);
  };

  const deletePromotions = async () => {
    let d = await promotionsService.deletePromotions(promotions.id ?? "");
    if (d.error == undefined) {
      let _promotionss = promotionss.filter((val) => val.id !== promotions.id);
      setPromotionss(_promotionss);
      setBackupPromotionss(_promotionss);
      setDeletePromotionsDialog(false);
      setPromotions(emptyPromotions);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Promotions Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Promotions Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeletePromotionssDialog(true);
  };

  const deleteSelectedPromotionss = () => {
    let _promotionss = promotionss.filter(
      (val) => !selectedPromotionss.includes(val)
    );
    setPromotionss(_promotionss);
    setDeletePromotionssDialog(false);
    setSelectedPromotionss([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Promotionss Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: PromotionsKey) => {
    let val = (e.target && e.target.value) || "";
    let _promotions: Promotions = { ...promotions };
    _promotions[name] = val;
    setPromotions(_promotions);
  };
  const onInputBooleanChange = (e: any, name: PromotionsKey) => {
    let val = e.target.value;
    let _promotions: Promotions = { ...promotions };
    _promotions[name] = val;

    setPromotions(_promotions);
  };
  const onInputChange = (e: any, name: PromotionsKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = promotions[name];

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

    let _promotions: Promotions = { ...promotions };
    _promotions[name] = val;

    setPromotions(_promotions);
  };

  const onInputNumberChange = (e: any, name: PromotionsKey) => {
    let val = e.value || 0;
    let _promotions = { ...promotions };
    _promotions[name] = val;

    setPromotions(_promotions);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: PromotionsQuery = {};
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

    let d = await promotionsService.getPromotions(searchObj);
    if (d.error == undefined) {
      setPromotionss(d.docs);
      setBackupPromotionss(d.docs);
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
      let _promotionss = [...promotionss];
      let filtered = _promotionss.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setPromotionss(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setPromotionss(backupPromotionss);
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
            disabled={!selectedPromotionss || !selectedPromotionss.length}
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

  const actionBodyTemplate = (rowData: Promotions) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editPromotions(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeletePromotions(rowData)}
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
      <h5 className="m-0"> {t("MANGE_PROMOTIONS")}</h5>
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

  const promotionsDialogFooter = (
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
        onClick={savePromotions}
      />
    </>
  );
  const deletePromotionsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeletePromotionsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deletePromotions}
      />
    </>
  );
  const deletePromotionssDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeletePromotionssDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedPromotionss}
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
            value={promotionss}
            selection={selectedPromotionss}
            onSelectionChange={(e) =>
              setSelectedPromotionss(e.value as Promotions[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Promotionss"
            emptyMessage="No Promotionss found."
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
              field="mealPlan"
              header={t("MEAL_PLAN")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="mealPlan"
              filter
              filterElement={mealPlanFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="name"
              header={t("NAME")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by name"
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
              field="startDate"
              header={t("START_DATE")}
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
              header={t("END_DATE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="endDate"
              dataType="date"
              filter
              filterElement={endDateFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="discount"
              header={t("DISCOUNT")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by discount"
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={promotionsDialog}
            style={{ width: "450px" }}
            header={t("PROMOTIONS_DETAILS")}
            modal
            className="p-fluid"
            footer={promotionsDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="name">{t("NAME")}</label>
                <InputText
                  id="name"
                  value={promotions.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !promotions.name,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="description"> {t("DESCRIPTION")}</label>
                <InputText
                  id="description"
                  value={promotions.description}
                  onChange={(e) => onInputChange(e, "description")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !promotions.description,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="startDate"> {t("START_DATE")}</label>
                <Calendar
                  id="startDate"
                  value={
                    promotions.startDate ? new Date(promotions.startDate) : null
                  }
                  onChange={(e) => onInputChange(e, "startDate")}
                  showTime
                  hourFormat="12"
                  required
                  className={classNames({
                    "p-invalid": submitted && !promotions.startDate,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="endDate"> {t("END_DATE")}</label>
                <Calendar
                  id="endDate"
                  value={
                    promotions.endDate ? new Date(promotions.endDate) : null
                  }
                  onChange={(e) => onInputChange(e, "endDate")}
                  showTime
                  hourFormat="12"
                  required
                  className={classNames({
                    "p-invalid": submitted && !promotions.endDate,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="discount"> {t("DISCOUNT")}</label>
                <InputText
                  id="discount"
                  value={promotions.discount}
                  onChange={(e) => onInputChange(e, "discount")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !promotions.discount,
                  })}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deletePromotionsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deletePromotionsDialogFooter}
            onHide={hideDeletePromotionsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {promotions && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}{" "}
                  <b>Promotions record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deletePromotionssDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deletePromotionssDialogFooter}
            onHide={hideDeletePromotionssDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {promotions && (
                <span>
                  Are you sure you want to delete the selected Promotions?
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
                  updateFileName(e, uploadInfo?.dbColName as keyof Promotions)
                }
                url={uploadInfo?.url}
                table="promotions"
                tableId={promotions.id}
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

export default PromotionsPage;

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
