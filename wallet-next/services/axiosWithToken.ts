import axios from "axios";
import jsCookie from "js-cookie";

type arg = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, any>;
};

export const axiosWithToken = <T>({ url, method = "GET", data }: arg) => {
  const token = jsCookie.get("token");

  return axios<T>({
    url: `${process.env.NEXT_PUBLIC_HOST}${url}`,
    method: method,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
