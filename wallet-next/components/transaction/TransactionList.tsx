import { Avatar, Skeleton } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";
import type { TransactionRes } from "@/services/useTransactionList";
import dayjs from "dayjs";

type Props = {
  transactionRes?: TransactionRes[];
  isLoading?: boolean;
};

export default function TransactionList({
  transactionRes = [],
  isLoading = false,
}: Props) {
  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">รายการใช้จ่าย</section>
      </div>

      {isLoading && (
        <div className="my-6">
          <Skeleton className="h-6 w-full rounded-lg my-4" />
          <Skeleton className="h-36 w-full rounded-lg my-4" />
        </div>
      )}

      {transactionRes.length === 0 && (
        <div className="my-6 text-center">ไม่พบข้อมูล</div>
      )}

      {transactionRes.map((item) => (
        <div key={item.date}>
          <div className="flex justify-between gap-2 p-1 bg-gray-100">
            <span>{item.date}</span>
            <span>{item.total} บาท</span>
          </div>

          {item.transactions.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
            >
              <div className="flex gap-3 items-center">
                <Avatar name={transaction.category_name} />
                <div>
                  <div className="flex gap-2 text-sm ">
                    <section className="font-medium">
                      {transaction.account_name}
                    </section>
                    <section>{transaction.category_name}</section>
                  </div>
                  <div>
                    <section className="text-sm">
                      {dayjs(transaction.transaction_created_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </section>
                  </div>
                </div>
              </div>
              <div>
                <section
                  className={clsx(
                    "font-medium text-lg",
                    transaction.category_type_id === "1"
                      ? "text-red-600"
                      : "text-green-600"
                  )}
                >
                  {transaction.transaction_amount}
                </section>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
