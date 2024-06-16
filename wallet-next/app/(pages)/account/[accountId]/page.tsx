"use client";

import TransactionList from "@/components/transaction/TransactionList";
import useTransactionList from "@/services/useTransactionList";
import React from "react";

export default function AccountTransaction({
  params,
}: {
  params: { accountId: string };
}) {
  const transactionList = useTransactionList({
    accountId: params.accountId,
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
