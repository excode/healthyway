import {
  deleteData,
  getData,
  getDataAll,
  getDataSuggestions,
  getDatas,
  patchData,
  postData,
} from "@lib/httpRequest";

export type Subscription = {
  id?: string | any;
  createBy?: string | any;
  createAt?: Date | any;
  updateBy?: string | any;
  updateAt?: Date | any;
  customerId: string | any;
  startDate?: Date | any;
  endDate?: Date | any;
  status: string | any;
  breakfast?: string[] | any;
  lunch?: string[] | any;
  dinner?: string[] | any;
  kitchen?: string | any;
  day: string;
};

export type SubscriptionQuery = Omit<
  Subscription,
  "customerId" | "startDate" | "endDate" | "status"
> & {
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  customerId_mode?: string;
  startDate_mode?: string;
  endDate_mode?: string;
  status_mode?: string;
  kitchen_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
};
export type SubscriptionKey = keyof Subscription;

export class SubscriptionService {
  getSubscription(request: SubscriptionQuery) {
    return getDatas<Subscription, SubscriptionQuery>("/subscription", request);
  }
  getSubscriptionAll(request: SubscriptionQuery) {
    return getDataAll<Subscription, SubscriptionQuery>(
      "/subscription/all",
      request
    );
  }
  getSubscriptionSuggestions(keyword: string) {
    return getDataSuggestions<Subscription>(
      "/subscription/suggestions",
      keyword
    );
  }
  getSubscriptionDetails(id: string) {
    return getData<Subscription>("/subscription/" + id);
  }
  addSubscription(request: Subscription) {
    return postData<Subscription>("/subscription", request);
  }
  updateSubscription(request: Subscription) {
    const { id, ...rest } = request;
    return patchData<Subscription>("/subscription/" + id, rest);
  }
  deleteSubscription(id: string) {
    return deleteData<Subscription>("/subscription/" + id);
  }
}
