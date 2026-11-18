"use client";

import React, { useState } from "react";
import {
  Key,
  Copy,
  Check,
  Send,
  Webhook,
  Sparkles,
} from "lucide-react";

interface SandboxKey {
  id: string;
  key_prefix: string;
  label: string;
  environment: string;
  created_at: string;
}

export function DeveloperSandboxClient({
  initialKeys,
}: {
  initialKeys: SandboxKey[];
}) {
  const [keys, setKeys] = useState<SandboxKey[]>(initialKeys);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python">("typescript");

  // Webhook Tester state
  const [webhookUrl, setWebhookUrl] = useState("https://api.your-system.com/webhooks/eagle");
  const [webhookEvent, setWebhookEvent] = useState("deliverable.ready_for_review");
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{
    status: number;
    signature: string;
    payload: string;
  } | null>(null);

  async function handleCreateKey() {
    setCreating(true);
    try {
      const res = await fetch("/api/portal/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: `Sandbox Key (${new Date().toLocaleDateString()})` }),
      });
      const data = await res.json();
      if (data.ok) {
        setNewlyCreatedKey(data.key.fullKey);
        setKeys([
          {
            id: data.key.id,
            key_prefix: data.key.keyPrefix,
            label: data.key.label,
            environment: data.key.environment,
            created_at: data.key.createdAt,
          },
          ...keys,
        ]);
      }
    } catch {
      alert("Failed to generate sandbox key.");
    } finally {
      setCreating(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  function handleSimulateWebhook() {
    setWebhookTesting(true);
    setTimeout(() => {
      const mockPayload = {
        event: webhookEvent,
        timestamp: new Date().toISOString(),
        data: {
          project_id: "proj_demo_1",
          project_name: "Eagle Digital Platform Alpha",
          deliverable_id: "deliv_1",
          deliverable_title: "Design System & Interactive Prototype Specification",
          status: "pending_review",
        },
      };
      setWebhookResult({
        status: 200,
        signature: "t=1731835200,v1=9f8e4a7b2c6d1e0f8a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f",
        payload: JSON.stringify(mockPayload, null, 2),
      });
      setWebhookTesting(false);
    }, 600);
  }

  const codeSnippets = {
    typescript: `import { EagleClient } from "@eagle-technology/sdk";

// Initialize with your sandbox API key
const eagle = new EagleClient({
  apiKey: process.env.EAGLE_API_KEY || "eag_test_...",
  environment: "sandbox", // "sandbox" | "production"
});

async function main() {
  // Query active project milestone status
  const project = await eagle.projects.get("proj_demo_1");
  console.log("Current Phase:", project.phase);
  console.log("Health Status:", project.status);

  // List deliverables awaiting client sign-off
  const deliverables = await eagle.deliverables.list({
    status: "pending_review",
  });
  console.log(\`Found \${deliverables.length} deliverables in review\`);
}

main().catch(console.error);`,
    python: `from eagle_technology import EagleClient
import os

# Initialize with your sandbox API key
client = EagleClient(
    api_key=os.getenv("EAGLE_API_KEY", "eag_test_..."),
    environment="sandbox"
)

# Fetch current active project metadata
project = client.projects.get("proj_demo_1")
print(f"Project Name: {project.name}")
print(f"Current Phase: {project.phase}")

# Check review milestones
pending = client.deliverables.list(status="pending_review")
for item in pending:
    print(f"- {item.title} (Category: {item.category})")`,
    curl: `curl -X GET "https://api.eagletechnology.et/v1/projects/proj_demo_1/deliverables" \\
  -H "Authorization: Bearer eag_test_9f2a..." \\
  -H "Content-Type: application/json" \\
  -H "Eagle-Environment: sandbox"`,
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
              Developer Preview · Integration Sandbox v0.2.0-beta
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-3xl">
              Developer Platform &amp; API Sandbox
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted-brown)] max-w-2xl">
              Test programmatic integrations, generate sandbox keys, verify HMAC webhook signatures, and prepare client platforms for automated event synchronization.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateKey}
            disabled={creating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            <Key className="h-4 w-4" />
            {creating ? "Generating..." : "Generate Sandbox Key"}
          </button>
        </div>

        {/* Newly Created Key Alert */}
        {newlyCreatedKey && (
          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">New Sandbox API Key Generated</span>
              <span className="text-[11px] text-amber-700">Copy now; this key will not be displayed again</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-amber-200 bg-white p-2.5 font-mono text-xs text-[var(--color-dark-brown)]">
              <span>{newlyCreatedKey}</span>
              <button
                type="button"
                onClick={() => handleCopy(newlyCreatedKey)}
                className="inline-flex items-center gap-1 rounded bg-[var(--color-pale-gold)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-soft-sand)]"
              >
                {copiedKey ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                {copiedKey ? "Copied" : "Copy Key"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active API Keys Table */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-[var(--color-dark-brown)] mb-4">
          Sandbox API Credentials ({keys.length})
        </h2>

        {keys.length > 0 ? (
          <div className="divide-y divide-[var(--color-soft-sand)]">
            {keys.map((k) => (
              <div key={k.id} className="py-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--color-dark-brown)]">
                      {k.key_prefix}...
                    </span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 uppercase">
                      {k.environment}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-muted-brown)]">
                    {k.label}
                  </p>
                </div>
                <div className="text-[11px] text-[var(--color-muted-brown)]">
                  Created: {new Date(k.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-muted-brown)] py-4">
            No sandbox keys generated yet. Click &quot;Generate Sandbox Key&quot; to create your first credential.
          </p>
        )}
      </div>

      {/* Webhook Dispatch Simulator */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Webhook className="h-5 w-5 text-[var(--color-brown-gold)]" />
          <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
            Webhook Event Dispatcher (Simulator)
          </h2>
        </div>
        <p className="text-xs text-[var(--color-muted-brown)] max-w-2xl mb-5">
          Simulate real-time events sent by Eagle Technology when deliverables are uploaded, reviewed, or approved. Test your server&apos;s HMAC signature verification logic.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
              Event Trigger
            </label>
            <select
              value={webhookEvent}
              onChange={(e) => setWebhookEvent(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            >
              <option value="deliverable.ready_for_review">deliverable.ready_for_review</option>
              <option value="deliverable.approved">deliverable.approved</option>
              <option value="project.milestone_completed">project.milestone_completed</option>
              <option value="request.status_updated">request.status_updated</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-brown)] uppercase mb-1">
              Target Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3.5 py-2 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSimulateWebhook}
            disabled={webhookTesting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-dark-brown)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-deep-brown)] disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
            {webhookTesting ? "Simulating Dispatch..." : "Dispatch Test Webhook Event"}
          </button>
        </div>

        {webhookResult && (
          <div className="mt-5 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-deep-brown)] p-4 text-white">
            <div className="flex items-center justify-between border-b border-[var(--color-muted-brown)]/40 pb-2 text-xs">
              <span className="font-mono text-emerald-400">HTTP Status: {webhookResult.status} OK (Simulated)</span>
              <span className="font-mono text-[10px] text-[var(--color-soft-sand)]">Header: X-Eagle-Signature-256</span>
            </div>
            <p className="mt-2 text-[11px] font-mono text-[var(--color-brown-gold)] break-all">
              {webhookResult.signature}
            </p>
            <pre className="mt-3 overflow-x-auto text-xs font-mono text-[var(--color-soft-sand)] leading-relaxed">
              {webhookResult.payload}
            </pre>
          </div>
        )}
      </div>

      {/* Code Snippets (Tabbed) */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-soft-sand)] pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
              Integration Code Examples
            </h2>
            <p className="text-xs text-[var(--color-muted-brown)]">
              Use official SDK patterns to connect your internal applications to Eagle platform services.
            </p>
          </div>

          <div className="flex rounded-lg border border-[var(--color-soft-sand)] p-1 bg-[var(--color-warm-off-white)]">
            {(["typescript", "python", "curl"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[var(--color-dark-brown)] shadow-xs"
                    : "text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-deep-brown)] p-4 text-white">
          <pre className="overflow-x-auto text-xs font-mono leading-relaxed text-[var(--color-soft-sand)]">
            {codeSnippets[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}
