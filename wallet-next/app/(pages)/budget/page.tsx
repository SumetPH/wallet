"use client";

import BudgetHeader from "@/components/budget/BudgetHeader";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import numeral from "numeral";
import { Avatar, Progress } from "@nextui-org/react";
import useBudgetList from "@/services/useBudgetList";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function BudgetPage() {
  const router = useRouter();

  const remainingDays = useMemo(() => {
    const lastDateInMonth = dayjs().endOf("month").format("DD");
    const currentDate = dayjs().format("DD");
    const remainingDays = Number(lastDateInMonth) - Number(currentDate);
    return remainingDays;
  }, []);

  const budgetList = useBudgetList({ enable: true });

  const budgetPercent = (budgetAmount: string, expense: string) => {
    return Number(((Number(expense) * 100) / Number(budgetAmount)).toFixed(2));
  };
  return (
    <>
      <BudgetHeader />

      <div className="flex justify-between items-center font-medium">
        <span>รายเดือน</span>
        <span>เหลือ {remainingDays} วัน</span>
      </div>
      <div className="text-center font-medium text-lg">
        {numeral(budgetList.data?.budget.budget_total).format("0,0.00")} บาท
      </div>
      <div className="my-3">
        <Progress
          color="danger"
          value={budgetPercent(
            budgetList.data?.budget.budget_total || "0",
            budgetList.data?.budget.budget_spend || "0"
          )}
          aria-label="budgetTotal"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <section className="text-red-600">
          {numeral(budgetList.data?.budget.budget_spend).format("0,0.00")} บาท (
          {budgetPercent(
            budgetList.data?.budget.budget_total || "0",
            budgetList.data?.budget.budget_spend || "0"
          )}
          %)
        </section>
        <section className="text-green-600">
          {numeral(budgetList.data?.budget.budget_remain).format("0,0.00")} บาท
        </section>
      </div>

      {!budgetList.isLoading &&
        budgetList.data?.budgetList.map((budget) => (
          <div
            key={budget.budget_id}
            className="grid grid-cols-2 gap-2 py-2 border-b last:border-none cursor-pointer"
            onClick={() => router.push(`/budget/${budget.category_id}`)}
          >
            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <Avatar name={budget.budget_name} />
              <div className="font-medium">
                <section>{budget.budget_name}</section>
                <section>
                  {numeral(budget.budget_amount).format("0,0.00")} บาท
                </section>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <section className="text-red-600 text-end">
                -{numeral(budget.expense).format("0,0.00")} บาท (
                {budgetPercent(budget.budget_amount, budget.expense)}%)
              </section>
              <section className="my-1">
                <Progress
                  color="danger"
                  value={budgetPercent(budget.budget_amount, budget.expense)}
                  aria-label="budgetCategory"
                />
              </section>
              <section
                className={clsx(
                  "text-end",
                  Number(budget.remain) < 0 ? "text-red-600" : "text-green-600"
                )}
              >
                {numeral(budget.remain).format("0,0.00")} บาท
              </section>
            </div>
          </div>
        ))}
    </>
  );
}
