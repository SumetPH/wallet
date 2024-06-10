import React, { useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import AccountModal from "@/components/account/AccountModal";

export default function PageHeader() {
  const accountFormDisclosure = useDisclosure();

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
                onClick={accountFormDisclosure.onOpen}
              >
                เพิ่มบัญชี
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>

      <AccountModal {...accountFormDisclosure} />
    </>
  );
}
