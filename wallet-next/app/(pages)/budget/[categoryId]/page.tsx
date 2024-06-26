"use client";

import TransactionList from "@/components/transaction/TransactionList";
import useTransactionList from "@/services/useTransactionList";
import dayjs from "dayjs";
import React from "react";

export default function AccountTransaction({
  params,
}: {
  params: { categoryId: string };
}) {
  const transactionList = useTransactionList({
    categoryId: params.categoryId,
    startDate: dayjs()
      .startOf("month")
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs()
      .endOf("month")
      .hour(23)
      .minute(59)
      .second(59)
      .format("YYYY-MM-DD HH:mm:ss"),
  });

  return (
    <TransactionList
      transactionRes={transactionList.data}
      isLoading={transactionList.isLoading}
      onCreateOrUpdate={() => transactionList.mutate()}
      onDelete={() => transactionList.mutate()}
    />
  );
}
