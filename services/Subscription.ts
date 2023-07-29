import {
  deleteData,
  getData,
  getDataAll,
  getDataSuggestions,
  getDatas,
  patchData,
  postData,
} from "@lib/httpRequest";
import { AddressType } from "./Users";

interface SubPlan {
  weekday: string;
  session: string;
  item: any;
  quantity: number;
  status: string;
}

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
  subPlans?: SubPlan[];
  kitchen?: string | any;
  deliveryAddress: AddressType;
};

export type SubscriptionQuery = Omit<
  Subscription,
  "customerId" | "startDate" | "endDate" | "status" | "deliveryAddress"
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
  day_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
  subPlans?: any;
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
