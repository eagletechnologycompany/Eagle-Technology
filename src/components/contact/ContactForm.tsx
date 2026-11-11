"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  ContactErrors,
  ContactPayload,
  resolveInitialService,
  SERVICE_OPTIONS,
  validateContactPayload,
} from "@/lib/contact-validation";

interface ContactFormProps {
  initialService?: string;
}

export function ContactForm({ initialService }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactPayload>({
    fullName: "",
    organization: "",
    email: "",
    subject: "",
    service: resolveInitialService(initialService),
    description: "",
  });

  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactPayload]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactPayload];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateContactPayload(formData);
    if (!result.valid) {
      setErrors(result.errors);
      setStatus("error");
      setServerMessage("Please correct the highlighted fields before submitting.");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.sanitized),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrors(data.errors ?? {});
        setServerMessage(data.message || "Unable to submit your inquiry right now.");
        return;
      }

      setStatus("success");
      setServerMessage(data.message);
      setFormData({
        fullName: "",
        organization: "",
        email: "",
        subject: "",
        service: resolveInitialService(initialService),
        description: "",
      });
    } catch {
      setStatus("error");
      setServerMessage("Network error while sending your inquiry. Please try again.");
    }
  }

  const inputBase =
    "w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-4 py-3 text-sm text-[var(--color-deep-brown)] placeholder:text-[var(--color-muted-brown)]/60 transition-colors focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-sm sm:p-8 md:p-10"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-brown-gold)] uppercase">
          Project Inquiry
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-dark-brown)]">
          Start a Conversation
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-brown)]">
          Tell us about the problem you want to solve. Our founding team reviews every
          inquiry carefully before proposing scope or next steps.
        </p>
      </div>

      {status === "success" && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/60 p-4 text-sm text-[var(--color-dark-brown)]"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]" />
          <div>
            <p className="font-semibold">Inquiry validated</p>
            <p className="mt-1 text-[var(--color-muted-brown)]">{serverMessage}</p>
          </div>
        </div>
      )}

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
          <p>{serverMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
          >
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputBase}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-700">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="organization"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
          >
            Organization *
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            required
            value={formData.organization}
            onChange={handleChange}
            placeholder="Company, NGO, institution, or Individual"
            className={inputBase}
            aria-invalid={Boolean(errors.organization)}
          />
          {errors.organization && (
            <p className="mt-1.5 text-xs text-red-700">{errors.organization}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
          >
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@organization.com"
            className={inputBase}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-700">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
          >
            Service of Interest *
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={inputBase}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="subject"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
        >
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief summary of your inquiry"
          className={inputBase}
          aria-invalid={Boolean(errors.subject)}
        />
        {errors.subject && (
          <p className="mt-1.5 text-xs text-red-700">{errors.subject}</p>
        )}
      </div>

      <div className="mt-5">
        <label
          htmlFor="description"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--color-dark-brown)] uppercase"
        >
          Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem you are trying to solve, key goals, and any timeline context."
          className={inputBase}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-700">{errors.description}</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-muted-brown)]">
          All inquiries are handled confidentially by the founding team.
        </p>
        <Button
          type="submit"
          disabled={status === "submitting"}
          size="md"
          className="gap-2 disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {status === "submitting" ? "Sending..." : "Submit Inquiry"}
        </Button>
      </div>
    </form>
  );
}
