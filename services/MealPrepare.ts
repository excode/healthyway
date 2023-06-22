import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealPrepare = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			chefId: string|any;
			orderId: string|any;
			startTime?: Date|any;
			endTime?: Date|any;
			status: string|any;
			deliveryTime?: Date|any;
			kitchen?: string|any
  }

  export type MealPrepareQuery = Omit<MealPrepare, 'chefId'|'orderId'|'startTime'|'endTime'|'status'|'deliveryTime'> & {
    chefId?: string;
orderId?: string;
startTime?: Date;
endTime?: Date;
status?: string;
deliveryTime?: Date
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  chefId_mode?: string;
  orderId_mode?: string;
  startTime_mode?: string;
  endTime_mode?: string;
  status_mode?: string;
  deliveryTime_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealPrepareKey = keyof MealPrepare;
    
export class MealPrepareService {
     
  getMealPrepare(request:MealPrepareQuery) {
      return getDatas<MealPrepare,MealPrepareQuery>( '/mealPrepare',request)
  }
  getMealPrepareAll(request:MealPrepareQuery) {
    return getDataAll<MealPrepare,MealPrepareQuery>( '/mealPrepare/all',request) 
  }
  getMealPrepareSuggestions(keyword:string) {
    return getDataSuggestions<MealPrepare>( '/mealPrepare/suggestions',keyword) 
  }
  getMealPrepareDetails(id:string){
    return getData<MealPrepare>('/mealPrepare/'+ id);
  }
  addMealPrepare (request:MealPrepare) {
    return postData<MealPrepare>('/mealPrepare',request);
    
  }
  updateMealPrepare (request:MealPrepare) {
    const {id,...rest}  =request
    return   patchData<MealPrepare>( '/mealPrepare/'+ id, rest );
  }
  deleteMealPrepare (id:string) {
    return   deleteData<MealPrepare>( '/mealPrepare/'+ id );
  }
}
   
    