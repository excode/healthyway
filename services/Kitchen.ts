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

export type Kitchen = {
  id?: string | any;
  createBy?: string | any;
  createAt?: Date | any;
  updateBy?: string | any;
  updateAt?: Date | any;
  kitchenName: string | any;
  chefId?: string[] | any;
  address?: AddressType;
};

export type KitchenQuery = Omit<
  Kitchen,
  "kitchenName" | "address" | "geoTag"
> & {
  kitchenName?: string;
  address?: string;
  geoTag?: string;
  createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  kitchenName_mode?: string;
  address_mode?: string;
  geoTag_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
};
export type KitchenKey = keyof Kitchen;

export class KitchenService {
  getKitchen(request: KitchenQuery) {
    return getDatas<Kitchen, KitchenQuery>("/kitchen", request);
  }
  getKitchenAll(request: KitchenQuery) {
    return getDataAll<Kitchen, KitchenQuery>("/kitchen/all", request);
  }
  getKitchenSuggestions(keyword: string) {
    return getDataSuggestions<Kitchen>("/kitchen/suggestions", keyword);
  }
  getKitchenDetails(id: string) {
    return getData<Kitchen>("/kitchen/" + id);
  }
  addKitchen(request: Kitchen) {
    return postData<Kitchen>("/kitchen", request);
  }
  updateKitchen(request: Kitchen) {
    const { id, ...rest } = request;
    return patchData<Kitchen>("/kitchen/" + id, rest);
  }
  deleteKitchen(id: string) {
    return deleteData<Kitchen>("/kitchen/" + id);
  }
}
