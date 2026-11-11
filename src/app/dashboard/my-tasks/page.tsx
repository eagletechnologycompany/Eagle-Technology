import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { TasksWorkspace } from "@/components/dashboard/TasksWorkspace";

export default async function MyTasksPage() {
  const founder = await requireFounderPage("task.view");
  return (
    <TasksWorkspace
      mode="mine"
      currentUserId={founder.userId}
      permissions={founder.permissions}
    />
  );
}
