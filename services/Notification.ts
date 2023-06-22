import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Notification = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			chefId: string|any;
			message: string|any;
			status: string|any;
			kitchen?: string|any
  }

  export type NotificationQuery = Omit<Notification, 'chefId'|'message'|'status'> & {
    chefId?: string;
message?: string;
status?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  chefId_mode?: string;
  message_mode?: string;
  status_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type NotificationKey = keyof Notification;
    
export class NotificationService {
     
  getNotification(request:NotificationQuery) {
      return getDatas<Notification,NotificationQuery>( '/notification',request)
  }
  getNotificationAll(request:NotificationQuery) {
    return getDataAll<Notification,NotificationQuery>( '/notification/all',request) 
  }
  getNotificationSuggestions(keyword:string) {
    return getDataSuggestions<Notification>( '/notification/suggestions',keyword) 
  }
  getNotificationDetails(id:string){
    return getData<Notification>('/notification/'+ id);
  }
  addNotification (request:Notification) {
    return postData<Notification>('/notification',request);
    
  }
  updateNotification (request:Notification) {
    const {id,...rest}  =request
    return   patchData<Notification>( '/notification/'+ id, rest );
  }
  deleteNotification (id:string) {
    return   deleteData<Notification>( '/notification/'+ id );
  }
}
   
    