import getConfig from 'next/config';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable,DataTableFilterMeta,DataTableFilterEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import {MultiSelect} from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import {validateForm,validate} from '@lib/validation'
import {ListType,SortType} from '@services/CommonTypes'
import { useRouter } from 'next/router'
import Link from 'next/link';
import config from "@config/index"; 
import {Delivery,DeliveryQuery,DeliveryKey, DeliveryService } from '@services/Delivery';
import {MealOrder, MealOrderService } from '@services/MealOrder';
import {Chef, ChefService } from '@services/Chef';

const DeliveryPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'orderId',type:validate.text,required:true},
{id:'chefId',type:validate.text,required:true},
{id:'deliveryPersonId',type:validate.text,max:90,min:0,required:true},
{id:'deliveryStatus',type:validate.text,required:true},
{id:'deliverdate',type:validate.datetime,max:0,min:0,required:true}
    ]
let emptyDelivery:Delivery = {
    orderId: '',
chefId: '',
deliveryPersonId: '',
deliveryStatus: '',
deliverdate: new Date()
};
const [deliverys, setDeliverys] = useState<Delivery[]>([]);
const [backupDeliverys, setBackupDeliverys] =  useState<Delivery[]>([]);
const [loading,setLoading] = useState(false);
const [deliveryDialog, setDeliveryDialog] = useState(false);
const [deleteDeliveryDialog, setDeleteDeliveryDialog] = useState(false);
const [deleteDeliverysDialog, setDeleteDeliverysDialog] = useState(false);
const [delivery, setDelivery] = useState<Delivery>(emptyDelivery);
const [selectedDeliverys, setSelectedDeliverys] = useState<Delivery[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Delivery[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const deliveryService = new DeliveryService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const mealorderService = new MealOrderService();
    const [sugmealOrders, setSugMealOrders] = useState<MealOrder[]>([]);
                    
    const chefService = new ChefService();
    const [sugchefs, setSugChefs] = useState<Chef[]>([]);
                    

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await deliveryService.getDelivery({limit:row});
    if(d.error==undefined ){
        setDeliverys(d.docs);
        setBackupDeliverys(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
        
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data Loaded', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
   })()
    initFilters1();
    
}, [refreshFlag]);
const initFilters1 = () => {
    setFilters1({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
updateBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
updateAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
orderId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
chefId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
deliveryPersonId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
deliveryStatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
deliverdate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
kitchen: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};

    const searchMealOrder=async(e:any)=>{
        if(e.query.trim().length>1){
            let dataMealOrder_=  await mealorderService.getMealOrderSuggestions(e.query.trim());
            setSugMealOrders(dataMealOrder_.data);
        }
    }

    const searchChef=async(e:any)=>{
        if(e.query.trim().length>1){
            let dataChef_=  await chefService.getChefSuggestions(e.query.trim());
            setSugChefs(dataChef_.data);
        }
    }

    const datadeliveryStatuss =[
	{value:"Pending",name:"Pending"},
	{value:"Completed",name:"Completed"},
	{value:"Cancelled",name:"Cancelled"}
]
                

const createAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const orderIdFilterTemplate = (options:any) => {
    return <AutoComplete field="invoiceNo" value={options.value}  completeMethod={searchMealOrder} suggestions={sugmealOrders} onChange={(e) => options.filterCallback(e.value, options.index)}  placeholder="Select a orderId" className="p-column-filter"  />;
            };
            
const chefIdFilterTemplate = (options:any) => {
    return <AutoComplete field="name" value={options.value}  completeMethod={searchChef} suggestions={sugchefs} onChange={(e) => options.filterCallback(e.value, options.index)}  placeholder="Select a chefId" className="p-column-filter"  />;
            };
            
    const deliveryStatusFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">DeliveryStatus Picker</div>
                <Dropdown value={options.value} options={datadeliveryStatuss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="value" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const deliverdateFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setDelivery(emptyDelivery);
    setSubmitted(false);
    setDeliveryDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setDeliveryDialog(false);
};

const hideDeleteDeliveryDialog = () => {
    setDeleteDeliveryDialog(false);
};

const hideDeleteDeliverysDialog = () => {
    setDeleteDeliverysDialog(false);
};

const saveDelivery = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(delivery,validation)
        if (validationErrors.length==0) {
        let _deliverys:Delivery[] = [...deliverys];
        let _delivery:Delivery = { ...delivery };
        if (delivery.id) {
        
            let d=  await deliveryService.updateDelivery(_delivery);
                if(d.error==undefined){
                    
                    const index = _deliverys.findIndex(c => c.id === delivery.id)
                    if (index !== -1) {
                        _deliverys[index] = {..._delivery};
                       // _deliverys[index] = _delivery;
                        //_deliverys.splice(index, 1, {..._delivery,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Delivery Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await deliveryService.addDelivery(_delivery);
            if(d.error==undefined){
                var newID= d.id
               // _deliverys.unshift({..._delivery,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Delivery Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setDeliverys(_deliverys);
        setBackupDeliverys(_deliverys);
        setDeliveryDialog(false);
        setDelivery(emptyDelivery);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editDelivery = (delivery:Delivery) => {
    setDelivery({ ...delivery });
    setDeliveryDialog(true);
};

const confirmDeleteDelivery = (delivery:Delivery) => {
    setDelivery(delivery);
    setDeleteDeliveryDialog(true);
};

const deleteDelivery = async() => {

    let d=  await deliveryService.deleteDelivery(delivery.id??'');
    if(d.error==undefined){
        let _deliverys = deliverys.filter((val) => val.id !== delivery.id);
        setDeliverys(_deliverys);
        setBackupDeliverys(_deliverys);
        setDeleteDeliveryDialog(false);
        setDelivery(emptyDelivery);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Delivery Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Delivery Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteDeliverysDialog(true);
};

const deleteSelectedDeliverys = () => {
    let _deliverys = deliverys.filter((val) => !selectedDeliverys.includes(val));
    setDeliverys(_deliverys);
    setDeleteDeliverysDialog(false);
    setSelectedDeliverys([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Deliverys Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:DeliveryKey) => {
    let val = (e.target && e.target.value) || '';
    let _delivery:Delivery = { ...delivery };
    _delivery[name] = val;
    setDelivery(_delivery);
};
const onInputBooleanChange=(e:any, name:DeliveryKey)=>{
    let val =  e.target.value;
    let _delivery:Delivery = { ...delivery };
    _delivery[name] = val;

    setDelivery(_delivery);
}
const onInputChange = (e:any, name:DeliveryKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=delivery[name];	
           	
            if(ctrlType=="radio"){	
                aVal = val.value;	
            }else if(ctrlType=="checkbox"){	
            	
                if (e.checked){	
                    aVal.push(val.value);	
                }else{	
                    aVal = aVal.filter((d:any) => d !== e.target.value.value);	
                }	
            }	
            val = aVal;	
        }else{	
            val= val[name]?val[name]:val	
        }	
        	
    }	
    
    
    let _delivery:Delivery = { ...delivery };
    _delivery[name] = val;

    setDelivery(_delivery);
};

const onInputNumberChange = (e: any, name:DeliveryKey) => {
    let val = e.value || 0;
    let _delivery = { ...delivery };
    _delivery[name] = val;

    setDelivery(_delivery);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:DeliveryQuery={}
    for (const key in e.filters) {  
    
        if(e.filters[key].constraints){
            if(e.filters[key].constraints[0].value){
                searchObj={...searchObj,[key]:e.filters[key].constraints[0].value,[key+'_mode']:e.filters[key].constraints[0].matchMode}
            }
        }
        }
        if(type==0){ // FILTER Data and start with page 0
        searchObj={...searchObj,page:0,limit:row}
        }else if(type==1){ // Change page number
        searchObj={...searchObj,page:e.page,limit:row}
        }else if(type==2){ // Change page number
        let sort:SortType={}
        if(sortOrders){
            let currentSortOrder = sortOrders[e.sortField]==1?-1:1
            sort={...sortOrders,[e.sortField]:currentSortOrder}
        
        }else{
            sort={[e.sortField]:1}
        }
        
        setSortOrders(sort);

        searchObj={...searchObj,page:e.page,limit:row,sortBy:e.sortField,sortDirection:sortOrders[e.sortField]}
        }
        if(e.rows!==row){
        setRow(e.rows)
        searchObj={...searchObj,page:0,limit:e.rows}
        }
        
        let d=  await deliveryService.getDelivery(searchObj);
        if(d.error==undefined ){
            
            setDeliverys(d.docs);
            setBackupDeliverys(d.docs);
            setLoading(false)
            setTotalRecords(d.count)
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data retrived', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
}
const filterAction=async(e:DataTableFilterEvent)=>{
    await getNewData(e,0)
}
const changePage =async(e:DataTableFilterEvent)=>{
    await getNewData(e,1)
}
const sortData=async(e:DataTableFilterEvent)=>{

    await getNewData(e,2)
}

const localFilter=(val:string)=>{
    
    if(val.length>1){
        let _deliverys =[...deliverys];
        let filtered = _deliverys.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setDeliverys(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setDeliverys(backupDeliverys);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDeliverys || !selectedDeliverys.length} />
            </div>
        </React.Fragment>
    );
};

const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );
};



const actionBodyTemplate = (rowData:Delivery) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDelivery(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDelivery(rowData)} />
        
            <Link 
                href={{
                pathname: asPath+"/"+rowData.id
                }}

            >
            <Button icon="pi pi-book" className="p-button-rounded p-button-success" />
            </Link>

        </>
    );
};

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Manage Deliverys</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const deliveryDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDelivery} />
    </>
);
const deleteDeliveryDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDeliveryDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDelivery} />
    </>
);
const deleteDeliverysDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDeliverysDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDeliverys} />
    </>
);

return (
    <div className="grid crud-demo">
        <div className="col-12">
            <div className="card">
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    ref={dt}
                    value={deliverys}
                    selection={selectedDeliverys}
                    onSelectionChange={(e) => setSelectedDeliverys(e.value as Delivery[])}
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
                    rowsPerPageOptions={[1,5, 10, 25,50]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Deliverys"
                    emptyMessage="No Deliverys found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="createBy" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createBy" ></Column>
            

    <Column showAddButton={false}  field="createAt" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createAt" dataType="date" filter filterElement={createAtFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="updateBy" header="Update By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by updateBy" ></Column>
            

    <Column showAddButton={false}  field="updateAt" header="Update At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="updateAt" dataType="date" filter filterElement={updateAtFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="orderId" header="orderId" sortable  headerStyle={{ minWidth: '10rem' }} filterField="orderId"   filter filterElement={orderIdFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="chefId" header="chefId" sortable  headerStyle={{ minWidth: '10rem' }} filterField="chefId"   filter filterElement={chefIdFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="deliveryPersonId" header="Delivery Person" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by deliveryPersonId" ></Column>
            

    <Column showAddButton={false}  field="deliveryStatus" header="deliveryStatus" sortable  headerStyle={{ minWidth: '10rem' }} filterField="deliveryStatus"   filter filterElement={deliveryStatusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="deliverdate" header="Delivery date" sortable  headerStyle={{ minWidth: '10rem' }} filterField="deliverdate" dataType="date" filter filterElement={deliverdateFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="kitchen" header="Kitchen" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by kitchen" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={deliveryDialog} style={{ width: '450px' }} header="Delivery Details" modal className="p-fluid" footer={deliveryDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="orderId">orderId</label>
         <AutoComplete field="invoiceNo" id="orderId"  completeMethod={searchMealOrder} value={delivery.orderId} suggestions={sugmealOrders} onChange={(e) => onInputChange(e, 'orderId')}  />
    </div>
            

    <div className="field">
        <label htmlFor="chefId">chefId</label>
         <AutoComplete field="name" id="chefId"  completeMethod={searchChef} value={delivery.chefId} suggestions={sugchefs} onChange={(e) => onInputChange(e, 'chefId')}  />
    </div>
            

    <div className="field">
        <label htmlFor="deliveryPersonId">Delivery Person</label>
         <InputText id="deliveryPersonId" value={delivery.deliveryPersonId} onChange={(e) => onInputChange(e, 'deliveryPersonId')}    required className={classNames({ 'p-invalid': submitted && !delivery.deliveryPersonId })} />
    </div>
            

    <div className="field">
        <label htmlFor="deliveryStatus">deliveryStatus</label>
         <Dropdown   id="deliveryStatus" optionLabel="name"  value={delivery.deliveryStatus} options={datadeliveryStatuss} onChange={(e) => onInputChange(e, 'deliveryStatus')}  />
    </div>
            

    <div className="field">
        <label htmlFor="deliverdate">Delivery date</label>
         <Calendar id="deliverdate" value={delivery.deliverdate?new Date(delivery.deliverdate):null }  onChange={(e) => onInputChange(e, 'deliverdate')} showTime hourFormat="12"     required className={classNames({ 'p-invalid': submitted && !delivery.deliverdate })} />
    </div>
            
                </Dialog>

                <Dialog visible={deleteDeliveryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDeliveryDialogFooter} onHide={hideDeleteDeliveryDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {delivery && (
                            <span>
                                Are you sure you want to delete <b>Delivery record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteDeliverysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDeliverysDialogFooter} onHide={hideDeleteDeliverysDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {delivery && <span>Are you sure you want to delete the selected Delivery?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default DeliveryPage;
        
       
        