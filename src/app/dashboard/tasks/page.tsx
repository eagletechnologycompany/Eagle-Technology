import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { TasksWorkspace } from "@/components/dashboard/TasksWorkspace";

export default async function AllTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string; new?: string; status?: string }>;
}) {
  const founder = await requireFounderPage("task.view");
  const params = await searchParams;

  return (
    <TasksWorkspace
      mode="all"
      currentUserId={founder.userId}
      permissions={founder.permissions}
      initialTaskId={params.task}
      initialNewOpen={params.new === "1"}
      initialStatusFilter={params.status}
    />
  );
}
