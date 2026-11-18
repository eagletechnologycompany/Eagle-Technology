import React from "react";
import { requirePortalPage } from "@/server/auth/session";
import { getDb } from "@/server/db/client";
import { DeliverablesClient } from "@/components/portal/DeliverablesClient";
import { FileCheck } from "lucide-react";

type DeliverablesClientProps = React.ComponentProps<typeof DeliverablesClient>;

export default async function DeliverablesPage() {
  await requirePortalPage();
  const db = getDb();

  const deliverables = (db
    .prepare(
      `SELECT d.*, u.display_label as submitter_name, p.name as project_name
       FROM client_deliverables d
       LEFT JOIN users u ON u.id = d.submitted_by
       LEFT JOIN projects p ON p.id = d.project_id
       ORDER BY 
         CASE d.status
           WHEN 'pending_review' THEN 1
           WHEN 'in_progress' THEN 2
           WHEN 'approved' THEN 3
           ELSE 4
         END,
         d.created_at DESC`
    )
    .all() as unknown) as DeliverablesClientProps["initialDeliverables"];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-soft-sand)] pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)] mb-2">
          <FileCheck className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
          Milestone Acceptance &amp; Sign-Off
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-3xl">
          Project Deliverables
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
          Inspect, evaluate, and formally approve engineering, architecture, and design deliverables submitted for your active projects.
        </p>
      </div>

      <DeliverablesClient initialDeliverables={deliverables} />
    </div>
  );
}
