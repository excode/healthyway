import {
  deleteData,
  getData,
  getDataAll,
  getDataSuggestions,
  getDatas,
  patchData,
  postData,
} from "@lib/httpRequest";

export type MealItem = {
  id?: string | any;
  createBy?: string | any;
  createAt?: Date | any;
  updateBy?: string | any;
  updateAt?: Date | any;
  name: string | any;
  nameInArabic?: string | any;
  description?: string | any;
  descriptionInArabic?: string | any;
  price: number | any;
  image?: string | any;
  groupName: string | any;
  code: string | any;
  weekdays?: string[] | any;
  active?: boolean | any;
  mealType?: string[] | any;
  kitchen: string | any;
};

export type MealItemQuery = Omit<
  MealItem,
  "name" | "price" | "groupName" | "code" | "active" | "kitchen"
> & {
  name?: string;
  nameInArabic?: string | any;
  price?: number;
  groupName?: string;
  code?: string;
  active?: false;
  kitchen?: string;
  createBy_mode?: string;
  createAt_mode?: string;
  updateBy_mode?: string;
  updateAt_mode?: string;
  name_mode?: string;
  price_mode?: string;
  groupName_mode?: string;
  code_mode?: string;
  kitchen_mode?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  sortBy?: string;
  sortDirection?: number;
};
export type MealItemKey = keyof MealItem;

export class MealItemService {
  getMealItem(request: MealItemQuery) {
    return getDatas<MealItem, MealItemQuery>("/mealItem", request);
  }
  getMealItemAll(request: MealItemQuery) {
    return getDataAll<MealItem, MealItemQuery>("/mealItem/all", request);
  }
  getMealItemSuggestions(keyword: string) {
    return getDataSuggestions<MealItem>("/mealItem/suggestions", keyword);
  }
  getMealItemDetails(id: string) {
    return getData<MealItem>("/mealItem/" + id);
  }
  addMealItem(request: MealItem) {
    return postData<MealItem>("/mealItem", request);
  }
  updateMealItem(request: MealItem) {
    const { id, ...rest } = request;
    return patchData<MealItem>("/mealItem/" + id, rest);
  }
  deleteMealItem(id: string) {
    return deleteData<MealItem>("/mealItem/" + id);
  }
}
