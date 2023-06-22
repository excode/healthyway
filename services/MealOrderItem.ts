import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealOrderItem = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			mealOrder: string|any;
			quantity: number|any;
			mealItem: string|any;
			code?: string|any;
			note?: string|any;
			subTotal: number|any;
			kitchen?: string|any
  }

  export type MealOrderItemQuery = Omit<MealOrderItem, 'mealOrder'|'quantity'|'mealItem'|'subTotal'> & {
    mealOrder?: string;
quantity?: number;
mealItem?: string;
subTotal?: number
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  mealOrder_mode?: string;
  quantity_mode?: string;
  mealItem_mode?: string;
  code_mode?: string;
  note_mode?: string;
  subTotal_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealOrderItemKey = keyof MealOrderItem;
    
export class MealOrderItemService {
     
  getMealOrderItem(request:MealOrderItemQuery) {
      return getDatas<MealOrderItem,MealOrderItemQuery>( '/mealOrderItem',request)
  }
  getMealOrderItemAll(request:MealOrderItemQuery) {
    return getDataAll<MealOrderItem,MealOrderItemQuery>( '/mealOrderItem/all',request) 
  }
  getMealOrderItemSuggestions(keyword:string) {
    return getDataSuggestions<MealOrderItem>( '/mealOrderItem/suggestions',keyword) 
  }
  getMealOrderItemDetails(id:string){
    return getData<MealOrderItem>('/mealOrderItem/'+ id);
  }
  addMealOrderItem (request:MealOrderItem) {
    return postData<MealOrderItem>('/mealOrderItem',request);
    
  }
  updateMealOrderItem (request:MealOrderItem) {
    const {id,...rest}  =request
    return   patchData<MealOrderItem>( '/mealOrderItem/'+ id, rest );
  }
  deleteMealOrderItem (id:string) {
    return   deleteData<MealOrderItem>( '/mealOrderItem/'+ id );
  }
}
   
    