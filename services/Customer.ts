import {
  deleteData,
  getData,
  getDataAll,
  getDataSuggestions,
  getDatas,
  patchData,
  postData,
} from "@lib/httpRequest";

export interface AddressType {
  zone?: string;
  lag?: string;
  lat?: string;
  building?: string;
  unit?: string;
  streetName?: string;
  addressPreference?: string;
}

export type Customer = {
  id?: string | any;
  createBy?: string | any;
  createAt?: Date | any;
  updateBy?: string | any;
  updateAt?: Date | any;
  name: string | any;
  email?: string | any;
  address?: AddressType;
  GeoTag: string | any;
  mobile: string | any;
  customerType?: string | any;
};

export type CustomerQuery = Omit<
  Customer,
  "name" | "Address" | "GeoTag" | "mobile"
> & {
  name?: string;
  Address?: string;
  GeoTag?: string;
  mobile?: string;
  createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string;
  email_mode?: string;
  Address_mode?: string;
  GeoTag_mode?: string;
  mobile_mode?: string;
  customerType_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
};
export type CustomerKey = keyof Customer;

export class CustomerService {
  getCustomer(request: CustomerQuery) {
    return getDatas<Customer, CustomerQuery>("/customer", request);
  }
  getCustomerAll(request: CustomerQuery) {
    return getDataAll<Customer, CustomerQuery>("/customer/all", request);
  }
  getCustomerSuggestions(keyword: string) {
    return getDataSuggestions<Customer>("/customer/suggestions", keyword);
  }
  getCustomerDetails(id: string) {
    return getData<Customer>("/customer/" + id);
  }
  addCustomer(request: Customer) {
    return postData<Customer>("/customer", request);
  }
  updateCustomer(request: Customer) {
    const { id, ...rest } = request;
    return patchData<Customer>("/customer/" + id, rest);
  }
  deleteCustomer(id: string) {
    return deleteData<Customer>("/customer/" + id);
  }
}
