"use client";

import AccountHeader from "@/components/account/AccountHeader";
import useAccountList from "@/services/useAccountList";
import React from "react";
import clsx from "clsx";
import AccountRow from "@/components/account/AccountRow";
import { Skeleton } from "@nextui-org/react";
import numeral from "numeral";

export default function AccountPage() {
  const accountList = useAccountList({
    enable: true,
  });

  const amountColor = (amount: string, accountTypeId: string) => {
    // 3 = บัตรเครดิต
    if (amount.includes("-") || ["3", "4"].includes(accountTypeId)) {
      return "text-red-600";
    }
    return "text-green-600";
  };

  return (
    <>
      <AccountHeader />

      {accountList.isLoading && (
        <div className="my-6">
          <Skeleton className="h-6 w-full rounded-lg my-4" />
          <Skeleton className="h-36 w-full rounded-lg my-4" />
        </div>
      )}

      {accountList.data?.map((item) => (
        <div key={item.account_type_id}>
          <div className="flex justify-between gap-2 p-1 bg-gray-100">
            <span>{item.account_type_name}</span>
            <span
              className={clsx(
                "font-medium",
                amountColor(item.account_type_balance, item.account_type_id)
              )}
            >
              {numeral(item.account_type_balance).format("0,0.00")} บาท
            </span>
          </div>

          {item.accounts.map((account) => (
            <AccountRow
              key={account.account_id}
              account={account}
              amountColor={amountColor(
                account.net_balance,
                account.account_type_id
              )}
            />
          ))}
        </div>
      ))}
    </>
  );
}
