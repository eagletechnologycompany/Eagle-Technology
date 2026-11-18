import React from "react";
import { requirePortalPage } from "@/server/auth/session";
import {
  ReceiptText,
  CheckCircle2,
  Clock,
  Building2,
  CreditCard,
} from "lucide-react";

export default async function BillingPage() {
  await requirePortalPage();

  const milestones = [
    {
      id: "m_1",
      name: "Phase 1: Discovery, Technical Architecture & Requirements",
      percentage: "25%",
      amount: "Milestone Deposit",
      status: "Paid / Confirmed",
      date: "Initial Agreement",
      isComplete: true,
    },
    {
      id: "m_2",
      name: "Phase 2: UI/UX Prototype & API Specification Sign-Off",
      percentage: "25%",
      amount: "Sprint Milestone 1",
      status: "Pending Deliverable Review",
      date: "Upon Design Sign-Off",
      isCurrent: true,
    },
    {
      id: "m_3",
      name: "Phase 3: Core System Engineering & Platform Integration",
      percentage: "30%",
      amount: "Sprint Milestone 2",
      status: "Scheduled",
      date: "Phase 3 Handover",
      isPending: true,
    },
    {
      id: "m_4",
      name: "Phase 4: Comprehensive QA, Verification & Source Handover",
      percentage: "20%",
      amount: "Final Delivery",
      status: "Scheduled",
      date: "Final Sign-Off",
      isPending: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-[var(--color-soft-sand)] pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-brown)] mb-2">
          <ReceiptText className="h-3.5 w-3.5 text-[var(--color-brown-gold)]" />
          Transparent Engagement Schedule
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-dark-brown)] sm:text-3xl">
          Milestones &amp; Project Billing
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-brown)]">
          Milestone-based delivery ensures that every payment is directly tied to validated engineering progress, deliverable inspection, and client sign-off.
        </p>
      </div>

      {/* Milestone Progress Cards */}
      <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-[var(--color-dark-brown)] mb-4">
          Contract Milestone Breakdown
        </h2>

        <div className="divide-y divide-[var(--color-soft-sand)]">
          {milestones.map((m) => (
            <div key={m.id} className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--color-brown-gold)]">
                    {m.percentage}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--color-dark-brown)]">
                    {m.name}
                  </h3>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-muted-brown)]">
                  <span>Target: {m.date}</span>
                  <span>·</span>
                  <span>Type: {m.amount}</span>
                </div>
              </div>

              <div>
                {m.isComplete ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {m.status}
                  </span>
                ) : m.isCurrent ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    {m.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                    {m.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Processing Notice (Strictly Honest) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-[var(--color-brown-gold)]" />
            <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
              Direct Wire &amp; Bank Settlement
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-[var(--color-muted-brown)]">
            Official commercial invoices are issued directly by Eagle Technology with settlement instructions via authorized Ethiopian commercial banking institutions (Commercial Bank of Ethiopia, Awash Bank) or verified regional correspondent channels.
          </p>
          <div className="mt-4 rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3 text-xs text-[var(--color-dark-brown)]">
            <strong className="block mb-1">Commercial Billing Notice:</strong>
            Tax invoices (with VAT/Withholding where applicable) and formal milestone release letters are co-signed by the Founder &amp; CEO upon deliverable sign-off.
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-[var(--color-brown-gold)]" />
            <h3 className="text-base font-bold text-[var(--color-dark-brown)]">
              Digital Payment Gateway Status
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-[var(--color-muted-brown)]">
            Integration with automated digital payment processors (Telebirr, CBE Birr, and international card processors) is currently marked as <strong className="text-[var(--color-dark-brown)]">Integration Pending</strong> while commercial merchant accounts and regulatory certifications are finalized.
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
            <strong className="block mb-0.5">No Fake Checkouts:</strong>
            We do not collect simulated credit card payments or pretend live processing exists before regulatory approval.
          </div>
        </div>
      </div>
    </div>
  );
}
