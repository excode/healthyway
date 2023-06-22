import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type MealOrder = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			customerName: string|any;
			orderDate?: Date|any;
			deliveryDate?: Date|any;
			deliveryAddress: string|any;
			Instruction: string|any;
			location: string|any;
			orderType: string|any;
			status: string|any;
			invoiceNo: string|any;
			totalAmount: number|any;
			customerEmail?: string|any;
			customerPhone?: string|any;
			kitchen?: string|any
  }

  export type MealOrderQuery = Omit<MealOrder, 'customerName'|'orderDate'|'deliveryDate'|'deliveryAddress'|'Instruction'|'location'|'orderType'|'status'|'invoiceNo'|'totalAmount'> & {
    customerName?: string;
orderDate?: Date;
deliveryDate?: Date;
deliveryAddress?: string;
Instruction?: string;
location?: string;
orderType?: string;
status?: string;
invoiceNo?: string;
totalAmount?: number
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  customerName_mode?: string;
  orderDate_mode?: string;
  deliveryDate_mode?: string;
  deliveryAddress_mode?: string;
  Instruction_mode?: string;
  location_mode?: string;
  orderType_mode?: string;
  status_mode?: string;
  invoiceNo_mode?: string;
  totalAmount_mode?: string;
  customerEmail_mode?: string;
  customerPhone_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type MealOrderKey = keyof MealOrder;
    
export class MealOrderService {
     
  getMealOrder(request:MealOrderQuery) {
      return getDatas<MealOrder,MealOrderQuery>( '/mealOrder',request)
  }
  getMealOrderAll(request:MealOrderQuery) {
    return getDataAll<MealOrder,MealOrderQuery>( '/mealOrder/all',request) 
  }
  getMealOrderSuggestions(keyword:string) {
    return getDataSuggestions<MealOrder>( '/mealOrder/suggestions',keyword) 
  }
  getMealOrderDetails(id:string){
    return getData<MealOrder>('/mealOrder/'+ id);
  }
  addMealOrder (request:MealOrder) {
    return postData<MealOrder>('/mealOrder',request);
    
  }
  updateMealOrder (request:MealOrder) {
    const {id,...rest}  =request
    return   patchData<MealOrder>( '/mealOrder/'+ id, rest );
  }
  deleteMealOrder (id:string) {
    return   deleteData<MealOrder>( '/mealOrder/'+ id );
  }
}
   
    