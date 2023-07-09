import { LoginData } from "@services/Login";
import axios, { RawAxiosRequestHeaders } from "axios";
import { parse } from "cookie";
import config from "../config";

export type GetLoginResponse = {
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  name?: string;
};
function getToken() {
  const cookies = parse(document.cookie);
  const values = JSON.parse(cookies.user);
  return values.accessToken || "";
}
export type GetResponse<T> = {
  data: T[];
  error?: string;
};
export type GetSingleResponse<T> = {
  data: T;
  error?: string;
};

export type Keyword = {
  search: string;
};
export type GetListResponse<T> = {
  docs: T[];
  count: number;
  page: number;
  perpage: number;
  error?: string;
};
export type GetSaveResponse = {
  id: string;
  error?: string;
};

async function getDatas<T, Q>(
  path: string,
  query?: Q,
  secured: boolean = true
) {
  // const [cookies, setCookie] = useCookies(['user']);
  const token = getToken();
  let url = config.serverURI + path;
  try {
    let header: RawAxiosRequestHeaders = {
      Accept: "application/json",
    };
    if (secured) {
      header = { ...header, Authorization: "Bearer " + token };
    }
    const { data } = await axios.get<GetListResponse<T>>(url, {
      headers: header,
      params: query,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        docs: [],
        count: 0,
        page: 0,
        perpage: 0,
        error: error.message,
      } as GetListResponse<T>;
    } else {
      console.log("unexpected error: ", error);
      return {
        docs: [],
        count: 0,
        page: 0,
        perpage: 0,
        error: error,
      } as GetListResponse<T>;
    }
  }
}
async function getData<T>(path: string, secured: boolean = true) {
  let url = config.serverURI + path;
  let token = getToken();
  try {
    let header: RawAxiosRequestHeaders = {
      Accept: "application/json",
    };
    if (secured) {
      header = { ...header, Authorization: "Bearer " + token };
    }
    const { data } = await axios.get<GetSingleResponse<T>>(url, {
      headers: header,
    });

    return { data: data } as GetSingleResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: [],
        error: error.message,
      } as GetSingleResponse<T>;
    } else {
      console.log("unexpected error: ", error);
      return {
        error: error,
      } as GetSingleResponse<T>;
    }
  }
}
async function postData<T>(path: string, postdata: T, secured: boolean = true) {
  let url = config.serverURI + path;
  let token = getToken();

  let header: RawAxiosRequestHeaders = {
    Accept: "application/json",
  };
  if (secured) {
    // const currentUser = localStorage.getItem("users")??'{}';
    // const data = JSON.parse( currentUser )
    // const token = data.accessToken
    header = { ...header, Authorization: "Bearer " + token };
  }
  console.log(header);
  try {
    console.log({ postdata });
    const { data } = await axios.post<GetSaveResponse>(url, postdata, {
      headers: header,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.message,
      } as GetSaveResponse;
    } else {
      console.log("unexpected error: ", error);
      return {
        error: error,
      } as GetSaveResponse;
    }
  }
}
async function patchData<T>(
  path: string,
  postdata: T,
  secured: boolean = true
) {
  let url = config.serverURI + path;
  let token = getToken();
  let header: RawAxiosRequestHeaders = {
    Accept: "application/json",
  };
  if (secured) {
    // const currentUser = localStorage.getItem("users")??'{}';
    // const data = JSON.parse( currentUser )
    // const token = data.accessToken
    header = { ...header, Authorization: "Bearer " + token };
    console.log({ header });
  }
  try {
    const { data } = await axios.patch<GetSaveResponse>(url, postdata, {
      headers: header,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.message,
      } as GetSaveResponse;
    } else {
      console.log("unexpected error: ", error);
      return {
        error: error,
      } as GetSaveResponse;
    }
  }
}
async function deleteData<T>(path: string, secured: boolean = true) {
  let url = config.serverURI + path;
  let token = getToken();

  let header: RawAxiosRequestHeaders = {
    Accept: "application/json",
  };
  if (secured) {
    // const currentUser = localStorage.getItem("users")??'{}';
    // const data = JSON.parse( currentUser )
    // const token = data.accessToken
    header = { ...header, Authorization: "Bearer " + token };
  }
  console.log(header);
  try {
    const { data } = await axios.delete<GetSaveResponse>(url, {
      headers: header,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.message,
      } as GetSaveResponse;
    } else {
      console.log("unexpected error: ", error);
      return {
        error: error,
      } as GetSaveResponse;
    }
  }
}

async function getDataAll<T, Q>(
  path: string,
  query?: Q,
  secured: boolean = true
) {
  let url = config.serverURI + path;
  let token = getToken();
  try {
    let header: RawAxiosRequestHeaders = {
      Accept: "application/json",
    };
    if (secured) {
      header = { ...header, Authorization: "Bearer " + token };
    }
    const { data } = await axios.get<GetResponse<T>>(url, {
      headers: header,
      params: query,
    });

    return { data: data } as unknown as GetResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: [],
        error: error.message,
      } as GetResponse<T>;
    } else {
      console.log("unexpected error: ", error);
      return {
        data: [],
        error: error,
      } as GetResponse<T>;
    }
  }
}
async function getDataSuggestions<T>(
  path: string,
  keyword: string,
  secured: boolean = true
) {
  let url = config.serverURI + path;
  let token = getToken();
  let datas: Keyword = {
    search: keyword,
  };
  try {
    let header: RawAxiosRequestHeaders = {
      Accept: "application/json",
    };
    if (secured) {
      header = { ...header, Authorization: "Bearer " + token };
    }
    const { data } = await axios.get<GetResponse<T>>(url, {
      headers: header,
      params: datas,
    });

    return { data: data } as unknown as GetResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: [],
        error: error.message,
      } as GetResponse<T>;
    } else {
      return {
        data: [],
        error: error,
      } as GetResponse<T>;
    }
  }
}

async function postLoginData(path: string, postdata: LoginData) {
  let url = config.serverURI + path;

  let header: RawAxiosRequestHeaders = {
    Accept: "application/json",
  };

  console.log(header);
  try {
    const { data } = await axios.post<GetLoginResponse>(url, postdata, {
      headers: header,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.message,
      } as GetLoginResponse;
    } else {
      console.log("unexpected error: ", error);
      return {
        error: error,
      } as GetLoginResponse;
    }
  }
}

export {
  deleteData,
  getData,
  getDataAll,
  getDataSuggestions,
  getDatas,
  patchData,
  postData,
  postLoginData,
};
