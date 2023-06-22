import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Inventory = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			itemCode: string|any;
			quantity: number|any;
			itemName?: string|any;
			note?: string|any;
			kitchen?: string|any
  }

  export type InventoryQuery = Omit<Inventory, 'itemCode'|'quantity'> & {
    itemCode?: string;
quantity?: number
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  itemCode_mode?: string;
  quantity_mode?: string;
  itemName_mode?: string;
  note_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type InventoryKey = keyof Inventory;
    
export class InventoryService {
     
  getInventory(request:InventoryQuery) {
      return getDatas<Inventory,InventoryQuery>( '/inventory',request)
  }
  getInventoryAll(request:InventoryQuery) {
    return getDataAll<Inventory,InventoryQuery>( '/inventory/all',request) 
  }
  getInventorySuggestions(keyword:string) {
    return getDataSuggestions<Inventory>( '/inventory/suggestions',keyword) 
  }
  getInventoryDetails(id:string){
    return getData<Inventory>('/inventory/'+ id);
  }
  addInventory (request:Inventory) {
    return postData<Inventory>('/inventory',request);
    
  }
  updateInventory (request:Inventory) {
    const {id,...rest}  =request
    return   patchData<Inventory>( '/inventory/'+ id, rest );
  }
  deleteInventory (id:string) {
    return   deleteData<Inventory>( '/inventory/'+ id );
  }
}
   
    