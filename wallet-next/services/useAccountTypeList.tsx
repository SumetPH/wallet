"use client";

import useSWR from "swr";
import { fetcherWithToken } from "./fetcherWithToken";

type AccountType = {
  account_type_id: string;
  account_type_name: string;
  account_type_created_at: string;
  account_type_updated_at: string;
};

export default function useAccountTypeList() {
  const accountTypeList = useSWR<AccountType[]>(
    "/account-type",
    fetcherWithToken
  );

  return accountTypeList;
}
