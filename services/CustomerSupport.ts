import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type CustomerSupport = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			email?: string|any;
			subject: string|any;
			description: string|any;
			status: string|any;
			customerName?: string|any;
			customerPhone?: string|any;
			kitchen?: string|any
  }

  export type CustomerSupportQuery = Omit<CustomerSupport, 'subject'|'description'|'status'> & {
    subject?: string;
description?: string;
status?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  email_mode?: string;
  subject_mode?: string;
  description_mode?: string;
  status_mode?: string;
  customerPhone_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type CustomerSupportKey = keyof CustomerSupport;
    
export class CustomerSupportService {
     
  getCustomerSupport(request:CustomerSupportQuery) {
      return getDatas<CustomerSupport,CustomerSupportQuery>( '/customerSupport',request)
  }
  getCustomerSupportAll(request:CustomerSupportQuery) {
    return getDataAll<CustomerSupport,CustomerSupportQuery>( '/customerSupport/all',request) 
  }
  getCustomerSupportSuggestions(keyword:string) {
    return getDataSuggestions<CustomerSupport>( '/customerSupport/suggestions',keyword) 
  }
  getCustomerSupportDetails(id:string){
    return getData<CustomerSupport>('/customerSupport/'+ id);
  }
  addCustomerSupport (request:CustomerSupport) {
    return postData<CustomerSupport>('/customerSupport',request);
    
  }
  updateCustomerSupport (request:CustomerSupport) {
    const {id,...rest}  =request
    return   patchData<CustomerSupport>( '/customerSupport/'+ id, rest );
  }
  deleteCustomerSupport (id:string) {
    return   deleteData<CustomerSupport>( '/customerSupport/'+ id );
  }
}
   
    