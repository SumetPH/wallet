import axios from "axios";
import jsCookie from "js-cookie";

export const fetcherWithToken = (url: string) => {
  const token = jsCookie.get("token");

  return axios
    .get(`${process.env.NEXT_PUBLIC_HOST}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
