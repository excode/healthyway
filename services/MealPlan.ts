import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealPlan = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			meals?: string[]|any;
			quantity: number|any;
			name: string|any;
			price: number|any;
			description?: string|any;
			image?: string|any;
			code?: string|any
  }

  export type MealPlanQuery = Omit<MealPlan, 'quantity'|'name'|'price'> & {
    quantity?: number;
name?: string;
price?: number
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  quantity_mode?: string;
  name_mode?: string;
  price_mode?: string;
  description_mode?: string;
  code_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealPlanKey = keyof MealPlan;
    
export class MealPlanService {
     
  getMealPlan(request:MealPlanQuery) {
      return getDatas<MealPlan,MealPlanQuery>( '/mealPlan',request)
  }
  getMealPlanAll(request:MealPlanQuery) {
    return getDataAll<MealPlan,MealPlanQuery>( '/mealPlan/all',request) 
  }
  getMealPlanSuggestions(keyword:string) {
    return getDataSuggestions<MealPlan>( '/mealPlan/suggestions',keyword) 
  }
  getMealPlanDetails(id:string){
    return getData<MealPlan>('/mealPlan/'+ id);
  }
  addMealPlan (request:MealPlan) {
    return postData<MealPlan>('/mealPlan',request);
    
  }
  updateMealPlan (request:MealPlan) {
    const {id,...rest}  =request
    return   patchData<MealPlan>( '/mealPlan/'+ id, rest );
  }
  deleteMealPlan (id:string) {
    return   deleteData<MealPlan>( '/mealPlan/'+ id );
  }
}
   
    