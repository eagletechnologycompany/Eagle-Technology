import type { Metadata } from "next";
import { getDb } from "@/server/db/client";
import { requireFounderPage } from "@/server/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Founder Operations Dashboard — Eagle Technology",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const founder = await requireFounderPage();
  const db = getDb();

  const workspaceRow = db
    .prepare("SELECT value FROM workspace_settings WHERE key = 'workspace_name'")
    .get() as { value: string } | undefined;

  const unread = db
    .prepare(
      "SELECT COUNT(*) as count FROM notifications WHERE recipient_user_id = ? AND read_at IS NULL"
    )
    .get(founder.userId) as { count: number };

  return (
    <DashboardShell
      founder={{
        userId: founder.userId,
        username: founder.username,
        roleId: founder.roleId,
        roleTitle: founder.roleTitle,
        shortTitle: founder.shortTitle,
        displayLabel: founder.displayLabel,
        permissions: founder.permissions,
      }}
      workspaceName={workspaceRow?.value ?? "Founders Workspace"}
      initialUnreadCount={unread.count}
    >
      {children}
    </DashboardShell>
  );
}
