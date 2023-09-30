import config from "@config/configs";
import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import {
  MealGroup,
  MealGroupKey,
  MealGroupQuery,
  MealGroupService,
} from "@services/MealGroup";
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

const MealGroupPage = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const validation = [
    { id: "name", type: validate.text, max: 50, min: 2, required: true },
  ];
  let emptyMealGroup: MealGroup = {
    name: "",
  };
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [backupMealGroups, setBackupMealGroups] = useState<MealGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [mealGroupDialog, setMealGroupDialog] = useState(false);
  const [deleteMealGroupDialog, setDeleteMealGroupDialog] = useState(false);
  const [deleteMealGroupsDialog, setDeleteMealGroupsDialog] = useState(false);
  const [mealGroup, setMealGroup] = useState<MealGroup>(emptyMealGroup);
  const [selectedMealGroups, setSelectedMealGroups] = useState<MealGroup[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<MealGroup[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const mealgroupService = new MealGroupService();
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
      let d = await mealgroupService.getMealGroup({ limit: row });
      if (d.error == undefined) {
        setMealGroups(d.docs);
        setBackupMealGroups(d.docs);
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

  const imageBodyTemplate = (rowData: MealGroup) => {
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

  const downloadFile = (data: MealGroup, dbColName: MealGroupKey) => {
    let fileLink = config.serverURI + "/" + data[dbColName];
    var link: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(link);
    link.href = fileLink;
    link.target = "_blank";
    link.click();
  };
  const updateFileName = (
    newUploadedFileName: string,
    colName: MealGroupKey
  ) => {
    let _mealGroup = { ...mealGroup, [colName]: newUploadedFileName };
    let _mealGroups = [...mealGroups];
    const index = _mealGroups.findIndex((c) => c.id === mealGroup.id);
    if (index !== -1) {
      _mealGroups[index] = _mealGroup;
    }
    setMealGroup(_mealGroup);
    setMealGroups(_mealGroups);
  };
  const showUploadDialog = (
    mealGroup: MealGroup,
    dbColName: string,
    accept: string = "images/*"
  ) => {
    setMealGroup({ ...mealGroup });
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
    setMealGroup(emptyMealGroup);
    setSubmitted(false);
    setMealGroupDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setMealGroupDialog(false);
  };

  const hideDeleteMealGroupDialog = () => {
    setDeleteMealGroupDialog(false);
  };

  const hideDeleteMealGroupsDialog = () => {
    setDeleteMealGroupsDialog(false);
  };

  const saveMealGroup = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(mealGroup, validation);
    if (validationErrors.length == 0) {
      let _mealGroups: MealGroup[] = [...mealGroups];
      let _mealGroup: MealGroup = { ...mealGroup };
      if (mealGroup.id) {
        let d = await mealgroupService.updateMealGroup(_mealGroup);
        if (d.error == undefined) {
          const index = _mealGroups.findIndex((c) => c.id === mealGroup.id);
          if (index !== -1) {
            _mealGroups[index] = { ..._mealGroup };
            // _mealGroups[index] = _mealGroup;
            //_mealGroups.splice(index, 1, {..._mealGroup,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealGroup Updated",
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
        let d = await mealgroupService.addMealGroup(_mealGroup);
        if (d.error == undefined) {
          var newID = d.id;
          // _mealGroups.unshift({..._mealGroup,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "MealGroup Updated",
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

      setMealGroups(_mealGroups);
      setBackupMealGroups(_mealGroups);
      setMealGroupDialog(false);
      setMealGroup(emptyMealGroup);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editMealGroup = (mealGroup: MealGroup) => {
    setMealGroup({ ...mealGroup });
    setMealGroupDialog(true);
  };

  const confirmDeleteMealGroup = (mealGroup: MealGroup) => {
    setMealGroup(mealGroup);
    setDeleteMealGroupDialog(true);
  };

  const deleteMealGroup = async () => {
    let d = await mealgroupService.deleteMealGroup(mealGroup.id ?? "");
    if (d.error == undefined) {
      let _mealGroups = mealGroups.filter((val) => val.id !== mealGroup.id);
      setMealGroups(_mealGroups);
      setBackupMealGroups(_mealGroups);
      setDeleteMealGroupDialog(false);
      setMealGroup(emptyMealGroup);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "MealGroup Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealGroup Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteMealGroupsDialog(true);
  };

  const deleteSelectedMealGroups = () => {
    let _mealGroups = mealGroups.filter(
      (val) => !selectedMealGroups.includes(val)
    );
    setMealGroups(_mealGroups);
    setDeleteMealGroupsDialog(false);
    setSelectedMealGroups([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "MealGroups Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: MealGroupKey) => {
    let val = (e.target && e.target.value) || "";
    let _mealGroup: MealGroup = { ...mealGroup };
    _mealGroup[name] = val;
    setMealGroup(_mealGroup);
  };
  const onInputBooleanChange = (e: any, name: MealGroupKey) => {
    let val = e.target.value;
    let _mealGroup: MealGroup = { ...mealGroup };
    _mealGroup[name] = val;

    setMealGroup(_mealGroup);
  };
  const onInputChange = (e: any, name: MealGroupKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = mealGroup[name];

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

    let _mealGroup: MealGroup = { ...mealGroup };
    _mealGroup[name] = val;

    setMealGroup(_mealGroup);
  };

  const onInputNumberChange = (e: any, name: MealGroupKey) => {
    let val = e.value || 0;
    let _mealGroup = { ...mealGroup };
    _mealGroup[name] = val;

    setMealGroup(_mealGroup);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: MealGroupQuery = {};
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

    let d = await mealgroupService.getMealGroup(searchObj);
    if (d.error == undefined) {
      setMealGroups(d.docs);
      setBackupMealGroups(d.docs);
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
      let _mealGroups = [...mealGroups];
      let filtered = _mealGroups.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setMealGroups(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setMealGroups(backupMealGroups);
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
            disabled={!selectedMealGroups || !selectedMealGroups.length}
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

  const actionBodyTemplate = (rowData: MealGroup) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editMealGroup(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteMealGroup(rowData)}
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
      <h5 className="m-0"> {t("MANAGE_MEAL_GROUP")}</h5>
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

  const mealGroupDialogFooter = (
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
        onClick={saveMealGroup}
      />
    </>
  );
  const deleteMealGroupDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealGroupDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteMealGroup}
      />
    </>
  );
  const deleteMealGroupsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteMealGroupsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedMealGroups}
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
            value={mealGroups}
            selection={selectedMealGroups}
            onSelectionChange={(e) =>
              setSelectedMealGroups(e.value as MealGroup[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealGroups"
            emptyMessage="No MealGroups found."
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
              filterPlaceholder="Search by name"
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
              header={t("UPDATED_BY")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by updateBy"
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={mealGroupDialog}
            style={{ width: "450px" }}
            header={t("MEAL_GROUP_DETAILS")}
            modal
            className="p-fluid"
            footer={mealGroupDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="name"> {t("NAME")}</label>
                <InputText
                  id="name"
                  value={mealGroup.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !mealGroup.name,
                  })}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealGroupDialog}
            style={{ width: "450px" }}
            header={t("CONFIRM")}
            modal
            footer={deleteMealGroupDialogFooter}
            onHide={hideDeleteMealGroupDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealGroup && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")} <b>MealGroup record</b>
                  ?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteMealGroupsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteMealGroupsDialogFooter}
            onHide={hideDeleteMealGroupsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {mealGroup && (
                <span>
                  Are you sure you want to delete the selected MealGroup?
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
                  updateFileName(e, uploadInfo?.dbColName as keyof MealGroup)
                }
                url={uploadInfo?.url}
                table="mealGroup"
                tableId={mealGroup.id}
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

export default MealGroupPage;

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
