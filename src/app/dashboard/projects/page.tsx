import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { ProjectsListClient } from "@/components/dashboard/ProjectsListClient";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const founder = await requireFounderPage("project.view");
  const params = await searchParams;
  return (
    <ProjectsListClient
      permissions={founder.permissions}
      initialNewOpen={params.new === "1"}
    />
  );
}
