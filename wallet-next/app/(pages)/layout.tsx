"use client";

import SideBar from "@/components/SideBar";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import useAuthStore from "@/stores/useAuthStore";
import BottomBar from "@/components/BottomBar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const user = jsCookie.get("user");
    const token = jsCookie.get("token");
    if (user) setUser(JSON.parse(user));
    if (token) setToken(token);
  }, [setToken, setUser]);

  return (
    <>
      <div className="hidden lg:block w-[280px] bg-slate-500 fixed inset-0">
        <SideBar />
      </div>
      <div className="lg:pl-[280px] bg-slate-200 min-h-dvh pb-12 lg:pb-0">
        <div className="container mx-auto p-6 ">
          <div className="bg-white rounded-xl p-6">{children}</div>
        </div>
      </div>
      <BottomBar />
    </>
  );
}
