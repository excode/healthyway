import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Feedback = {
  	id?: string|any;
			createBy?: string|any;
			createAt?: Date|any;
			updateBy?: string|any;
			updateAt?: Date|any;
			customerId: string|any;
			chefId: string|any;
			orderId: string|any;
			rating?: number|any;
			comment: string|any;
			kitchen?: string|any
  }

  export type FeedbackQuery = Omit<Feedback, 'customerId'|'chefId'|'orderId'|'comment'> & {
    customerId?: string;
chefId?: string;
orderId?: string;
comment?: string
      createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  customerId_mode?: string;
  chefId_mode?: string;
  orderId_mode?: string;
  rating_mode?: string;
  comment_mode?: string;
  kitchen_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type FeedbackKey = keyof Feedback;
    
export class FeedbackService {
     
  getFeedback(request:FeedbackQuery) {
      return getDatas<Feedback,FeedbackQuery>( '/feedback',request)
  }
  getFeedbackAll(request:FeedbackQuery) {
    return getDataAll<Feedback,FeedbackQuery>( '/feedback/all',request) 
  }
  getFeedbackSuggestions(keyword:string) {
    return getDataSuggestions<Feedback>( '/feedback/suggestions',keyword) 
  }
  getFeedbackDetails(id:string){
    return getData<Feedback>('/feedback/'+ id);
  }
  addFeedback (request:Feedback) {
    return postData<Feedback>('/feedback',request);
    
  }
  updateFeedback (request:Feedback) {
    const {id,...rest}  =request
    return   patchData<Feedback>( '/feedback/'+ id, rest );
  }
  deleteFeedback (id:string) {
    return   deleteData<Feedback>( '/feedback/'+ id );
  }
}
   
    