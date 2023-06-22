import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealGroup = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			name: string|any;
			image?: string|any
  }

  export type MealGroupQuery = Omit<MealGroup, 'name'> & {
    name?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealGroupKey = keyof MealGroup;
    
export class MealGroupService {
     
  getMealGroup(request:MealGroupQuery) {
      return getDatas<MealGroup,MealGroupQuery>( '/mealGroup',request)
  }
  getMealGroupAll(request:MealGroupQuery) {
    return getDataAll<MealGroup,MealGroupQuery>( '/mealGroup/all',request) 
  }
  getMealGroupSuggestions(keyword:string) {
    return getDataSuggestions<MealGroup>( '/mealGroup/suggestions',keyword) 
  }
  getMealGroupDetails(id:string){
    return getData<MealGroup>('/mealGroup/'+ id);
  }
  addMealGroup (request:MealGroup) {
    return postData<MealGroup>('/mealGroup',request);
    
  }
  updateMealGroup (request:MealGroup) {
    const {id,...rest}  =request
    return   patchData<MealGroup>( '/mealGroup/'+ id, rest );
  }
  deleteMealGroup (id:string) {
    return   deleteData<MealGroup>( '/mealGroup/'+ id );
  }
}
   
    