import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Delivery = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			orderId: string|any;
			chefId: string|any;
			deliveryPersonId: string|any;
			deliveryStatus: string|any;
			deliverdate?: Date|any;
			kitchen?: string|any
  }

  export type DeliveryQuery = Omit<Delivery, 'orderId'|'chefId'|'deliveryPersonId'|'deliveryStatus'|'deliverdate'> & {
    orderId?: string;
chefId?: string;
deliveryPersonId?: string;
deliveryStatus?: string;
deliverdate?: Date
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  orderId_mode?: string;
  chefId_mode?: string;
  deliveryPersonId_mode?: string;
  deliveryStatus_mode?: string;
  deliverdate_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type DeliveryKey = keyof Delivery;
    
export class DeliveryService {
     
  getDelivery(request:DeliveryQuery) {
      return getDatas<Delivery,DeliveryQuery>( '/delivery',request)
  }
  getDeliveryAll(request:DeliveryQuery) {
    return getDataAll<Delivery,DeliveryQuery>( '/delivery/all',request) 
  }
  getDeliverySuggestions(keyword:string) {
    return getDataSuggestions<Delivery>( '/delivery/suggestions',keyword) 
  }
  getDeliveryDetails(id:string){
    return getData<Delivery>('/delivery/'+ id);
  }
  addDelivery (request:Delivery) {
    return postData<Delivery>('/delivery',request);
    
  }
  updateDelivery (request:Delivery) {
    const {id,...rest}  =request
    return   patchData<Delivery>( '/delivery/'+ id, rest );
  }
  deleteDelivery (id:string) {
    return   deleteData<Delivery>( '/delivery/'+ id );
  }
}
   
    