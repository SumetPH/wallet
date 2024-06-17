"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  MdOutlineHome,
  MdOutlineAccountBalance,
  MdOutlineLogout,
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
    <div className="p-3 h-[62px]">
      <div className="bg-slate-500 rounded-xl h-full">
        <div className="grid grid-cols-3 h-full">
          <button className="flex justify-center items-center">
            <MdOutlineHome
              className={clsx(activeMenu("/transaction"))}
              size={24}
              onClick={() => router.push("/transaction")}
            />
          </button>
          <button className="flex justify-center items-center">
            <MdOutlineAccountBalance
              className={clsx(activeMenu("/account"))}
              size={24}
              onClick={() => router.push("/account")}
            />
          </button>
          <button className="flex justify-center items-center">
            <MdOutlineLogout
              className="text-white"
              size={24}
              onClick={logout}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
