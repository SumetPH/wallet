"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/services/fetcherWithToken";

export type AccountList = AccountType[];

export interface AccountType {
  account_type_id: string;
  account_type_name: string;
  account_type_created_at: string;
  account_type_updated_at: string;
  account_type_balance: string;
  accounts: Account[];
}

export interface Account {
  account_id: string;
  account_name: string;
  account_created_at: string;
  account_updated_at: string;
  account_type_id: string;
  account_type_name: string;
  account_balance: string;
  expense: string;
  income: string;
  net_balance: string;
}

export default function useAccountList() {
  const accountList = useSWR<AccountType[]>("/account-list", fetcherWithToken);

  return accountList;
}
