"use client";

import useSWR from "swr";
import { fetcherWithToken } from "./fetcherWithToken";

type Category = {
  category_id: string;
  category_name: string;
  category_type_id: string;
  category_created_at: string;
  category_updated_at: string;
  user_id: string;
};

export enum CategoryType {
  expense = "1",
  income = "2",
}

type Props = {
  enable: boolean;
  categoryType: CategoryType;
};

export default function useCategoryList({
  enable = true,
  categoryType = CategoryType.expense,
}: Props) {
  const searchParams = new URLSearchParams();
  if (categoryType) searchParams.append("category_type_id", categoryType);

  const categoryList = useSWR<Category[]>(
    enable ? `/category-list?${searchParams.toString()}` : null,
    fetcherWithToken
  );

  return categoryList;
}
