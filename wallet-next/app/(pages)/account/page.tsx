"use client";

import AccountHeader from "@/components/account/AccountHeader";
import useAccountList from "@/services/useAccountList";
import React, { useRef } from "react";
import clsx from "clsx";
import AccountRow from "@/components/account/AccountRow";

export default function Account() {
  const accountList = useAccountList();

  const amountColor = (amount: string, accountTypeId: string) => {
    // 3 = บัตรเครดิต
    if (amount.includes("-") || ["3"].includes(accountTypeId)) {
      return "text-red-600";
    }
    return "text-green-600";
  };

  return (
    <>
      <AccountHeader />

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
              {item.account_type_balance} บาท
            </span>
          </div>

          {item.accounts.map((account) => (
            <AccountRow
              key={account.account_id}
              account={account}
              amountColor={amountColor(
                account.balance,
                account.account_type_id
              )}
            />
          ))}
        </div>
      ))}
    </>
  );
}
