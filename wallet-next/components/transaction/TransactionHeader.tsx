import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  TransactionFormModal,
  TransactionFormModalRef,
} from "./TransactionFormModal";
import { CategoryType } from "@/services/useCategoryList";

type Props = {
  onCreateOrUpdate: () => void;
};

export default function TransactionHeader({ onCreateOrUpdate }: Props) {
  const transactionFormModalRef = useRef<TransactionFormModalRef>(null);
  const [categoryType, setCategoryType] = useState(CategoryType.expense);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">รายการใช้จ่าย</section>
        <section>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreHoriz size={24} />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="addExpense"
                onClick={() => {
                  setCategoryType(CategoryType.expense);
                  transactionFormModalRef.current?.openModal();
                }}
              >
                เพิ่มรายจ่าย
              </DropdownItem>
              <DropdownItem
                key="addIncome"
                onClick={() => {
                  setCategoryType(CategoryType.income);
                  transactionFormModalRef.current?.openModal();
                }}
              >
                เพิ่มรายรับ
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>

      <TransactionFormModal
        ref={transactionFormModalRef}
        mode="create"
        categoryType={categoryType}
        onCreateOrUpdate={onCreateOrUpdate}
      />
    </>
  );
}
