import axios from "axios";
import jsCookie from "js-cookie";

export const fetcherWithToken = (url: string) => {
  let host;
  if (process.env.NODE_ENV === "development") {
    host = process.env.NEXT_PUBLIC_HOST_DEV;
  }
  if (process.env.NODE_ENV === "production") {
    host = process.env.NEXT_PUBLIC_HOST_PROD;
  }

  const token = jsCookie.get("token");

  return axios
    .get(`${host}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
