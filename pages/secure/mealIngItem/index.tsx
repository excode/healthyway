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
import {MealIngItem,MealIngItemQuery,MealIngItemKey, MealIngItemService } from '@services/MealIngItem';
import {Ingredient, IngredientService } from '@services/Ingredient';

const MealIngItemPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'ingredients',type:validate.text,required:true},
{id:'quantity',type:validate.int,max:5,min:0,required:true}
    ]
let emptyMealIngItem:MealIngItem = {
    quantity: 0,
ingredients: ''
};
const [mealIngItems, setMealIngItems] = useState<MealIngItem[]>([]);
const [backupMealIngItems, setBackupMealIngItems] =  useState<MealIngItem[]>([]);
const [loading,setLoading] = useState(false);
const [mealIngItemDialog, setMealIngItemDialog] = useState(false);
const [deleteMealIngItemDialog, setDeleteMealIngItemDialog] = useState(false);
const [deleteMealIngItemsDialog, setDeleteMealIngItemsDialog] = useState(false);
const [mealIngItem, setMealIngItem] = useState<MealIngItem>(emptyMealIngItem);
const [selectedMealIngItems, setSelectedMealIngItems] = useState<MealIngItem[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<MealIngItem[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const mealingitemService = new MealIngItemService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const ingredientService = new IngredientService();
    const [dataingredients, setDataIngredients] = useState<Ingredient[]>([]);

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await mealingitemService.getMealIngItem({limit:row});
    if(d.error==undefined ){
        setMealIngItems(d.docs);
        setBackupMealIngItems(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataIngredients_=  await ingredientService.getIngredientAll({});
    setDataIngredients(dataIngredients_.data);
              
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
        ingredients: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
quantity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
updateBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
updateAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
kitchen: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};


const createAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateAtFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const quantityFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
    const ingredientsFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Ingredients Picker</div>
                <Dropdown value={options.value} options={dataingredients}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="itemCode" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setMealIngItem(emptyMealIngItem);
    setSubmitted(false);
    setMealIngItemDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setMealIngItemDialog(false);
};

const hideDeleteMealIngItemDialog = () => {
    setDeleteMealIngItemDialog(false);
};

const hideDeleteMealIngItemsDialog = () => {
    setDeleteMealIngItemsDialog(false);
};

const saveMealIngItem = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(mealIngItem,validation)
        if (validationErrors.length==0) {
        let _mealIngItems:MealIngItem[] = [...mealIngItems];
        let _mealIngItem:MealIngItem = { ...mealIngItem };
        if (mealIngItem.id) {
        
            let d=  await mealingitemService.updateMealIngItem(_mealIngItem);
                if(d.error==undefined){
                    
                    const index = _mealIngItems.findIndex(c => c.id === mealIngItem.id)
                    if (index !== -1) {
                        _mealIngItems[index] = {..._mealIngItem};
                       // _mealIngItems[index] = _mealIngItem;
                        //_mealIngItems.splice(index, 1, {..._mealIngItem,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'MealIngItem Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await mealingitemService.addMealIngItem(_mealIngItem);
            if(d.error==undefined){
                var newID= d.id
               // _mealIngItems.unshift({..._mealIngItem,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'MealIngItem Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setMealIngItems(_mealIngItems);
        setBackupMealIngItems(_mealIngItems);
        setMealIngItemDialog(false);
        setMealIngItem(emptyMealIngItem);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editMealIngItem = (mealIngItem:MealIngItem) => {
    setMealIngItem({ ...mealIngItem });
    setMealIngItemDialog(true);
};

const confirmDeleteMealIngItem = (mealIngItem:MealIngItem) => {
    setMealIngItem(mealIngItem);
    setDeleteMealIngItemDialog(true);
};

const deleteMealIngItem = async() => {

    let d=  await mealingitemService.deleteMealIngItem(mealIngItem.id??'');
    if(d.error==undefined){
        let _mealIngItems = mealIngItems.filter((val) => val.id !== mealIngItem.id);
        setMealIngItems(_mealIngItems);
        setBackupMealIngItems(_mealIngItems);
        setDeleteMealIngItemDialog(false);
        setMealIngItem(emptyMealIngItem);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'MealIngItem Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MealIngItem Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteMealIngItemsDialog(true);
};

const deleteSelectedMealIngItems = () => {
    let _mealIngItems = mealIngItems.filter((val) => !selectedMealIngItems.includes(val));
    setMealIngItems(_mealIngItems);
    setDeleteMealIngItemsDialog(false);
    setSelectedMealIngItems([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'MealIngItems Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:MealIngItemKey) => {
    let val = (e.target && e.target.value) || '';
    let _mealIngItem:MealIngItem = { ...mealIngItem };
    _mealIngItem[name] = val;
    setMealIngItem(_mealIngItem);
};
const onInputBooleanChange=(e:any, name:MealIngItemKey)=>{
    let val =  e.target.value;
    let _mealIngItem:MealIngItem = { ...mealIngItem };
    _mealIngItem[name] = val;

    setMealIngItem(_mealIngItem);
}
const onInputChange = (e:any, name:MealIngItemKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=mealIngItem[name];	
           	
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
    
    
    let _mealIngItem:MealIngItem = { ...mealIngItem };
    _mealIngItem[name] = val;

    setMealIngItem(_mealIngItem);
};

const onInputNumberChange = (e: any, name:MealIngItemKey) => {
    let val = e.value || 0;
    let _mealIngItem = { ...mealIngItem };
    _mealIngItem[name] = val;

    setMealIngItem(_mealIngItem);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:MealIngItemQuery={}
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
        
        let d=  await mealingitemService.getMealIngItem(searchObj);
        if(d.error==undefined ){
            
            setMealIngItems(d.docs);
            setBackupMealIngItems(d.docs);
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
        let _mealIngItems =[...mealIngItems];
        let filtered = _mealIngItems.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setMealIngItems(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setMealIngItems(backupMealIngItems);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedMealIngItems || !selectedMealIngItems.length} />
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



const actionBodyTemplate = (rowData:MealIngItem) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editMealIngItem(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMealIngItem(rowData)} />
        
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
        <h5 className="m-0">Manage MealIngItems</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const mealIngItemDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMealIngItem} />
    </>
);
const deleteMealIngItemDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMealIngItemDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMealIngItem} />
    </>
);
const deleteMealIngItemsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMealIngItemsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedMealIngItems} />
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
                    value={mealIngItems}
                    selection={selectedMealIngItems}
                    onSelectionChange={(e) => setSelectedMealIngItems(e.value as MealIngItem[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} MealIngItems"
                    emptyMessage="No MealIngItems found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="ingredients" header="ingredients" sortable  headerStyle={{ minWidth: '10rem' }} filterField="ingredients"   filter filterElement={ingredientsFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="quantity" header="quantity" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={quantityFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="createBy" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createBy" ></Column>
            

    <Column showAddButton={false}  field="createAt" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createAt" dataType="date" filter filterElement={createAtFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={mealIngItemDialog} style={{ width: '450px' }} header="MealIngItem Details" modal className="p-fluid" footer={mealIngItemDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="ingredients">ingredients</label>
         <Dropdown   id="ingredients"  optionLabel="name" optionValue="itemCode"  value={mealIngItem.ingredients} options={dataingredients} onChange={(e) => onInputChange(e, 'ingredients')}  />
    </div>
            

    <div className="field">
        <label htmlFor="quantity">quantity</label>
         <InputNumber id="quantity" value={mealIngItem.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteMealIngItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMealIngItemDialogFooter} onHide={hideDeleteMealIngItemDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {mealIngItem && (
                            <span>
                                Are you sure you want to delete <b>MealIngItem record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteMealIngItemsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMealIngItemsDialogFooter} onHide={hideDeleteMealIngItemsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {mealIngItem && <span>Are you sure you want to delete the selected MealIngItem?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default MealIngItemPage;
        
       
        