"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  FileCheck,
  MessageSquarePlus,
  Code2,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Shield,
} from "lucide-react";

interface OnboardingWalkthroughProps {
  userDisplayLabel: string;
}

export function OnboardingWalkthrough({ userDisplayLabel }: OnboardingWalkthroughProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(1);

  const hasOnboardingParam = searchParams.get("onboarding") === "true";
  const isOpen = (hasOnboardingParam && !dismissed) || manualOpen;

  function handleClose() {
    setDismissed(true);
    setManualOpen(false);
    // Remove query param cleanly
    router.replace("/portal");
  }

  const steps = [
    {
      number: 1,
      title: "Inspect & Approve Deliverables",
      icon: FileCheck,
      badge: "Quality Governance",
      description:
        "Every project phase produces tangible milestones (Figma prototypes, architecture ADRs, live staging URLs). You can inspect the assets directly and provide one-click sign-off or structured revision notes.",
      highlight: "Visit 'Deliverables & Review' to inspect pending milestone deliverables.",
    },
    {
      number: 2,
      title: "Submit Scope Inquiries & Requests",
      icon: MessageSquarePlus,
      badge: "Transparent Collaboration",
      description:
        "Need a new technical feature, timeline adjustment, or architectural clarification? Submit structured change inquiries with priority flags and receive direct asynchronous updates from the founding team.",
      highlight: "Visit 'Requests & Inquiries' to submit and track project revisions.",
    },
    {
      number: 3,
      title: "Explore Developer Sandbox & SDK",
      icon: Code2,
      badge: "Platform Foundation",
      description:
        "Test integration code before production. Generate sandbox API keys (eag_test_...), simulate webhook events (such as milestone acceptance), and review integration code snippets in TypeScript, Python, and cURL.",
      highlight: "Visit 'Developer Sandbox' to explore our integration capabilities.",
    },
  ];

  const currentStepData = steps[step - 1];
  const StepIcon = currentStepData.icon;

  return (
    <>
      {/* Help / Guide Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          setManualOpen(true);
          setDismissed(false);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/70 px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)] transition-colors hover:bg-[var(--color-pale-gold)]"
      >
        <Sparkles className="h-3 w-3 text-[var(--color-brown-gold)]" />
        Platform Onboarding Guide
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-2xl md:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Close onboarding modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Welcome Tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)] uppercase">
                <Shield className="h-3 w-3 text-[var(--color-brown-gold)]" />
                Customer Platform Onboarding
              </span>
              <span className="text-xs text-[var(--color-muted-brown)]">
                Step {step} of 3
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-dark-brown)] md:text-2xl">
              Welcome, {userDisplayLabel}
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted-brown)] leading-relaxed">
              Here is how to get the most value out of your connected Eagle Technology workspace.
            </p>

            {/* Step Card */}
            <div className="mt-6 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brown-gold)] text-white">
                  <StepIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[var(--color-brown-gold)] uppercase border border-[var(--color-soft-sand)]">
                    {currentStepData.badge}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[var(--color-dark-brown)]">
                    {currentStepData.title}
                  </h3>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-deep-brown)]">
                {currentStepData.description}
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-2.5 text-[11px] font-semibold text-[var(--color-dark-brown)] border border-[var(--color-soft-sand)]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{currentStepData.highlight}</span>
              </div>
            </div>

            {/* Stepper Dots & Navigation Controls */}
            <div className="mt-6 flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    type="button"
                    onClick={() => setStep(dot)}
                    className={`h-2 rounded-full transition-all ${
                      dot === step
                        ? "w-6 bg-[var(--color-brown-gold)]"
                        : "w-2 bg-[var(--color-soft-sand)] hover:bg-[var(--color-muted-brown)]"
                    }`}
                    aria-label={`Go to step ${dot}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-soft-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)]"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
                  >
                    Enter Workspace
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
