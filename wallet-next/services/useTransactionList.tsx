"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/services/fetcherWithToken";

export interface TransactionRes {
  date: string;
  income: string;
  expense: string;
  total: string;
  transactions: Transaction[];
}

export interface Transaction {
  transaction_id: string;
  transaction_amount: string;
  transaction_note: string;
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
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export default function useTransactionList({
  accountId,
  categoryId,
  startDate,
  endDate,
}: Props) {
  const searchParams = new URLSearchParams();
  if (accountId) searchParams.append("account_id", accountId);
  if (categoryId) searchParams.append("category_id", categoryId);
  if (startDate) searchParams.append("start_date", startDate);
  if (endDate) searchParams.append("end_date", endDate);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const transactionList = useSWR<TransactionRes[]>(
    `/transaction-list${query}`,
    fetcherWithToken
  );

  return transactionList;
}
