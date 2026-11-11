import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { ProjectDetailClient } from "@/components/dashboard/ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const founder = await requireFounderPage("project.view");
  const { id } = await params;

  return <ProjectDetailClient projectId={id} permissions={founder.permissions} />;
}
