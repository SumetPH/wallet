import axios from "axios";

const host = "http://localhost:8000/v1";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzcwYzc2Y2EtYzdjMS00ZTY4LTlkMjEtOTgwN2NlMzM0NjQ3IiwidXNlcl9uYW1lIjoidGVzdDEiLCJpYXQiOjE3MTgwMTQzNTd9.nyPTTlhVTxF_Cla34d8tVt01Hrhz5kEs5uwxogt3V40";

export const fetcherWithToken = (url: string) =>
  axios
    .get(`${host}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
