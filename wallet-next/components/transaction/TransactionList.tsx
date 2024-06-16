import { Avatar, Skeleton } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import type { TransactionRes } from "@/services/useTransactionList";
import dayjs from "dayjs";
import TransactionHeader from "./TransactionHeader";
import TransactionRow from "./TransactionRow";
import numeral from "numeral";

type Props = {
  transactionRes?: TransactionRes[];
  isLoading?: boolean;
  onCreateOrUpdate: () => void;
  onDelete: () => void;
};

export default function TransactionList({
  transactionRes = [],
  isLoading = false,
  onCreateOrUpdate,
  onDelete,
}: Props) {
  return (
    <>
      <TransactionHeader onCreateOrUpdate={onCreateOrUpdate} />

      {isLoading && (
        <div className="my-6">
          <Skeleton className="h-6 w-full rounded-lg my-4" />
          <Skeleton className="h-36 w-full rounded-lg my-4" />
        </div>
      )}

      {!isLoading && transactionRes.length === 0 && (
        <div className="my-6 text-center">ไม่พบข้อมูล</div>
      )}

      {transactionRes.map((item) => (
        <div key={item.date}>
          <div className="flex justify-between gap-2 p-1 bg-gray-100 font-medium">
            <span className="text-sm">{item.date}</span>
            <div className="flex gap-3">
              <span className="text-sm text-green-600">
                {item.income !== "0"
                  ? `+${numeral(item.income).format("0,0.00")}`
                  : null}
              </span>
              <span className="text-sm text-red-600">
                {item.expense !== "0"
                  ? `-${numeral(item.expense).format("0,0.00")}`
                  : null}
              </span>
            </div>
          </div>

          {item.transactions.map((transaction) => (
            <TransactionRow
              key={transaction.transaction_id}
              transaction={transaction}
              onCreateOrUpdate={onCreateOrUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </>
  );
}
