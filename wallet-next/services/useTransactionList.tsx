"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/services/fetcherWithToken";

export interface TransactionRes {
  date: string;
  total: string;
  transactions: Transaction[];
}

export interface Transaction {
  transaction_id: string;
  transaction_amount: string;
  transaction_created_at: string;
  category_id: string;
  category_name: string;
  category_type_id: string;
  category_type_name: string;
  account_id: string;
  account_name: string;
}

type Props = {
  accountId?: string;
};

export default function useTransactionList({ accountId = "" }: Props) {
  const searchParams = new URLSearchParams();
  if (accountId) searchParams.append("account_id", accountId);

  const transactionList = useSWR<TransactionRes[]>(
    `/transaction-list?${searchParams.toString()}`,
    fetcherWithToken
  );

  return transactionList;
}
