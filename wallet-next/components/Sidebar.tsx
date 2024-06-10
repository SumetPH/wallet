"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MdOutlineHome, MdOutlineAccountBalance } from "react-icons/md";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="text-white p-4">
      <h1 className="text-xl font-medium text-center my-4">Money Wallet</h1>
      <hr className="my-4" />
      <div className="flex flex-col gap-3">
        <Button
          className="justify-start items-center"
          fullWidth
          onClick={() => router.push("/")}
        >
          <MdOutlineHome size={22} />
          <span className="text-base font-medium">หน้าแรก</span>
        </Button>
        <Button
          className="justify-start"
          fullWidth
          onClick={() => router.push("/account")}
        >
          <MdOutlineAccountBalance size={22} />
          <span className="text-base font-medium">บัญชี</span>
        </Button>
      </div>
    </div>
  );
}
