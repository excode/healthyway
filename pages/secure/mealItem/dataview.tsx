
    /* eslint-disable @next/next/no-img-element */
    import React, { useState, useEffect,useRef } from 'react';
    import { DataView, DataViewLayoutOptions, DataViewPageEvent } from 'primereact/dataview';
    import { Button } from 'primereact/button';
    import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
    import { Rating } from 'primereact/rating';
    import config from "@config/index"; 
    import { InputText } from 'primereact/inputtext';
    import { Toast } from 'primereact/toast';
    import {MealItem,MealItemQuery, MealItemService } from '@services/MealItem';
    import { LayoutType, SortOrderType } from '../../../types/types';
    import { SortType } from '@services/CommonTypes';
    
    
    const MealItemDataview = () => {
        const [globalFilterValue, setGlobalFilterValue] = useState('');
        const [layout, setLayout] = useState<LayoutType>('grid');
        const [sortKey, setSortKey] = useState(null);
        const [sortOrder, setSortOrder] = useState<SortOrderType>(0);
        const [sortField, setSortField] = useState('');
        
        const [mealItems, setMealItems] = useState<MealItem[]>([]);
        const [mealItemsBackup, setMealItemsBackup] = useState<MealItem[]>([]);
        const [loading,setLoading] = useState(false);
        const [row, setRow] = useState<number>(9);
        const [totalRecords, setTotalRecords] = useState<number>(0);
        const toast = useRef<Toast>(null);
        const [sortOrders, setSortOrders] = useState<SortType>({});
        const mealitemService = new MealItemService();
    
        const sortOptions = [
            
            { label: 'Date new to old', value: '!id' },
            { label: 'Date old to new', value: 'id' }
        ];
    
        useEffect(() => {
            setLoading(true);
            (async() => {
            let d=  await mealitemService.getMealItem({limit:row});
            if(d.error==undefined ){
                setMealItems(d.docs);
                setMealItemsBackup(d.docs);
                setLoading(false)
                setTotalRecords(d.count)
                         
                }else{
                    setLoading(false)
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           })()
           
            
        }, []);
        const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.toLowerCase();
            setGlobalFilterValue(value);
            if (value.length === 0) {
                setMealItems(mealItemsBackup)
            } else {
                const filtered = mealItems!.filter((mealItem:MealItem) => {
                    return (mealItem.createBy.toLowerCase().includes(value)||mealItem.updateBy.toLowerCase().includes(value)||mealItem.name.toLowerCase().includes(value)||mealItem.groupName.toLowerCase().includes(value)||mealItem.code.toLowerCase().includes(value)||mealItem.kitchen.toLowerCase().includes(value)) ;
                });
                setMealItems(filtered);
            }
           
        };
        const onSortChange = (event: DropdownChangeEvent) => {
            const value = event.value;
    
            if (value.indexOf('!') === 0) {
                setSortOrder(-1);
                setSortField(value.substring(1, value.length));
                setSortKey(value);
            } else {
                setSortOrder(1);
                setSortField(value);
                setSortKey(value);
            }
        };
    
        const dataViewHeader = (
            <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By" onChange={onSortChange} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                   
                    <InputText  value={globalFilterValue} onChange={onFilter} placeholder="Search by" />
                   
                </span>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as LayoutType)} />
            </div>
        );
        const changePage =async(e:DataViewPageEvent)=>{
            await getNewData(e)
        }
       
        const getNewData =async(e:any)=>{
            setLoading(true)
            let type = row==e.rows ?1:0;
            
            let searchObj:MealItemQuery={}
        
                if(type==0){ // Chnage row number
                searchObj={...searchObj,page:0,limit:row}
                }else if(type==1){ // Change page number
                searchObj={...searchObj,page:e.page,limit:row}
                }
                if(e.rows!==row){
                setRow(e.rows)
                }
                
                let d=  await mealitemService.getMealItem(searchObj);
                if(d.error==undefined ){   
                    setMealItems(d.docs);
                    setMealItemsBackup(d.docs);
                    setLoading(false)
                    setTotalRecords(d.count)
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data retrived', life: 3000 });
                }else{
                    setLoading(false)
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
        }
        const dataviewListItem = (data: MealItem) => {
            return (
                <div className="col-12">
                    <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    {(data.image!=undefined  ) 
                      ?  <img src={`${config.serverURI}/${data.image}`} alt={data.createBy} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                      :  <img src={"/photo_na.png"} alt={data.createBy} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    }
                        <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                            <div className="font-bold text-2xl">{data.createBy}</div>
                            <div className="mb-2">{data.updateBy}</div>
                            <Rating value={2} readOnly cancel={false} className="mb-2"></Rating>
                            <div className="flex align-items-center">
                                <i className="pi pi-tag mr-2"></i>
                                <span className="font-semibold">{data.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                            <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">$ {data.price}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.id === 'OUTOFSTOCK'} className="mb-2 p-button-sm"></Button>
                            <span className={`product-badge status-active`}>{data.id}</span>
                        </div>
                    </div>
                </div>
            );
        };
    
        const dataviewGridItem = (data: MealItem) => {
            return (
                <div className="col-12 lg:col-4">
                    <div className="card m-3 border-1 surface-border">
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-tag mr-2" />
                                <span className="font-semibold">{data.id}</span>
                            </div>
                            <span className={`product-badge status-active`}>{data.price}</span>
                        </div>
                        <div className="flex flex-column align-items-center text-center mb-3">
                        {(data.image!=undefined  ) 
                      ?  <img src={`${config.serverURI}/${data.image}`} alt={data.createBy} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                      :  <img src={`/photo_na.png`} alt={data.createBy} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    }
                            <div className="text-2xl font-bold">{data.createBy}</div>
                            <div className="mb-3">{data.updateBy}</div>
                            <Rating value={data.id} readOnly cancel={false} />
                        </div>
                        <div className="flex align-items-center justify-content-between">
                            <span className="text-2xl font-semibold">$ {data.price}</span>
                            <Button icon="pi pi-shopping-cart" disabled={data.id === 'OUTOFSTOCK'} />
                        </div>
                    </div>
                </div>
            );
        };
    
        const itemTemplate = (data: MealItem, layout: LayoutType) => {
            if (!data) {
                return;
            }
    
            if (layout === 'list') {
                return dataviewListItem(data);
            } else if (layout === 'grid') {
                return dataviewGridItem(data);
            }
        };
    
        return (
            <div className="grid list-demo">
                <div className="col-12">
                    <div className="card">
                        <h5>MealItem</h5>
                        <DataView 
                        value={mealItems} 
                        layout={layout} 
                        loading={loading}
                        paginator 
                        sortOrder={sortOrder} 
                        sortField={sortField} 
                        totalRecords={totalRecords}
                        itemTemplate={itemTemplate} 
                        rows={row}
                        lazy={true}
                        onPage={changePage}
                        rowsPerPageOptions={[9,12,15,18,21,24,27,30]}
                        header={dataViewHeader}>
                        </DataView>
                    </div>
                </div>
    
    
                
            </div>
        );
    };
    
    export default MealItemDataview;
    