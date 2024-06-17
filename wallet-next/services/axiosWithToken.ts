import axios from "axios";
import jsCookie from "js-cookie";

type arg = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, any>;
};

export const axiosWithToken = <T>({ url, method = "GET", data }: arg) => {
  let host;
  if (process.env.NODE_ENV === "development") {
    host = process.env.NEXT_PUBLIC_HOST_DEV;
  }
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_HOST_PROD;
  }

  const token = jsCookie.get("token");

  return axios<T>({
    url: `${host}${url}`,
    method: method,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
