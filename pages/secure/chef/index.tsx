import config from "@config/configs";
import { validate, validateForm } from "@lib/validation";
import { Chef, ChefKey, ChefQuery, ChefService } from "@services/Chef";
import { SortType } from "@services/CommonTypes";
import { MealItem, MealItemService } from "@services/MealItem";
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
import { MultiSelect } from "primereact/multiselect";
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

const ChefPage = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const validation = [
    { id: "name", type: validate.text, max: 20, min: 3, required: true },
    { id: "email", type: validate.email, max: 200, min: 5, required: true },
    { id: "expertise", type: validate.array, required: true },
    { id: "address", type: validate.text, max: 0, min: 0, required: false },
    { id: "phoneNumber", type: validate.text, max: 0, min: 0, required: false },
  ];
  let emptyChef: Chef = {
    name: "",
    email: "",
    expertise: [],
  };
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [backupChefs, setBackupChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(false);
  const [chefDialog, setChefDialog] = useState(false);
  const [deleteChefDialog, setDeleteChefDialog] = useState(false);
  const [deleteChefsDialog, setDeleteChefsDialog] = useState(false);
  const [chef, setChef] = useState<Chef>(emptyChef);
  const [selectedChefs, setSelectedChefs] = useState<Chef[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Chef[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const chefService = new ChefService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const mealitemService = new MealItemService();
  const [datamealItems, setDataMealItems] = useState<MealItem[]>([]);
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
      let d = await chefService.getChef({ limit: row });
      if (d.error == undefined) {
        setChefs(d.docs);
        setBackupChefs(d.docs);
        setLoading(false);
        setTotalRecords(d.count);

        let dataMealItems_ = await mealitemService.getMealItemAll({});
        setDataMealItems(dataMealItems_.data);

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
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      expertise: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      phoneNumber: {
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
      address: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const photoBodyTemplate = (rowData: Chef) => {
    let imageURL = config.serverURI + "/" + rowData.photo;
    let fileURL = "/file_icon.png";
    let fileNoURL = "/file_icon_na.png";
    let contetnt;

    let acceptFile = "images/*";
    if (rowData.photo != undefined && rowData.photo != "") {
      contetnt = (
        <Image
          onError={(e: any) => defaultImage(e)}
          onMouseOver={(e: any) => setCurrentImage(rowData.id ?? "")}
          src={imageURL}
          alt="photo"
          preview
          downloadable
          width="250"
        />
      );
    } else if (rowData.photo == undefined || rowData.photo == "") {
      contetnt = (
        <Image
          onMouseOver={(e: any) => setCurrentImage(rowData.id ?? "")}
          src="/photo_na.png"
          alt="photo"
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
            onClick={(e) => showUploadDialog(rowData, "photo", acceptFile)}
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

  const downloadFile = (data: Chef, dbColName: ChefKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (newUploadedFileName: string, colName: ChefKey) => {
    let _chef = { ...chef, [colName]: newUploadedFileName };
    let _chefs = [...chefs];
    const index = _chefs.findIndex((c) => c.id === chef.id);
    if (index !== -1) {
      _chefs[index] = _chef;
    }
    setChef(_chef);
    setChefs(_chefs);
  };
  const showUploadDialog = (
    chef: Chef,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setChef({ ...chef });
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

  const expertiseFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">{t("EXPERTISE_PACKER")} </div>
        <MultiSelect
          value={options.value}
          options={datamealItems}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="name"
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
    setChef(emptyChef);
    setSubmitted(false);
    setChefDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setChefDialog(false);
  };

  const hideDeleteChefDialog = () => {
    setDeleteChefDialog(false);
  };

  const hideDeleteChefsDialog = () => {
    setDeleteChefsDialog(false);
  };

  const saveChef = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(chef, validation);
    if (validationErrors.length == 0) {
      let _chefs: Chef[] = [...chefs];
      let _chef: Chef = { ...chef };
      if (chef.id) {
        let d = await chefService.updateChef(_chef);
        if (d.error == undefined) {
          const index = _chefs.findIndex((c) => c.id === chef.id);
          if (index !== -1) {
            _chefs[index] = { ..._chef };
            // _chefs[index] = _chef;
            //_chefs.splice(index, 1, {..._chef,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Chef Updated",
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
        let d = await chefService.addChef(_chef);
        if (d.error == undefined) {
          var newID = d.id;
          // _chefs.unshift({..._chef,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Chef Updated",
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

      setChefs(_chefs);
      setBackupChefs(_chefs);
      setChefDialog(false);
      setChef(emptyChef);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editChef = (chef: Chef) => {
    setChef({ ...chef });
    setChefDialog(true);
  };

  const confirmDeleteChef = (chef: Chef) => {
    setChef(chef);
    setDeleteChefDialog(true);
  };

  const deleteChef = async () => {
    let d = await chefService.deleteChef(chef.id ?? "");
    if (d.error == undefined) {
      let _chefs = chefs.filter((val) => val.id !== chef.id);
      setChefs(_chefs);
      setBackupChefs(_chefs);
      setDeleteChefDialog(false);
      setChef(emptyChef);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Chef Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chef Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteChefsDialog(true);
  };

  const deleteSelectedChefs = () => {
    let _chefs = chefs.filter((val) => !selectedChefs.includes(val));
    setChefs(_chefs);
    setDeleteChefsDialog(false);
    setSelectedChefs([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Chefs Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: ChefKey) => {
    let val = (e.target && e.target.value) || "";
    let _chef: Chef = { ...chef };
    _chef[name] = val;
    setChef(_chef);
  };
  const onInputBooleanChange = (e: any, name: ChefKey) => {
    let val = e.target.value;
    let _chef: Chef = { ...chef };
    _chef[name] = val;

    setChef(_chef);
  };
  const onInputChange = (e: any, name: ChefKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = chef[name];

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

    let _chef: Chef = { ...chef };
    _chef[name] = val;

    setChef(_chef);
  };

  const onInputNumberChange = (e: any, name: ChefKey) => {
    let val = e.value || 0;
    let _chef = { ...chef };
    _chef[name] = val;

    setChef(_chef);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: ChefQuery = {};
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

    let d = await chefService.getChef(searchObj);
    if (d.error == undefined) {
      setChefs(d.docs);
      setBackupChefs(d.docs);
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
      let _chefs = [...chefs];
      let filtered = _chefs.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setChefs(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setChefs(backupChefs);
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
            disabled={!selectedChefs || !selectedChefs.length}
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

  const actionBodyTemplate = (rowData: Chef) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editChef(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteChef(rowData)}
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
      <h5 className="m-0">Manage Chefs {t("MANAGE_CHEFS")}</h5>
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

  const chefDialogFooter = (
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
        onClick={saveChef}
      />
    </>
  );
  const deleteChefDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteChefDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteChef}
      />
    </>
  );
  const deleteChefsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteChefsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedChefs}
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
            value={chefs}
            selection={selectedChefs}
            onSelectionChange={(e) => setSelectedChefs(e.value as Chef[])}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Chefs"
            emptyMessage="No Chefs found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="photo"
              header={t("PHOTO")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              body={photoBodyTemplate}
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
              field="email"
              header={t("EMAIL")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by email"
            ></Column>

            <Column
              showAddButton={false}
              field="expertise"
              header={t("EXPERTISE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="expertise"
              filter
              filterElement={expertiseFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="phoneNumber"
              header={t("PHONE_NUMBER")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by phoneNumber"
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
            rtl={true}
            visible={chefDialog}
            style={{ width: "450px" }}
            header={t("CHEF_DETAILS")}
            modal
            className="p-fluid"
            footer={chefDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="name"> {t("NAME")}</label>
                <InputText
                  id="name"
                  value={chef.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !chef.name,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="email"> {t("EMAIL")}</label>
                <InputText
                  id="email"
                  value={chef.email}
                  onChange={(e) => onInputChange(e, "email")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !chef.email,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="expertise">{t("EXPERTISE")}</label>
                <MultiSelect
                  id="expertise"
                  optionLabel="name"
                  optionValue="name"
                  value={chef.expertise}
                  options={datamealItems}
                  onChange={(e) => onInputChange(e, "expertise")}
                />
              </div>

              <div className="field">
                <label htmlFor="address"> {t("ADDRESS")}</label>
                <InputText
                  id="address"
                  value={chef.address}
                  onChange={(e) => onInputChange(e, "address")}
                />
              </div>

              <div className="field">
                <label htmlFor="phoneNumber"> {t("PHONE_NUMBER")}</label>
                <InputText
                  id="phoneNumber"
                  value={chef.phoneNumber}
                  onChange={(e) => onInputChange(e, "phoneNumber")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteChefDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteChefDialogFooter}
            onHide={hideDeleteChefDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {chef && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")} <b>Chef record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteChefsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteChefsDialogFooter}
            onHide={hideDeleteChefsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {chef && (
                <span>Are you sure you want to delete the selected Chef?</span>
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
                  updateFileName(e, uploadInfo?.dbColName as keyof Chef)
                }
                url={uploadInfo?.url}
                table="chef"
                tableId={chef.id}
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

export default ChefPage;

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
