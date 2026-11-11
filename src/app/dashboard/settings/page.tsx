import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const founder = await requireFounderPage();
  return (
    <SettingsClient
      currentUserId={founder.userId}
      roleTitle={founder.roleTitle}
      permissions={founder.permissions}
    />
  );
}
