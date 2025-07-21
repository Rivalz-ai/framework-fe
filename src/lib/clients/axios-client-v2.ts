import axios from "axios";
import queryString from "query-string";
import { getAccessTokenFromLocal } from "./storage.helper";

enum ApiStatusCode {
  Success = 0,
  Error = 1,
}

interface ApiResponse<T> {
  status: ApiStatusCode;
  data: T;
  message: string;
  code?: ApiStatusCode;
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Credentials": true,
  "X-Requested-With": "XMLHttpRequest",
  Authorization: `Bearer ${getAccessTokenFromLocal()}`,
};

const axiosClientV2Instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_V2_URL,
  headers,
  paramsSerializer: {
    serialize: (params) => {
      return queryString.stringify(params);
    },
  },
});

axiosClientV2Instance.interceptors.response.use(
  (response) => {
    const data: ApiResponse<never> = response.data;
    if (
      !data ||
      data.status === ApiStatusCode.Error ||
      data?.code === ApiStatusCode.Error
    ) {
      throw new Error(data?.message || "Something went wrong");
    }
    return data.data;
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export { axiosClientV2Instance };
