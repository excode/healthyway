import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Ingredient = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			name: string|any;
			unit: string|any;
			description?: string|any;
			itemCode: string|any;
			image?: string|any
  }

  export type IngredientQuery = Omit<Ingredient, 'name'|'unit'|'itemCode'> & {
    name?: string;
unit?: string;
itemCode?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string;
  unit_mode?: string;
  description_mode?: string;
  itemCode_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type IngredientKey = keyof Ingredient;
    
export class IngredientService {
     
  getIngredient(request:IngredientQuery) {
      return getDatas<Ingredient,IngredientQuery>( '/ingredient',request)
  }
  getIngredientAll(request:IngredientQuery) {
    return getDataAll<Ingredient,IngredientQuery>( '/ingredient/all',request) 
  }
  getIngredientSuggestions(keyword:string) {
    return getDataSuggestions<Ingredient>( '/ingredient/suggestions',keyword) 
  }
  getIngredientDetails(id:string){
    return getData<Ingredient>('/ingredient/'+ id);
  }
  addIngredient (request:Ingredient) {
    return postData<Ingredient>('/ingredient',request);
    
  }
  updateIngredient (request:Ingredient) {
    const {id,...rest}  =request
    return   patchData<Ingredient>( '/ingredient/'+ id, rest );
  }
  deleteIngredient (id:string) {
    return   deleteData<Ingredient>( '/ingredient/'+ id );
  }
}
   
    