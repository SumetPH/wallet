import React, { useRef, useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { AccountFormModalRef } from "@/components/account/AccountFormModal";
import { AccountFormModal } from "./AccountFormModal";

export default function PageHeader() {
  const AccountFormModalRef = useRef<AccountFormModalRef>(null);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">บัญชี</section>
        <section>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreHoriz size={24} />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="accountAdd"
                onPress={() => AccountFormModalRef.current?.openModal()}
              >
                เพิ่มบัญชี
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>

      <AccountFormModal ref={AccountFormModalRef} />
    </>
  );
}
