import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { ActivityClient } from "@/components/dashboard/ActivityClient";

export default async function ActivityPage() {
  const founder = await requireFounderPage();
  const canViewAudit = founder.permissions.includes("audit.view");
  return <ActivityClient canViewAudit={canViewAudit} />;
}
