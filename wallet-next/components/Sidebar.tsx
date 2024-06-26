"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  MdOutlineHome,
  MdOutlineAccountBalance,
  MdOutlineLogout,
  MdOutlinePieChartOutline,
} from "react-icons/md";
import jsCookie from "js-cookie";

export default function Sidebar() {
  const router = useRouter();

  const logout = () => {
    jsCookie.remove("user");
    jsCookie.remove("token");
    router.replace("/login");
  };

  return (
    <div className="text-white p-4 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-medium text-center my-4">Money Wallet</h1>
        <hr className="my-4" />
        <div className="flex flex-col gap-3">
          <Button
            className="justify-start items-center"
            fullWidth
            onClick={() => router.push("/transaction")}
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
          <Button
            className="justify-start"
            fullWidth
            onClick={() => router.push("/budget")}
          >
            <MdOutlinePieChartOutline size={22} />
            <span className="text-base font-medium">งบประมาณ</span>
          </Button>
        </div>
      </div>
      <div>
        <Button className="justify-start" fullWidth onClick={logout}>
          <MdOutlineLogout size={22} />
          <span className="text-base font-medium">ออกจากระบบ</span>
        </Button>
      </div>
    </div>
  );
}
