import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import { Customer, CustomerService } from "@services/Customer";
import {
  CustomerSupport,
  CustomerSupportKey,
  CustomerSupportQuery,
  CustomerSupportService,
} from "@services/CustomerSupport";
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
import { ListBox } from "primereact/listbox";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomerSupportPage = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const validation = [
    { id: "customerName", type: validate.text, required: true },
    { id: "email", type: validate.email, max: 20, min: 0, required: false },
    { id: "subject", type: validate.text, max: 30, min: 0, required: true },
    {
      id: "description",
      type: validate.text,
      max: 500,
      min: 0,
      required: true,
    },
    { id: "status", type: validate.text, required: true },
    { id: "customerPhone", type: validate.text, required: false },
  ];
  let emptyCustomerSupport: CustomerSupport = {
    subject: "",
    description: "",
    status: "",
  };
  const [customerSupports, setCustomerSupports] = useState<CustomerSupport[]>(
    []
  );
  const [backupCustomerSupports, setBackupCustomerSupports] = useState<
    CustomerSupport[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { textFormat } = useContext(LangContext);
  const [customerSupportDialog, setCustomerSupportDialog] = useState(false);
  const [deleteCustomerSupportDialog, setDeleteCustomerSupportDialog] =
    useState(false);
  const [deleteCustomerSupportsDialog, setDeleteCustomerSupportsDialog] =
    useState(false);
  const [customerSupport, setCustomerSupport] =
    useState<CustomerSupport>(emptyCustomerSupport);
  const [selectedCustomerSupports, setSelectedCustomerSupports] = useState<
    CustomerSupport[]
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<CustomerSupport[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const customersupportService = new CustomerSupportService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const customerService = new CustomerService();
  const [sugcustomers, setSugCustomers] = useState<Customer[]>([]);

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await customersupportService.getCustomerSupport({ limit: row });
      if (d.error == undefined) {
        setCustomerSupports(d.docs);
        setBackupCustomerSupports(d.docs);
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
      customerName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      customerPhone: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      subject: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      description: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
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
      kitchen: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
  };

  const datastatuss = [
    { value: "Pending", name: "Pending" },
    { value: "Resolve", name: "Resolve" },
  ];

  const searchCustomer = async (e: any) => {
    if (e.query.trim().length > 1) {
      let dataCustomer_ = await customerService.getCustomerSuggestions(
        e.query.trim()
      );
      setSugCustomers(dataCustomer_.data);
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

  const statusFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">{t("STATUS_PICKER")}</div>
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
    setCustomerSupport(emptyCustomerSupport);
    setSubmitted(false);
    setCustomerSupportDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCustomerSupportDialog(false);
  };

  const hideDeleteCustomerSupportDialog = () => {
    setDeleteCustomerSupportDialog(false);
  };

  const hideDeleteCustomerSupportsDialog = () => {
    setDeleteCustomerSupportsDialog(false);
  };

  const saveCustomerSupport = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(
      customerSupport,
      validation
    );
    if (validationErrors.length == 0) {
      let _customerSupports: CustomerSupport[] = [...customerSupports];
      let _customerSupport: CustomerSupport = { ...customerSupport };
      if (customerSupport.id) {
        let d = await customersupportService.updateCustomerSupport(
          _customerSupport
        );
        if (d.error == undefined) {
          const index = _customerSupports.findIndex(
            (c) => c.id === customerSupport.id
          );
          if (index !== -1) {
            _customerSupports[index] = { ..._customerSupport };
            // _customerSupports[index] = _customerSupport;
            //_customerSupports.splice(index, 1, {..._customerSupport,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "CustomerSupport Updated",
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
        let d = await customersupportService.addCustomerSupport(
          _customerSupport
        );
        if (d.error == undefined) {
          var newID = d.id;
          // _customerSupports.unshift({..._customerSupport,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "CustomerSupport Updated",
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

      setCustomerSupports(_customerSupports);
      setBackupCustomerSupports(_customerSupports);
      setCustomerSupportDialog(false);
      setCustomerSupport(emptyCustomerSupport);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editCustomerSupport = (customerSupport: CustomerSupport) => {
    setCustomerSupport({ ...customerSupport });
    setCustomerSupportDialog(true);
  };

  const confirmDeleteCustomerSupport = (customerSupport: CustomerSupport) => {
    setCustomerSupport(customerSupport);
    setDeleteCustomerSupportDialog(true);
  };

  const deleteCustomerSupport = async () => {
    let d = await customersupportService.deleteCustomerSupport(
      customerSupport.id ?? ""
    );
    if (d.error == undefined) {
      let _customerSupports = customerSupports.filter(
        (val) => val.id !== customerSupport.id
      );
      setCustomerSupports(_customerSupports);
      setBackupCustomerSupports(_customerSupports);
      setDeleteCustomerSupportDialog(false);
      setCustomerSupport(emptyCustomerSupport);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "CustomerSupport Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CustomerSupport Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteCustomerSupportsDialog(true);
  };

  const deleteSelectedCustomerSupports = () => {
    let _customerSupports = customerSupports.filter(
      (val) => !selectedCustomerSupports.includes(val)
    );
    setCustomerSupports(_customerSupports);
    setDeleteCustomerSupportsDialog(false);
    setSelectedCustomerSupports([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "CustomerSupports Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: CustomerSupportKey) => {
    let val = (e.target && e.target.value) || "";
    let _customerSupport: CustomerSupport = { ...customerSupport };
    _customerSupport[name] = val;
    setCustomerSupport(_customerSupport);
  };
  const onInputBooleanChange = (e: any, name: CustomerSupportKey) => {
    let val = e.target.value;
    let _customerSupport: CustomerSupport = { ...customerSupport };
    _customerSupport[name] = val;

    setCustomerSupport(_customerSupport);
  };
  const onInputChange = (e: any, name: CustomerSupportKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = customerSupport[name];

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

    let _customerSupport: CustomerSupport = { ...customerSupport };
    _customerSupport[name] = val;

    setCustomerSupport(_customerSupport);
  };

  const onInputNumberChange = (e: any, name: CustomerSupportKey) => {
    let val = e.value || 0;
    let _customerSupport = { ...customerSupport };
    _customerSupport[name] = val;

    setCustomerSupport(_customerSupport);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: CustomerSupportQuery = {};
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

    let d = await customersupportService.getCustomerSupport(searchObj);
    if (d.error == undefined) {
      setCustomerSupports(d.docs);
      setBackupCustomerSupports(d.docs);
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
      let _customerSupports = [...customerSupports];
      let filtered = _customerSupports.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setCustomerSupports(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setCustomerSupports(backupCustomerSupports);
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
            disabled={
              !selectedCustomerSupports || !selectedCustomerSupports.length
            }
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

  const actionBodyTemplate = (rowData: CustomerSupport) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editCustomerSupport(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteCustomerSupport(rowData)}
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
      <h5 className="m-0"> {t("MANAGE_CUSTOMER_SUPPORTS")}</h5>
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

  const customerSupportDialogFooter = (
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
        onClick={saveCustomerSupport}
      />
    </>
  );
  const deleteCustomerSupportDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCustomerSupportDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteCustomerSupport}
      />
    </>
  );
  const deleteCustomerSupportsDialogFooter = (
    <>
      <Button
        label={t("NO")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCustomerSupportsDialog}
      />
      <Button
        label={t("YES")}
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedCustomerSupports}
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
            value={customerSupports}
            selection={selectedCustomerSupports}
            onSelectionChange={(e) =>
              setSelectedCustomerSupports(e.value as CustomerSupport[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} CustomerSupports"
            emptyMessage="No CustomerSupports found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="customerName"
              header={t("NAME")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="customerName"
              filter
              filterElement={customerNameFilterTemplate}
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
              field="customerPhone"
              header={t("PHONE")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="customerPhone"
              filter
              filterElement={customerPhoneFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="subject"
              header={t("SUBJECT")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by subject"
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
              field="status"
              header={t("STATUS")}
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="status"
              filter
              filterElement={statusFilterTemplate}
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
            visible={customerSupportDialog}
            style={{ width: "450px" }}
            header={t("CUSTOMER_SUPPORT_DETAILS")}
            modal
            className="p-fluid"
            footer={customerSupportDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="customerName"> {t("NAME")}</label>
                <AutoComplete
                  field="name"
                  id="customerName"
                  completeMethod={searchCustomer}
                  value={customerSupport.customerName}
                  suggestions={sugcustomers}
                  onChange={(e) => onInputChange(e, "customerName")}
                />
              </div>

              <div className="field">
                <label htmlFor="email"> {t("EMAIL")}</label>
                <InputText
                  id="email"
                  value={customerSupport.email}
                  onChange={(e) => onInputChange(e, "email")}
                />
              </div>

              <div className="field">
                <label htmlFor="subject"> {t("SUBJECT")}</label>
                <InputText
                  id="subject"
                  value={customerSupport.subject}
                  onChange={(e) => onInputChange(e, "subject")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !customerSupport.subject,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="description">{t("DESCRIPTION")}</label>
                <InputText
                  id="description"
                  value={customerSupport.description}
                  onChange={(e) => onInputChange(e, "description")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !customerSupport.description,
                  })}
                />
              </div>

              <div className="field">
                <label htmlFor="status"> {t("STATUS")}</label>
                <ListBox
                  id="status"
                  optionLabel="name"
                  value={customerSupport.status}
                  options={datastatuss}
                  onChange={(e) => onInputChange(e, "status")}
                />
              </div>

              <div className="field">
                <label htmlFor="customerPhone"> {t("PHONE")}</label>
                <AutoComplete
                  field="mobile"
                  id="customerPhone"
                  completeMethod={searchCustomer}
                  value={customerSupport.customerPhone}
                  suggestions={sugcustomers}
                  onChange={(e) => onInputChange(e, "customerPhone")}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteCustomerSupportDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteCustomerSupportDialogFooter}
            onHide={hideDeleteCustomerSupportDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {customerSupport && (
                <span>
                  {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}{" "}
                  <b>CustomerSupport record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteCustomerSupportsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteCustomerSupportsDialogFooter}
            onHide={hideDeleteCustomerSupportsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {customerSupport && (
                <span>
                  Are you sure you want to delete the selected CustomerSupport?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;

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
