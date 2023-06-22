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
import {MealPlan,MealPlanQuery,MealPlanKey, MealPlanService } from '@services/MealPlan';
import {MealItem, MealItemService } from '@services/MealItem';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const MealPlanPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'meals',type:validate.array,required:true},
{id:'quantity',type:validate.int,max:1000,min:1,required:true},
{id:'name',type:validate.text,max:50,min:0,required:true},
{id:'price',type:validate.number,max:1000,min:0,required:true},
{id:'description',type:validate.text,max:500,min:0,required:false},
{id:'code',type:validate.text,max:30,min:0,required:false}
    ]
let emptyMealPlan:MealPlan = {
    meals: [],
quantity: 0,
name: '',
price: 0
};
const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
const [backupMealPlans, setBackupMealPlans] =  useState<MealPlan[]>([]);
const [loading,setLoading] = useState(false);
const [mealPlanDialog, setMealPlanDialog] = useState(false);
const [deleteMealPlanDialog, setDeleteMealPlanDialog] = useState(false);
const [deleteMealPlansDialog, setDeleteMealPlansDialog] = useState(false);
const [mealPlan, setMealPlan] = useState<MealPlan>(emptyMealPlan);
const [selectedMealPlans, setSelectedMealPlans] = useState<MealPlan[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<MealPlan[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const mealplanService = new MealPlanService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const mealitemService = new MealItemService();
    const [sugmealItems, setSugMealItems] = useState<MealItem[]>([]);
                    
    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await mealplanService.getMealPlan({limit:row});
    if(d.error==undefined ){
        setMealPlans(d.docs);
        setBackupMealPlans(d.docs);
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
        meals: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
quantity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
updateBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
updateAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};

    const searchMealItem=async(e:any)=>{
        if(e.query.trim().length>1){
            let dataMealItem_=  await mealitemService.getMealItemSuggestions(e.query.trim());
            setSugMealItems(dataMealItem_.data);
        }
    }
    
    const imageBodyTemplate = (rowData:MealPlan) => {  
    let imageURL= config.serverURI+"/"+rowData.image
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="images/*"
    if(rowData.image!=undefined && rowData.image!=''){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="image"  preview downloadable width="250" /> ;
    }else if(rowData.image==undefined || rowData.image=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src="/photo_na.png"  alt="image" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'image',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              

    const downloadFile=(data:MealPlan,dbColName:MealPlanKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:MealPlanKey) => {
        let _mealPlan = {...mealPlan,[colName]:newUploadedFileName}
        let _mealPlans = [...mealPlans];
        const index = _mealPlans.findIndex(c => c.id === mealPlan.id)
        if (index !== -1) {
            _mealPlans[index] = _mealPlan;
        }
        setMealPlan(_mealPlan);
        setMealPlans(_mealPlans);
                
    };
    const showUploadDialog = (mealPlan:MealPlan,dbColName:string,accept:string="images/*") => {
        setMealPlan({ ...mealPlan });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
const createAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const mealsFilterTemplate = (options:any) => {
    return <AutoComplete field="name" value={options.value} multiple completeMethod={searchMealItem} suggestions={sugmealItems} onChange={(e) => options.filterCallback(e.value, options.index)}  placeholder="Select a meals" className="p-column-filter"  />;
            };
            
const quantityFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const priceFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setMealPlan(emptyMealPlan);
    setSubmitted(false);
    setMealPlanDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setMealPlanDialog(false);
};

const hideDeleteMealPlanDialog = () => {
    setDeleteMealPlanDialog(false);
};

const hideDeleteMealPlansDialog = () => {
    setDeleteMealPlansDialog(false);
};

const saveMealPlan = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(mealPlan,validation)
        if (validationErrors.length==0) {
        let _mealPlans:MealPlan[] = [...mealPlans];
        let _mealPlan:MealPlan = { ...mealPlan };
        if (mealPlan.id) {
        
            let d=  await mealplanService.updateMealPlan(_mealPlan);
                if(d.error==undefined){
                    
                    const index = _mealPlans.findIndex(c => c.id === mealPlan.id)
                    if (index !== -1) {
                        _mealPlans[index] = {..._mealPlan};
                       // _mealPlans[index] = _mealPlan;
                        //_mealPlans.splice(index, 1, {..._mealPlan,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'MealPlan Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await mealplanService.addMealPlan(_mealPlan);
            if(d.error==undefined){
                var newID= d.id
               // _mealPlans.unshift({..._mealPlan,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'MealPlan Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setMealPlans(_mealPlans);
        setBackupMealPlans(_mealPlans);
        setMealPlanDialog(false);
        setMealPlan(emptyMealPlan);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editMealPlan = (mealPlan:MealPlan) => {
    setMealPlan({ ...mealPlan });
    setMealPlanDialog(true);
};

const confirmDeleteMealPlan = (mealPlan:MealPlan) => {
    setMealPlan(mealPlan);
    setDeleteMealPlanDialog(true);
};

const deleteMealPlan = async() => {

    let d=  await mealplanService.deleteMealPlan(mealPlan.id??'');
    if(d.error==undefined){
        let _mealPlans = mealPlans.filter((val) => val.id !== mealPlan.id);
        setMealPlans(_mealPlans);
        setBackupMealPlans(_mealPlans);
        setDeleteMealPlanDialog(false);
        setMealPlan(emptyMealPlan);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'MealPlan Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealPlan Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteMealPlansDialog(true);
};

const deleteSelectedMealPlans = () => {
    let _mealPlans = mealPlans.filter((val) => !selectedMealPlans.includes(val));
    setMealPlans(_mealPlans);
    setDeleteMealPlansDialog(false);
    setSelectedMealPlans([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'MealPlans Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:MealPlanKey) => {
    let val = (e.target && e.target.value) || '';
    let _mealPlan:MealPlan = { ...mealPlan };
    _mealPlan[name] = val;
    setMealPlan(_mealPlan);
};
const onInputBooleanChange=(e:any, name:MealPlanKey)=>{
    let val =  e.target.value;
    let _mealPlan:MealPlan = { ...mealPlan };
    _mealPlan[name] = val;

    setMealPlan(_mealPlan);
}
const onInputChange = (e:any, name:MealPlanKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=mealPlan[name];	
           	
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
    
    
    let _mealPlan:MealPlan = { ...mealPlan };
    _mealPlan[name] = val;

    setMealPlan(_mealPlan);
};

const onInputNumberChange = (e: any, name:MealPlanKey) => {
    let val = e.value || 0;
    let _mealPlan = { ...mealPlan };
    _mealPlan[name] = val;

    setMealPlan(_mealPlan);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:MealPlanQuery={}
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
        
        let d=  await mealplanService.getMealPlan(searchObj);
        if(d.error==undefined ){
            
            setMealPlans(d.docs);
            setBackupMealPlans(d.docs);
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
        let _mealPlans =[...mealPlans];
        let filtered = _mealPlans.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setMealPlans(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setMealPlans(backupMealPlans);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedMealPlans || !selectedMealPlans.length} />
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



const actionBodyTemplate = (rowData:MealPlan) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMealPlan(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMealPlan(rowData)} />
        
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
        <h5 className="m-0">Manage MealPlans</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const mealPlanDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMealPlan} />
    </>
);
const deleteMealPlanDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMealPlanDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMealPlan} />
    </>
);
const deleteMealPlansDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMealPlansDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMealPlans} />
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
                    value={mealPlans}
                    selection={selectedMealPlans}
                    onSelectionChange={(e) => setSelectedMealPlans(e.value as MealPlan[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealPlans"
                    emptyMessage="No MealPlans found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="image" header="Image" sortable  headerStyle={{ minWidth: '10rem' }}  body={imageBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="meals" header="Item Name" sortable  headerStyle={{ minWidth: '10rem' }} filterField="meals"   filter filterElement={mealsFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="quantity" header="Quantity" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={quantityFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="name" header="name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by name" ></Column>
            

    <Column showAddButton={false}  field="price" header="price" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={priceFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="description" header="description" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by description" ></Column>
            

    <Column showAddButton={false}  field="code" header="code" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by code" ></Column>
            

    <Column showAddButton={false}  field="createBy" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createBy" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={mealPlanDialog} style={{ width: '450px' }} header="MealPlan Details" modal className="p-fluid" footer={mealPlanDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="meals">Item Name</label>
         <AutoComplete field="name" id="meals" multiple completeMethod={searchMealItem} value={mealPlan.meals} suggestions={sugmealItems} onChange={(e) => onInputChange(e, 'meals')}  />
    </div>
            

    <div className="field">
        <label htmlFor="quantity">Quantity</label>
         <InputNumber id="quantity" value={mealPlan.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')}  />
    </div>
            

    <div className="field">
        <label htmlFor="name">name</label>
         <InputText id="name" value={mealPlan.name} onChange={(e) => onInputChange(e, 'name')}    required className={classNames({ 'p-invalid': submitted && !mealPlan.name })} />
    </div>
            

    <div className="field">
        <label htmlFor="price">price</label>
         <InputNumber id="price" value={mealPlan.price} onValueChange={(e) => onInputNumberChange(e, 'price')}  />
    </div>
            

    <div className="field">
        <label htmlFor="description">description</label>
         <InputTextarea id="description" value={mealPlan.description} onChange={(e) => onInputChange(e, 'description')} rows={5} cols={30}    />
    </div>
            


    <div className="field">
        <label htmlFor="code">code</label>
         <InputText id="code" value={mealPlan.code} onChange={(e) => onInputChange(e, 'code')}    />
    </div>
            
                </Dialog>

                <Dialog visible={deleteMealPlanDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMealPlanDialogFooter} onHide={hideDeleteMealPlanDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {mealPlan && (
                            <span>
                                Are you sure you want to delete <b>MealPlan record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteMealPlansDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMealPlansDialogFooter} onHide={hideDeleteMealPlansDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {mealPlan && <span>Are you sure you want to delete the selected MealPlan?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof MealPlan)} url={uploadInfo?.url} table="mealPlan" tableId={mealPlan.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default MealPlanPage;
        
       
        