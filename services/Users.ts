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
  building?: string;
  unit?: string;
  streetName?: string;
  addressPreference?: string;
  geoTag?: {
    type: "Point";
    coordinates: [0, 0];
  };
}
export type AddressKey = keyof AddressType;

export type Users = {
  id?: string | any;
  firstName: string | any;
  lastName: string | any;
  email: string | any;
  mobile?: string | any;
  password?: string | any;
  country?: string | any;
  address: AddressType[];
  userType?: number | any;
  emailOTP?: string | any;
  emailOTPExpires?: Date | any;
  mobileOTP?: string | any;
  mobileOTPExpires?: Date | any;
  kitchen?: string | any;
};

export type UsersQuery = Omit<
  Users,
  "firstName" | "email" | "lastName" | "address"
> & {
  firstName?: string;
  email?: string;
  lastName?: string;
  firstName_mode?: string;
  email_mode?: string;
  mobile_mode?: string;
  userType_mode?: string;
  emailOTP_mode?: string;
  emailOTPExpires_mode?: string;
  mobileOTP_mode?: string;
  mobileOTPExpires_mode?: string;
  lastName_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
};
export type UsersKey = keyof Users;

export class UsersService {
  getUsers(request: UsersQuery) {
    return getDatas<Users, UsersQuery>("/users", request);
  }
  getUsersAll(request: UsersQuery) {
    return getDataAll<Users, UsersQuery>("/users/all", request);
  }
  getUsersSuggestions(keyword: string) {
    return getDataSuggestions<Users>("/users/suggestions", keyword);
  }
  getUsersDetails(id: string) {
    return getData<Users>("/users/" + id);
  }
  addUsers(request: Users) {
    return postData<Users>("/users", request);
  }
  updateUsers(request: Users) {
    const { id, ...rest } = request;
    return patchData<Users>("/users/" + id, rest);
  }
  deleteUsers(id: string) {
    return deleteData<Users>("/users/" + id);
  }
}
