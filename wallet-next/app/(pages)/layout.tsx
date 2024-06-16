import Sidebar from "@/components/Sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <>
      <div className="hidden lg:block w-[280px] bg-slate-500 fixed inset-0">
        <Sidebar />
      </div>
      <div className="lg:pl-[280px] bg-slate-200 min-h-dvh">
        <div className="container mx-auto p-6 ">
          <div className="bg-white rounded-xl p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
