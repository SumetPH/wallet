"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  MdOutlineHome,
  MdOutlineAccountBalance,
  MdOutlineLogout,
  MdOutlinePieChartOutline,
} from "react-icons/md";
import jsCookie from "js-cookie";
import clsx from "clsx";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    jsCookie.remove("user");
    jsCookie.remove("token");
    router.replace("/login");
  };

  const activeMenu = (path: string) => {
    if (pathname.startsWith(path)) {
      return "text-blue-200";
    }
    return "text-white";
  };

  return (
    <div className="fixed bottom-0 inset-x-0 lg:hidden p-3 z-10">
      <div className="bg-slate-500 rounded-xl h-full">
        <div className="grid grid-cols-4 h-10">
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/transaction")}
          >
            <MdOutlineHome
              className={clsx(activeMenu("/transaction"))}
              size={24}
            />
          </button>
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/account")}
          >
            <MdOutlineAccountBalance
              className={clsx(activeMenu("/account"))}
              size={24}
            />
          </button>
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/budget")}
          >
            <MdOutlinePieChartOutline
              className={clsx(activeMenu("/budget"))}
              size={24}
            />
          </button>
          <button className="flex justify-center items-center" onClick={logout}>
            <MdOutlineLogout className="text-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
