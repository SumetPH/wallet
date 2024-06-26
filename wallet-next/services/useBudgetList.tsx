"use client";

import useSWR from "swr";
import { fetcherWithToken } from "@/services/fetcherWithToken";

export interface Budget {
  budget_total: string;
  budget_spend: string;
  budget_remain: string;
}

export interface BudgetList {
  budget_id: string;
  budget_name: string;
  budget_amount: string;
  expense: string;
  remain: string;
  category_id: string;
}

export interface BudgetRes {
  budget: Budget;
  budgetList: BudgetList[];
}

type Props = {
  enable: boolean;
};

export default function useBudgetList({ enable = true }: Props) {
  const budgetList = useSWR<BudgetRes>(
    enable ? "/budget-list" : undefined,
    fetcherWithToken
  );

  return budgetList;
}
