import React from "react";
import { NextUIProvider } from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
