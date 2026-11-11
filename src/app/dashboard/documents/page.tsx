import React from "react";
import { requireFounderPage } from "@/server/auth/session";
import { DocumentsClient } from "@/components/dashboard/DocumentsClient";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ upload?: string }>;
}) {
  const founder = await requireFounderPage("document.view");
  const params = await searchParams;
  return (
    <DocumentsClient
      permissions={founder.permissions}
      initialUploadOpen={params.upload === "1"}
    />
  );
}
