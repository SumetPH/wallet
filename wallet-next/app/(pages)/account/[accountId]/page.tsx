import React from "react";

export default function AccountTransaction({
  params,
}: {
  params: { accountId: string };
}) {
  return <div>AccountTransaction : {params.accountId}</div>;
}
