import React, { useRef } from "react";

import dayjs from "dayjs";
import { Transaction } from "@/services/useTransactionList";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import {
  TransactionFormModal,
  TransactionFormModalRef,
} from "./TransactionFormModal";
import { CategoryType } from "@/services/useCategoryList";
import { MdOutlineMoreVert } from "react-icons/md";
import {
  TransactionDeleteModal,
  TransactionDeleteModalRef,
} from "./TransactionDeleteModal";
import numeral from "numeral";

type Props = {
  transaction: Transaction;
  onCreateOrUpdate: () => void;
  onDelete: () => void;
};

export default function TransactionRow({
  transaction,
  onCreateOrUpdate,
  onDelete,
}: Props) {
  const transactionDeleteModalRef = useRef<TransactionDeleteModalRef>(null);
  const transactionFormModalRef = useRef<TransactionFormModalRef>(null);

  return (
    <>
      <div
        className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
        onClick={() => transactionFormModalRef.current?.openModal()}
      >
        <div className="flex gap-3 items-center">
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreVert />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                onPress={() => transactionDeleteModalRef.current?.openModal()}
              >
                ลบ
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Avatar name={transaction.category_name} />
          <div>
            <div className="flex gap-2 text-sm ">
              <section className="font-medium">
                {transaction.account_name}
              </section>
              <section>{transaction.category_name}</section>
            </div>
            <div>
              <section className="text-sm text-gray-500">
                {dayjs(transaction.transaction_created_at).format("HH:mm")}
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
            {numeral(transaction.transaction_amount).format("0,0.00")}
          </section>
        </div>
      </div>

      <TransactionDeleteModal
        ref={transactionDeleteModalRef}
        transaction={transaction}
        onDelete={onDelete}
      />

      <TransactionFormModal
        ref={transactionFormModalRef}
        transaction={transaction}
        mode="edit"
        categoryType={
          transaction.category_type_id === "1"
            ? CategoryType.expense
            : CategoryType.income
        }
        onCreateOrUpdate={onCreateOrUpdate}
      />
    </>
  );
}
