import axios from "axios";
import queryString from "query-string";
import { getProjectSelectedFromLocal } from "./storage.helper";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: "string";
    code: "string";
    field: null;
  };
}
const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Credentials": true,
  "X-Requested-With": "XMLHttpRequest",
  "project-id": `${getProjectSelectedFromLocal()}`,
};

const axiosClientChatbotInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_V3_URL,
  headers,
  paramsSerializer: {
    serialize: (params) => {
      return queryString.stringify(params);
    },
  },
});

axiosClientChatbotInstance.interceptors.response.use(
  (response) => {
    const data: ApiResponse<never> = response.data;
    if (!data || !data.success) {
      throw new Error(data.error?.message || "Something went wrong");
    }
    return data.data;
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export { axiosClientChatbotInstance };
