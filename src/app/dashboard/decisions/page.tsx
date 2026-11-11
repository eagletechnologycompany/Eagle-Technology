import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { DecisionsClient } from "@/components/dashboard/DecisionsClient";

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; new?: string }>;
}) {
  const founder = await requireFounderPage();
  const params = await searchParams;

  return (
    <DecisionsClient
      permissions={founder.permissions}
      initialTab={params.tab}
      initialNewOpen={params.new === "1"}
    />
  );
}
