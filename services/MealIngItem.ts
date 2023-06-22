import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealIngItem = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			quantity: number|any;
			ingredients: string|any;
			kitchen?: string|any
  }

  export type MealIngItemQuery = Omit<MealIngItem, 'quantity'|'ingredients'> & {
    quantity?: number;
ingredients?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  quantity_mode?: string;
  ingredients_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealIngItemKey = keyof MealIngItem;
    
export class MealIngItemService {
     
  getMealIngItem(request:MealIngItemQuery) {
      return getDatas<MealIngItem,MealIngItemQuery>( '/mealIngItem',request)
  }
  getMealIngItemAll(request:MealIngItemQuery) {
    return getDataAll<MealIngItem,MealIngItemQuery>( '/mealIngItem/all',request) 
  }
  getMealIngItemSuggestions(keyword:string) {
    return getDataSuggestions<MealIngItem>( '/mealIngItem/suggestions',keyword) 
  }
  getMealIngItemDetails(id:string){
    return getData<MealIngItem>('/mealIngItem/'+ id);
  }
  addMealIngItem (request:MealIngItem) {
    return postData<MealIngItem>('/mealIngItem',request);
    
  }
  updateMealIngItem (request:MealIngItem) {
    const {id,...rest}  =request
    return   patchData<MealIngItem>( '/mealIngItem/'+ id, rest );
  }
  deleteMealIngItem (id:string) {
    return   deleteData<MealIngItem>( '/mealIngItem/'+ id );
  }
}
   
    