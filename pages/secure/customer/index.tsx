import { validate, validateForm } from "@lib/validation";
import { SortType } from "@services/CommonTypes";
import {
  Customer,
  CustomerKey,
  CustomerQuery,
  CustomerService,
} from "@services/Customer";
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
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

const CustomerPage = () => {
  const { asPath } = useRouter();
  const validation = [
    { id: "name", type: validate.text, max: 50, min: 0, required: true },
    { id: "email", type: validate.email, max: 0, min: 0, required: false },
    { id: "Address", type: validate.text, max: 100, min: 0, required: true },
    { id: "customerType", type: validate.text, required: false },
    { id: "GeoTag", type: validate.text, max: 50, min: 0, required: true },
    { id: "mobile", type: validate.phone, max: 0, min: 0, required: true },
  ];
  let emptyCustomer: Customer = {
    name: "",
    Address: "",
    GeoTag: "",
    mobile: "",
  };
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [backupCustomers, setBackupCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [customerDialog, setCustomerDialog] = useState(false);
  const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);
  const [deleteCustomersDialog, setDeleteCustomersDialog] = useState(false);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Customer[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const customerService = new CustomerService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const [filters1, setFilters1] = useState<DataTableFilterMeta | undefined>({});
  const clearFilter1 = () => {
    initFilters1();
  };
  useEffect(() => {
    setLoading(true);
    (async () => {
      let d = await customerService.getCustomer({ limit: row });
      if (d.error == undefined) {
        setCustomers(d.docs);
        setBackupCustomers(d.docs);
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
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      Address: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      mobile: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      GeoTag: {
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
      customerType: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
  };

  const datacustomerTypes = [
    { value: "Regular", name: "Regular" },
    { value: "VIP", name: "VIP" },
    { value: "VVIP", name: "VVIP" },
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

  const customerTypeFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">CustomerType Picker</div>
        <Dropdown
          value={options.value}
          options={datacustomerTypes}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="value"
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
    setCustomer(emptyCustomer);
    setSubmitted(false);
    setCustomerDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCustomerDialog(false);
  };

  const hideDeleteCustomerDialog = () => {
    setDeleteCustomerDialog(false);
  };

  const hideDeleteCustomersDialog = () => {
    setDeleteCustomersDialog(false);
  };

  const saveCustomer = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(customer, validation);
    if (validationErrors.length == 0) {
      let _customers: Customer[] = [...customers];
      let _customer: Customer = { ...customer };
      if (customer.id) {
        let d = await customerService.updateCustomer(_customer);
        if (d.error == undefined) {
          const index = _customers.findIndex((c) => c.id === customer.id);
          if (index !== -1) {
            _customers[index] = { ..._customer };
            // _customers[index] = _customer;
            //_customers.splice(index, 1, {..._customer,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Customer Updated",
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
        let d = await customerService.addCustomer(_customer);
        if (d.error == undefined) {
          var newID = d.id;
          // _customers.unshift({..._customer,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Customer Updated",
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

      setCustomers(_customers);
      setBackupCustomers(_customers);
      setCustomerDialog(false);
      setCustomer(emptyCustomer);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editCustomer = (customer: Customer) => {
    setCustomer({ ...customer });
    setCustomerDialog(true);
  };

  const confirmDeleteCustomer = (customer: Customer) => {
    setCustomer(customer);
    setDeleteCustomerDialog(true);
  };

  const deleteCustomer = async () => {
    let d = await customerService.deleteCustomer(customer.id ?? "");
    if (d.error == undefined) {
      let _customers = customers.filter((val) => val.id !== customer.id);
      setCustomers(_customers);
      setBackupCustomers(_customers);
      setDeleteCustomerDialog(false);
      setCustomer(emptyCustomer);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Customer Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteCustomersDialog(true);
  };

  const deleteSelectedCustomers = () => {
    let _customers = customers.filter(
      (val) => !selectedCustomers.includes(val)
    );
    setCustomers(_customers);
    setDeleteCustomersDialog(false);
    setSelectedCustomers([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Customers Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: CustomerKey) => {
    let val = (e.target && e.target.value) || "";
    let _customer: Customer = { ...customer };
    _customer[name] = val;
    setCustomer(_customer);
  };
  const onInputBooleanChange = (e: any, name: CustomerKey) => {
    let val = e.target.value;
    let _customer: Customer = { ...customer };
    _customer[name] = val;

    setCustomer(_customer);
  };
  const onInputChange = (e: any, name: CustomerKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = customer[name];

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

    let _customer: Customer = { ...customer };
    _customer[name] = val;

    setCustomer(_customer);
  };

  const onInputNumberChange = (e: any, name: CustomerKey) => {
    let val = e.value || 0;
    let _customer = { ...customer };
    _customer[name] = val;

    setCustomer(_customer);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: CustomerQuery = {};
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

    let d = await customerService.getCustomer(searchObj);
    if (d.error == undefined) {
      setCustomers(d.docs);
      setBackupCustomers(d.docs);
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
      let _customers = [...customers];
      let filtered = _customers.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setCustomers(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setCustomers(backupCustomers);
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
            disabled={!selectedCustomers || !selectedCustomers.length}
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

  const actionBodyTemplate = (rowData: Customer) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editCustomer(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteCustomer(rowData)}
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
      <h5 className="m-0">Manage Customers</h5>
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

  const customerDialogFooter = (
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
        onClick={saveCustomer}
      />
    </>
  );
  const deleteCustomerDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCustomerDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteCustomer}
      />
    </>
  );
  const deleteCustomersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCustomersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedCustomers}
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
            value={customers}
            selection={selectedCustomers}
            onSelectionChange={(e) =>
              setSelectedCustomers(e.value as Customer[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Customers"
            emptyMessage="No Customers found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>

            <Column
              showAddButton={false}
              field="name"
              header="Name"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by name"
            ></Column>

            <Column
              showAddButton={false}
              field="email"
              header="Email"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by email"
            ></Column>

            <Column
              showAddButton={false}
              field="Address"
              header="Address"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by Address"
            ></Column>

            <Column
              showAddButton={false}
              field="mobile"
              header="Mobile"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by mobile"
            ></Column>

            <Column
              showAddButton={false}
              field="GeoTag"
              header="GeoTag"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by GeoTag"
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
            visible={customerDialog}
            style={{ width: "450px" }}
            header="Customer Details"
            modal
            className="p-fluid"
            footer={customerDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={customer.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                className={classNames({
                  "p-invalid": submitted && !customer.name,
                })}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={customer.email}
                onChange={(e) => onInputChange(e, "email")}
              />
            </div>

            <div className="field">
              <label htmlFor="Address">Address</label>
              <InputTextarea
                id="Address"
                value={customer.Address}
                onChange={(e) => onInputChange(e, "Address")}
                rows={5}
                cols={30}
                required
                className={classNames({
                  "p-invalid": submitted && !customer.Address,
                })}
              />
            </div>

            <div className="field">
              <label htmlFor="customerType">Customer Type</label>
              <Dropdown
                id="customerType"
                optionLabel="name"
                value={customer.customerType}
                options={datacustomerTypes}
                onChange={(e) => onInputChange(e, "customerType")}
              />
            </div>

            <div className="field">
              <label htmlFor="GeoTag">GeoTag</label>
              <InputText
                id="GeoTag"
                value={customer.GeoTag}
                onChange={(e) => onInputChange(e, "GeoTag")}
                required
                className={classNames({
                  "p-invalid": submitted && !customer.GeoTag,
                })}
              />
            </div>

            <div className="field">
              <label htmlFor="mobile">Mobile</label>
              <InputText
                id="mobile"
                value={customer.mobile}
                onChange={(e) => onInputChange(e, "mobile")}
                required
                className={classNames({
                  "p-invalid": submitted && !customer.mobile,
                })}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteCustomerDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteCustomerDialogFooter}
            onHide={hideDeleteCustomerDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {customer && (
                <span>
                  Are you sure you want to delete <b>Customer record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteCustomersDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteCustomersDialogFooter}
            onHide={hideDeleteCustomersDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {customer && (
                <span>
                  Are you sure you want to delete the selected Customer?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
