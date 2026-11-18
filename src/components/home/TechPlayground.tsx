"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import { ArchitectureViewer } from "@/components/home/ArchitectureViewer";

const CODE_EXAMPLES = {
  typescript: {
    title: "TypeScript SDK",
    filename: "client.ts",
    language: "typescript",
    code: `import { EagleClient } from "@eagle-technology/sdk";

// Initialize client with sandbox API key
const eagle = new EagleClient({
  apiKey: process.env.EAGLE_SANDBOX_KEY,
  environment: "sandbox", // "sandbox" | "production"
});

// Request milestone validation & dispatch event
async function verifyDeliverable(milestoneId: string) {
  const result = await eagle.deliverables.verify({
    milestoneId,
    autoAcceptance: false,
    webhookUrl: "https://api.yourcompany.com/webhooks/eagle",
  });

  console.log("Milestone Status:", result.status);
  return result;
}`,
  },
  python: {
    title: "Python AI Pipeline",
    filename: "pipeline.py",
    language: "python",
    code: `from eagle import EagleAutomation, PipelineConfig

# Configure cognitive analysis pipeline
pipeline = EagleAutomation(
    api_key="eag_test_94a73e618f...",
    region="addis-ababa-edge-1"
)

@pipeline.workflow("customer_intake")
async def process_project_scope(payload: dict):
    # Step 1: Cognitive analysis of technical requirements
    analysis = await pipeline.ai.analyze_specs(payload["brief"])
    
    # Step 2: Architecture recommendation & milestone schedule
    schedule = pipeline.scoping.estimate_milestones(analysis.complexity)
    
    return {"status": "ready", "milestones": schedule}`,
  },
  bash: {
    title: "cURL API Contract",
    filename: "request.sh",
    language: "bash",
    code: `curl -X POST "https://api.eagletechnology.et/v1/projects/inquire" \\
  -H "Authorization: Bearer eag_test_94a73e618f4b2e0f" \\
  -H "Content-Type: application/json" \\
  -H "X-Eagle-Signature-256: 4f8b2e0f..." \\
  -d '{
    "organization": "Horn Horizon Tech",
    "service_pillar": "software_platforms",
    "delivery_tier": "milestone_staged",
    "initial_phase": "architecture_discovery"
  }'`,
  },
};

const PIPELINE_STEPS = [
  {
    id: 1,
    title: "Ingest",
    detail: "Accept a structured project brief in the sandbox contract",
    latency: "preview",
  },
  {
    id: 2,
    title: "Analyze",
    detail: "Classify scope before any automated recommendation",
    latency: "preview",
  },
  {
    id: 3,
    title: "Transform",
    detail: "Turn the brief into milestone-ready work packages",
    latency: "preview",
  },
  {
    id: 4,
    title: "Deploy",
    detail: "Dispatch a mock project.milestone_ready event",
    latency: "preview",
  },
];

export function TechPlayground() {
  const [activeTab, setActiveTab] = useState<"typescript" | "python" | "bash">("typescript");
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[system:init] Ready for pipeline execution.",
  ]);

  function handleCopy() {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function runSimulation() {
    if (simulating) return;
    setSimulating(true);
    setCurrentStep(1);
    setLogs(["[00:00.012] [ingress] POST /v1/projects/inquire received (200 OK)"]);

    setTimeout(() => {
      setCurrentStep(2);
      setLogs((prev) => [
        ...prev,
        "[00:00.197] [ai-engine] Requirements analyzed: 4 core modules identified.",
      ]);
    }, 700);

    setTimeout(() => {
      setCurrentStep(3);
      setLogs((prev) => [
        ...prev,
        "[00:00.201] [db:wal] Stored in eagle_operations.db (transaction committed).",
      ]);
    }, 1400);

    setTimeout(() => {
      setCurrentStep(4);
      setLogs((prev) => [
        ...prev,
        "[00:00.243] [webhook] Event 'project.milestone_ready' dispatched with HMAC signature.",
        "[00:00.245] [status:success] Pipeline completed successfully in 243ms.",
      ]);
      setSimulating(false);
    }, 2100);
  }

  function resetSimulation() {
    setCurrentStep(0);
    setLogs(["[system:init] Ready for pipeline execution."]);
  }

  return (
    <div className="rounded-3xl border border-[var(--color-dark-brown)]/15 bg-gradient-to-b from-[var(--color-deep-brown)] to-[#150c04] p-6 text-white shadow-2xl md:p-10">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-muted-brown)]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brown-gold)]/40 bg-[var(--color-brown-gold)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-brown-gold)]">
            <Cpu className="h-3.5 w-3.5" />
            Developer Platform &amp; Automation Preview
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            The Engine Behind Eagle Technology
          </h3>
          <p className="mt-1 text-xs text-[var(--color-soft-sand)]/75">
            Explore our developer platform architecture, upcoming SDK contracts, and real-time execution pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-mono text-[var(--color-soft-sand)]/80 border border-white/5 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sandbox Gateway: Online
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Code Editor Terminal */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Editor Tab Bar */}
          <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-[var(--color-muted-brown)]/30 bg-black/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-[var(--color-soft-sand)]/60">
                {CODE_EXAMPLES[activeTab].filename}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {(["typescript", "python", "bash"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-[var(--color-brown-gold)] text-white"
                      : "text-[var(--color-soft-sand)]/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab === "typescript" ? "TypeScript" : tab === "python" ? "Python" : "cURL"}
                </button>
              ))}

              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 rounded-md p-1.5 text-stone-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Copy code to clipboard"
                aria-label="Copy code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-x-auto rounded-b-xl border border-[var(--color-muted-brown)]/30 bg-[#0d0702] p-4 text-xs font-mono leading-relaxed text-[var(--color-soft-sand)]">
            <pre className="text-[11px] leading-5 text-[var(--color-soft-sand)]">
              <code>{CODE_EXAMPLES[activeTab].code}</code>
            </pre>
          </div>

          <p className="mt-2 text-[10px] text-[var(--color-soft-sand)]/60 flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3 text-[var(--color-brown-gold)]" />
            <span>Developer SDK in active preview (CR-08). Register to generate test sandbox API keys.</span>
          </p>
        </div>

        {/* Right Column: Live Pipeline Simulator */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[var(--color-muted-brown)]/30 bg-black/30 p-5">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-muted-brown)]/20 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
                Pipeline Execution Engine
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={simulating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                >
                  <Play className="h-3 w-3" />
                  {simulating ? "Simulating..." : "Run Pipeline"}
                </button>
                <button
                  type="button"
                  onClick={resetSimulation}
                  disabled={simulating}
                  className="rounded-lg border border-[var(--color-muted-brown)]/40 p-1 text-stone-400 hover:text-white"
                  title="Reset"
                  aria-label="Reset simulator"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Pipeline Step Sequence */}
            <div className="mt-4 space-y-2.5">
              {PIPELINE_STEPS.map((step) => {
                const isPassed = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 rounded-lg p-2.5 transition-all ${
                      isCurrent
                        ? "bg-[var(--color-brown-gold)]/20 border border-[var(--color-brown-gold)]/50"
                        : isPassed
                        ? "bg-white/5 border border-emerald-500/20"
                        : "bg-white/2 border border-transparent opacity-60"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isPassed
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-[var(--color-brown-gold)] text-white animate-pulse"
                          : "bg-white/10 text-stone-400"
                      }`}
                    >
                      {isPassed ? <Check className="h-3.5 w-3.5" /> : step.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">
                          {step.title}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--color-brown-gold)]">
                          {step.latency}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-soft-sand)]/70 truncate">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="mt-4 rounded-lg bg-black/70 p-3 font-mono text-[10px] leading-relaxed text-emerald-400/90 border border-white/5 max-h-32 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ArchitectureViewer />
    </div>
  );
}
