import React from "react";
import { requirePortalPage } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { RequestsClient } from "@/components/portal/RequestsClient";

type RequestsProps = React.ComponentProps<typeof RequestsClient>;

export default async function RequestsPage() {
  await requirePortalPage();
  const db = getDb();

  const requests = (db
    .prepare(
      `SELECT r.*, u.display_label as requester_name, p.name as project_name
       FROM client_requests r
       JOIN users u ON u.id = r.client_user_id
       LEFT JOIN projects p ON p.id = r.project_id
       ORDER BY r.created_at DESC`
    )
    .all() as unknown) as RequestsProps["initialRequests"];

  return <RequestsClient initialRequests={requests} />;
}
