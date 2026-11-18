import React from "react";
import { requirePortalPage } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { DeveloperSandboxClient } from "@/components/portal/DeveloperSandboxClient";

type DeveloperSandboxProps = React.ComponentProps<typeof DeveloperSandboxClient>;

export default async function DeveloperPage() {
  const user = await requirePortalPage();
  const db = getDb();

  const keys = (db
    .prepare(
      `SELECT id, key_prefix, label, environment, created_at
       FROM developer_sandbox_keys
       WHERE user_id = ? AND revoked_at IS NULL
       ORDER BY created_at DESC`
    )
    .all(user.userId) as unknown) as DeveloperSandboxProps["initialKeys"];

  return <DeveloperSandboxClient initialKeys={keys} />;
}
