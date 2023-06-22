import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Chef = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			name: string|any;
			email: string|any;
			expertise?: string[]|any;
			address?: string|any;
			phoneNumber?: string|any;
			photo?: string|any;
			kitchen?: string|any
  }

  export type ChefQuery = Omit<Chef, 'name'|'email'> & {
    name?: string;
email?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string;
  email_mode?: string;
  address_mode?: string;
  phoneNumber_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type ChefKey = keyof Chef;
    
export class ChefService {
     
  getChef(request:ChefQuery) {
      return getDatas<Chef,ChefQuery>( '/chef',request)
  }
  getChefAll(request:ChefQuery) {
    return getDataAll<Chef,ChefQuery>( '/chef/all',request) 
  }
  getChefSuggestions(keyword:string) {
    return getDataSuggestions<Chef>( '/chef/suggestions',keyword) 
  }
  getChefDetails(id:string){
    return getData<Chef>('/chef/'+ id);
  }
  addChef (request:Chef) {
    return postData<Chef>('/chef',request);
    
  }
  updateChef (request:Chef) {
    const {id,...rest}  =request
    return   patchData<Chef>( '/chef/'+ id, rest );
  }
  deleteChef (id:string) {
    return   deleteData<Chef>( '/chef/'+ id );
  }
}
   
    