"use client";

import React from "react";
import useTransactionList from "@/services/useTransactionList";
import TransactionList from "@/components/transaction/TransactionList";

export default function Home() {
  const transactionList = useTransactionList({});

  return (
    <TransactionList
      transactionRes={transactionList.data}
      isLoading={transactionList.isLoading}
      onCreateOrUpdate={() => transactionList.mutate()}
      onDelete={() => transactionList.mutate()}
    />
  );
}
