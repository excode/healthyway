import { validate, validateForm } from "@lib/validation";
import { Chef, ChefService } from "@services/Chef";
import { SortType } from "@services/CommonTypes";
import { Customer, CustomerService } from "@services/Customer";
import {
  Feedback,
  FeedbackKey,
  FeedbackQuery,
  FeedbackService,
} from "@services/Feedback";
import { MealOrder, MealOrderService } from "@services/MealOrder";
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
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";

const FeedbackPage = () => {
  const { asPath } = useRouter();
  const validation = [
    { id: "customerId", type: validate.text, required: true },
    { id: "chefId", type: validate.text, required: true },
    { id: "orderId", type: validate.text, required: true },
    { id: "rating", type: validate.number, max: 5, min: 0, required: false },
    { id: "comment", type: validate.text, max: 500, min: 0, required: true },
  ];
  let emptyFeedback: Feedback = {
    customerId: "",
    chefId: "",
    orderId: "",
    comment: "",
  };
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [backupFeedbacks, setBackupFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [deleteFeedbackDialog, setDeleteFeedbackDialog] = useState(false);
  const [deleteFeedbacksDialog, setDeleteFeedbacksDialog] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(emptyFeedback);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<Feedback[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sortOrders, setSortOrders] = useState<SortType>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [row, setRow] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Feedback[]>>(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const feedbackService = new FeedbackService();
  const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());

  const customerService = new CustomerService();
  const { textFormat } = useContext(LangContext);
  const [datacustomers, setDataCustomers] = useState<Customer[]>([]);
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
      let d = await feedbackService.getFeedback({ limit: row });
      if (d.error == undefined) {
        setFeedbacks(d.docs);
        setTotalRecords(d.count);
        setBackupFeedbacks(d.docs);
        setLoading(false);

        let dataCustomers_ = await customerService.getCustomerAll({});
        setDataCustomers(dataCustomers_.data);

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
      customerId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      chefId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      orderId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
      rating: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      comment: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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

  const customerIdFilterTemplate = (options: any) => {
    return (
      <>
        <div className="mb-3 text-bold">CustomerId Picker</div>
        <Dropdown
          value={options.value}
          options={datacustomers}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="email"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
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

  const ratingFilterTemplate = (options: any) => {
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
    setFeedback(emptyFeedback);
    setSubmitted(false);
    setFeedbackDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFeedbackDialog(false);
  };

  const hideDeleteFeedbackDialog = () => {
    setDeleteFeedbackDialog(false);
  };

  const hideDeleteFeedbacksDialog = () => {
    setDeleteFeedbacksDialog(false);
  };

  const saveFeedback = async () => {
    setSubmitted(true);
    const validationErrors: string[] = validateForm(feedback, validation);
    if (validationErrors.length == 0) {
      let _feedbacks: Feedback[] = [...feedbacks];
      let _feedback: Feedback = { ...feedback };
      if (feedback.id) {
        let d = await feedbackService.updateFeedback(_feedback);
        if (d.error == undefined) {
          const index = _feedbacks.findIndex((c) => c.id === feedback.id);
          if (index !== -1) {
            _feedbacks[index] = { ..._feedback };
            // _feedbacks[index] = _feedback;
            //_feedbacks.splice(index, 1, {..._feedback,id:id});
          }
          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Feedback Updated",
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
        let d = await feedbackService.addFeedback(_feedback);
        if (d.error == undefined) {
          var newID = d.id;
          // _feedbacks.unshift({..._feedback,id:newID})

          toast.current?.show({
            severity: "success",
            summary: "Loaded",
            detail: "Feedback Updated",
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

      setFeedbacks(_feedbacks);
      setBackupFeedbacks(_feedbacks);
      setFeedbackDialog(false);
      setFeedback(emptyFeedback);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: validationErrors.join(","),
        life: 3000,
      });
    }
  };

  const editFeedback = (feedback: Feedback) => {
    setFeedback({ ...feedback });
    setFeedbackDialog(true);
  };

  const confirmDeleteFeedback = (feedback: Feedback) => {
    setFeedback(feedback);
    setDeleteFeedbackDialog(true);
  };

  const deleteFeedback = async () => {
    let d = await feedbackService.deleteFeedback(feedback.id ?? "");
    if (d.error == undefined) {
      let _feedbacks = feedbacks.filter((val) => val.id !== feedback.id);
      setFeedbacks(_feedbacks);
      setBackupFeedbacks(_feedbacks);
      setDeleteFeedbackDialog(false);
      setFeedback(emptyFeedback);
      toast.current?.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Feedback Deleted",
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

    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Feedback Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteFeedbacksDialog(true);
  };

  const deleteSelectedFeedbacks = () => {
    let _feedbacks = feedbacks.filter(
      (val) => !selectedFeedbacks.includes(val)
    );
    setFeedbacks(_feedbacks);
    setDeleteFeedbacksDialog(false);
    setSelectedFeedbacks([]);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Feedbacks Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e: any, name: FeedbackKey) => {
    let val = (e.target && e.target.value) || "";
    let _feedback: Feedback = { ...feedback };
    _feedback[name] = val;
    setFeedback(_feedback);
  };
  const onInputBooleanChange = (e: any, name: FeedbackKey) => {
    let val = e.target.value;
    let _feedback: Feedback = { ...feedback };
    _feedback[name] = val;

    setFeedback(_feedback);
  };
  const onInputChange = (e: any, name: FeedbackKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;
    if (typeof val === "object") {
      if (val instanceof Date && isFinite(val.getTime())) {
        val = val;
      } else if ("value" in val) {
        let aVal = feedback[name];

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

    let _feedback: Feedback = { ...feedback };
    _feedback[name] = val;

    setFeedback(_feedback);
  };

  const onInputNumberChange = (e: any, name: FeedbackKey) => {
    let val = e.value || 0;
    let _feedback = { ...feedback };
    _feedback[name] = val;

    setFeedback(_feedback);
  };
  const getNewData = async (e: any, type: number = 0) => {
    setLoading(true);
    let searchObj: FeedbackQuery = {};
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

    let d = await feedbackService.getFeedback(searchObj);
    if (d.error == undefined) {
      setFeedbacks(d.docs);
      setBackupFeedbacks(d.docs);
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
      let _feedbacks = [...feedbacks];
      let filtered = _feedbacks.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
      setFeedbacks(filtered);
    } else if (val.length == 0) {
      // RETRIVE FROM BACKUP
      setFeedbacks(backupFeedbacks);
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
            disabled={!selectedFeedbacks || !selectedFeedbacks.length}
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

  const actionBodyTemplate = (rowData: Feedback) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editFeedback(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteFeedback(rowData)}
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
      <h5 className="m-0">Manage Feedbacks</h5>
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

  const feedbackDialogFooter = (
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
        onClick={saveFeedback}
      />
    </>
  );
  const deleteFeedbackDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFeedbackDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFeedback}
      />
    </>
  );
  const deleteFeedbacksDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFeedbacksDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedFeedbacks}
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
            value={feedbacks}
            selection={selectedFeedbacks}
            onSelectionChange={(e) =>
              setSelectedFeedbacks(e.value as Feedback[])
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Feedbacks"
            emptyMessage="No Feedbacks found."
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
              field="customerId"
              header="customerId"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filterField="customerId"
              filter
              filterElement={customerIdFilterTemplate}
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
              field="rating"
              header="rating"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              dataType="numeric"
              filter
              filterElement={ratingFilterTemplate}
            ></Column>

            <Column
              showAddButton={false}
              field="comment"
              header="comment"
              sortable
              headerStyle={{ minWidth: "10rem" }}
              filter
              filterPlaceholder="Search by comment"
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
            visible={feedbackDialog}
            style={{ width: "450px" }}
            header="Feedback Details"
            modal
            className="p-fluid"
            footer={feedbackDialogFooter}
            onHide={hideDialog}
          >
            <div dir={textFormat}>
              <div className="field">
                <label htmlFor="customerId">customerId</label>
                <Dropdown
                  id="customerId"
                  optionLabel="name"
                  optionValue="email"
                  value={feedback.customerId}
                  options={datacustomers}
                  onChange={(e) => onInputChange(e, "customerId")}
                />
              </div>

              <div className="field">
                <label htmlFor="chefId">chefId</label>
                <AutoComplete
                  field="name"
                  id="chefId"
                  completeMethod={searchChef}
                  value={feedback.chefId}
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
                  value={feedback.orderId}
                  suggestions={sugmealOrders}
                  onChange={(e) => onInputChange(e, "orderId")}
                />
              </div>

              <div className="field">
                <label htmlFor="rating">rating</label>
                <InputNumber
                  id="rating"
                  value={feedback.rating}
                  onValueChange={(e) => onInputNumberChange(e, "rating")}
                />
              </div>

              <div className="field">
                <label htmlFor="comment">comment</label>
                <InputText
                  id="comment"
                  value={feedback.comment}
                  onChange={(e) => onInputChange(e, "comment")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !feedback.comment,
                  })}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteFeedbackDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteFeedbackDialogFooter}
            onHide={hideDeleteFeedbackDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {feedback && (
                <span>
                  Are you sure you want to delete <b>Feedback record</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteFeedbacksDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteFeedbacksDialogFooter}
            onHide={hideDeleteFeedbacksDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {feedback && (
                <span>
                  Are you sure you want to delete the selected Feedback?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

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
