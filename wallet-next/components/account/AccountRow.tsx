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
import { useRouter } from "next/navigation";
import numeral from "numeral";

type Props = {
  account: Account;
  amountColor: string;
};

export default function AccountRow({ account, amountColor }: Props) {
  const router = useRouter();
  const AccountFormModalRef = useRef<AccountFormModalRef>(null);
  const accountDeleteModalRef = useRef<AccountDeleteModalRef>(null);

  return (
    <>
      <AccountFormModal
        ref={AccountFormModalRef}
        account={account}
        mode="edit"
      />
      <AccountDeleteModal ref={accountDeleteModalRef} account={account} />

      <div
        key={account.account_id}
        className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
        onClick={() => router.push(`/account/${account.account_id}`)}
      >
        <div className="flex gap-3 items-center">
          <Avatar name={account.account_name} />
          <div>
            <section>{account.account_name}</section>
            <section className={clsx("font-medium", amountColor)}>
              {numeral(account.net_balance).format("0,0.00")} บาท
              <br />
            </section>
          </div>
        </div>
        <div>
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
    </>
  );
}
