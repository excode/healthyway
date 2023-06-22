import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Promotions = {
  	mealPlan?: string[]|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			name: string|any;
			description: string|any;
			startDate?: Date|any;
			endDate?: Date|any;
			discount: string|any;
			image?: string|any;
			id?: string|any;
			kitchen?: string|any
  }

  export type PromotionsQuery = Omit<Promotions, 'name'|'description'|'startDate'|'endDate'|'discount'> & {
    name?: string;
description?: string;
startDate?: Date;
endDate?: Date;
discount?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string;
  description_mode?: string;
  startDate_mode?: string;
  endDate_mode?: string;
  discount_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type PromotionsKey = keyof Promotions;
    
export class PromotionsService {
     
  getPromotions(request:PromotionsQuery) {
      return getDatas<Promotions,PromotionsQuery>( '/promotions',request)
  }
  getPromotionsAll(request:PromotionsQuery) {
    return getDataAll<Promotions,PromotionsQuery>( '/promotions/all',request) 
  }
  getPromotionsSuggestions(keyword:string) {
    return getDataSuggestions<Promotions>( '/promotions/suggestions',keyword) 
  }
  getPromotionsDetails(id:string){
    return getData<Promotions>('/promotions/'+ id);
  }
  addPromotions (request:Promotions) {
    return postData<Promotions>('/promotions',request);
    
  }
  updatePromotions (request:Promotions) {
    const {id,...rest}  =request
    return   patchData<Promotions>( '/promotions/'+ id, rest );
  }
  deletePromotions (id:string) {
    return   deleteData<Promotions>( '/promotions/'+ id );
  }
}
   
    