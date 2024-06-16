"use client";

import useSWR from "swr";
import { fetcherWithToken } from "./fetcherWithToken";

type AccountType = {
  account_type_id: string;
  account_type_name: string;
  account_type_created_at: string;
  account_type_updated_at: string;
};

type Props = {
  enable: boolean;
};

export default function useAccountTypeList({ enable = true }: Props) {
  const accountTypeList = useSWR<AccountType[]>(
    enable ? "/account-type-list" : null,
    fetcherWithToken
  );

  return accountTypeList;
}
