import React, { useRef, useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

export default function BudgetHeader() {
  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">งบประมาณ</section>
        <section>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreHoriz size={24} />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="accountAdd">เพิ่มบัญชี</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>
    </>
  );
}
