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
import {Kitchen,KitchenQuery,KitchenKey, KitchenService } from '@services/Kitchen';
import {Chef, ChefService } from '@services/Chef';

const KitchenPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'kitchenName',type:validate.text,max:20,min:3,required:true},
{id:'chefId',type:validate.array,required:false},
{id:'address',type:validate.text,max:1000,min:0,required:true},
{id:'geoTag',type:validate.text,max:0,min:0,required:true}
    ]
let emptyKitchen:Kitchen = {
    kitchenName: '',
address: '',
geoTag: ''
};
const [kitchens, setKitchens] = useState<Kitchen[]>([]);
const [backupKitchens, setBackupKitchens] =  useState<Kitchen[]>([]);
const [loading,setLoading] = useState(false);
const [kitchenDialog, setKitchenDialog] = useState(false);
const [deleteKitchenDialog, setDeleteKitchenDialog] = useState(false);
const [deleteKitchensDialog, setDeleteKitchensDialog] = useState(false);
const [kitchen, setKitchen] = useState<Kitchen>(emptyKitchen);
const [selectedKitchens, setSelectedKitchens] = useState<Kitchen[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Kitchen[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const kitchenService = new KitchenService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const chefService = new ChefService();
    const [sugchefs, setSugChefs] = useState<Chef[]>([]);
                    

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await kitchenService.getKitchen({limit:row});
    if(d.error==undefined ){
        setKitchens(d.docs);
        setBackupKitchens(d.docs);
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
        kitchenName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
chefId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
updateBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
updateAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};

    const searchChef=async(e:any)=>{
        if(e.query.trim().length>1){
            let dataChef_=  await chefService.getChefSuggestions(e.query.trim());
            setSugChefs(dataChef_.data);
        }
    }

const createAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const chefIdFilterTemplate = (options:any) => {
    return <AutoComplete field="name" value={options.value} multiple completeMethod={searchChef} suggestions={sugchefs} onChange={(e) => options.filterCallback(e.value, options.index)}  placeholder="Select a chefId" className="p-column-filter"  />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setKitchen(emptyKitchen);
    setSubmitted(false);
    setKitchenDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setKitchenDialog(false);
};

const hideDeleteKitchenDialog = () => {
    setDeleteKitchenDialog(false);
};

const hideDeleteKitchensDialog = () => {
    setDeleteKitchensDialog(false);
};

const saveKitchen = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(kitchen,validation)
        if (validationErrors.length==0) {
        let _kitchens:Kitchen[] = [...kitchens];
        let _kitchen:Kitchen = { ...kitchen };
        if (kitchen.id) {
        
            let d=  await kitchenService.updateKitchen(_kitchen);
                if(d.error==undefined){
                    
                    const index = _kitchens.findIndex(c => c.id === kitchen.id)
                    if (index !== -1) {
                        _kitchens[index] = {..._kitchen};
                       // _kitchens[index] = _kitchen;
                        //_kitchens.splice(index, 1, {..._kitchen,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Kitchen Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await kitchenService.addKitchen(_kitchen);
            if(d.error==undefined){
                var newID= d.id
               // _kitchens.unshift({..._kitchen,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Kitchen Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setKitchens(_kitchens);
        setBackupKitchens(_kitchens);
        setKitchenDialog(false);
        setKitchen(emptyKitchen);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editKitchen = (kitchen:Kitchen) => {
    setKitchen({ ...kitchen });
    setKitchenDialog(true);
};

const confirmDeleteKitchen = (kitchen:Kitchen) => {
    setKitchen(kitchen);
    setDeleteKitchenDialog(true);
};

const deleteKitchen = async() => {

    let d=  await kitchenService.deleteKitchen(kitchen.id??'');
    if(d.error==undefined){
        let _kitchens = kitchens.filter((val) => val.id !== kitchen.id);
        setKitchens(_kitchens);
        setBackupKitchens(_kitchens);
        setDeleteKitchenDialog(false);
        setKitchen(emptyKitchen);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Kitchen Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Kitchen Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteKitchensDialog(true);
};

const deleteSelectedKitchens = () => {
    let _kitchens = kitchens.filter((val) => !selectedKitchens.includes(val));
    setKitchens(_kitchens);
    setDeleteKitchensDialog(false);
    setSelectedKitchens([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kitchens Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:KitchenKey) => {
    let val = (e.target && e.target.value) || '';
    let _kitchen:Kitchen = { ...kitchen };
    _kitchen[name] = val;
    setKitchen(_kitchen);
};
const onInputBooleanChange=(e:any, name:KitchenKey)=>{
    let val =  e.target.value;
    let _kitchen:Kitchen = { ...kitchen };
    _kitchen[name] = val;

    setKitchen(_kitchen);
}
const onInputChange = (e:any, name:KitchenKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=kitchen[name];	
           	
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
    
    
    let _kitchen:Kitchen = { ...kitchen };
    _kitchen[name] = val;

    setKitchen(_kitchen);
};

const onInputNumberChange = (e: any, name:KitchenKey) => {
    let val = e.value || 0;
    let _kitchen = { ...kitchen };
    _kitchen[name] = val;

    setKitchen(_kitchen);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:KitchenQuery={}
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
        
        let d=  await kitchenService.getKitchen(searchObj);
        if(d.error==undefined ){
            
            setKitchens(d.docs);
            setBackupKitchens(d.docs);
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
        let _kitchens =[...kitchens];
        let filtered = _kitchens.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setKitchens(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setKitchens(backupKitchens);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedKitchens || !selectedKitchens.length} />
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



const actionBodyTemplate = (rowData:Kitchen) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editKitchen(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteKitchen(rowData)} />
        
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
        <h5 className="m-0">Manage Kitchens</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const kitchenDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveKitchen} />
    </>
);
const deleteKitchenDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteKitchenDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteKitchen} />
    </>
);
const deleteKitchensDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteKitchensDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedKitchens} />
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
                    value={kitchens}
                    selection={selectedKitchens}
                    onSelectionChange={(e) => setSelectedKitchens(e.value as Kitchen[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Kitchens"
                    emptyMessage="No Kitchens found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="kitchenName" header="Kitchen Name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by kitchenName" ></Column>
            

    <Column showAddButton={false}  field="chefId" header="Chef(s)" sortable  headerStyle={{ minWidth: '10rem' }} filterField="chefId"   filter filterElement={chefIdFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="address" header="Address" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by address" ></Column>
            

    <Column showAddButton={false}  field="createBy" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createBy" ></Column>
            

    <Column showAddButton={false}  field="createAt" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createAt" dataType="date" filter filterElement={createAtFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={kitchenDialog} style={{ width: '450px' }} header="Kitchen Details" modal className="p-fluid" footer={kitchenDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="kitchenName">Kitchen Name</label>
         <InputText id="kitchenName" value={kitchen.kitchenName} onChange={(e) => onInputChange(e, 'kitchenName')}    required className={classNames({ 'p-invalid': submitted && !kitchen.kitchenName })} />
    </div>
            

    <div className="field">
        <label htmlFor="chefId">Chef(s)</label>
         <AutoComplete field="name" id="chefId" multiple completeMethod={searchChef} value={kitchen.chefId} suggestions={sugchefs} onChange={(e) => onInputChange(e, 'chefId')}  />
    </div>
            

    <div className="field">
        <label htmlFor="address">Address</label>
         <InputText id="address" value={kitchen.address} onChange={(e) => onInputChange(e, 'address')}    required className={classNames({ 'p-invalid': submitted && !kitchen.address })} />
    </div>
            

    <div className="field">
        <label htmlFor="geoTag">Geo Location Tag</label>
         <InputText id="geoTag" value={kitchen.geoTag} onChange={(e) => onInputChange(e, 'geoTag')}    required className={classNames({ 'p-invalid': submitted && !kitchen.geoTag })} />
    </div>
            
                </Dialog>

                <Dialog visible={deleteKitchenDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKitchenDialogFooter} onHide={hideDeleteKitchenDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {kitchen && (
                            <span>
                                Are you sure you want to delete <b>Kitchen record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteKitchensDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKitchensDialogFooter} onHide={hideDeleteKitchensDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {kitchen && <span>Are you sure you want to delete the selected Kitchen?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default KitchenPage;
        
       
        