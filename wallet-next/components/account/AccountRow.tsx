import { Account } from "@/services/useAccountList";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import React, { useRef } from "react";
import {
  AccountDeleteModal,
  AccountDeleteModalRef,
} from "./AccountDeleteModal";
import { MdOutlineMoreVert } from "react-icons/md";
import { AccountFormModalRef } from "@/components/account/AccountFormModal";
import { AccountFormModal } from "./AccountFormModal";

type Props = {
  account: Account;
  amountColor: string;
};

export default function AccountRow({ account, amountColor }: Props) {
  const AccountFormModalRef = useRef<AccountFormModalRef>(null);
  const accountDeleteModalRef = useRef<AccountDeleteModalRef>(null);

  return (
    <div
      key={account.account_id}
      className="p-2 border-b last:border-none flex justify-between items-center"
    >
      <div className="flex gap-3 items-center ">
        <Avatar name={account.account_name} />
        <div>
          <section>{account.account_name}</section>
          <section className={clsx("font-medium", amountColor)}>
            {account.balance} บาท
            <br />
          </section>
        </div>
      </div>
      <div>
        <AccountFormModal
          ref={AccountFormModalRef}
          account={account}
          mode="edit"
        />
        <AccountDeleteModal ref={accountDeleteModalRef} account={account} />

        <Dropdown>
          <DropdownTrigger>
            <button>
              <MdOutlineMoreVert />
            </button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              color="primary"
              onClick={() => AccountFormModalRef.current?.openModal()}
            >
              แก้ไข
            </DropdownItem>
            <DropdownItem
              className="text-danger"
              color="danger"
              onClick={() => accountDeleteModalRef.current?.openModal()}
            >
              ลบ
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}