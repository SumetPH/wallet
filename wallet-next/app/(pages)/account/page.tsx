"use client";

import AccountHeader from "@/components/account/AccountHeader";
import useAccountList from "@/services/useAccountList";
import { Avatar } from "@nextui-org/react";
import React from "react";
import clsx from "clsx";

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
            <div
              key={account.account_id}
              className="flex gap-3 items-center p-2 border-b last:border-none"
            >
              <Avatar name={account.account_name} />
              <div>
                <section>{account.account_name}</section>
                <section
                  className={clsx(
                    "font-medium",
                    amountColor(account.balance, item.account_type_id)
                  )}
                >
                  {account.balance} บาท
                  <br />
                </section>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
