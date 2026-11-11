import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { GoalsClient } from "@/components/dashboard/GoalsClient";

export default async function GoalsPage() {
  const founder = await requireFounderPage();
  return <GoalsClient permissions={founder.permissions} />;
}
