import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { TeamClient } from "@/components/dashboard/TeamClient";

export default async function TeamPage() {
  const founder = await requireFounderPage("team.view");
  return <TeamClient currentUserId={founder.userId} />;
}
