import React from "react";
import { AlertCircle, Inbox, Loader2, ShieldAlert } from "lucide-react";

export function LoadingState({ label = "Loading workspace data..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-10 text-sm text-[var(--color-muted-brown)]"
    >
      <Loader2 className="h-5 w-5 animate-spin text-[var(--color-brown-gold)]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-soft-sand)] bg-white p-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-pale-gold)] text-[var(--color-dark-brown)]">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-[var(--color-dark-brown)]">{title}</p>
      {description && (
        <p className="mt-1 max-w-md text-xs text-[var(--color-muted-brown)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900 sm:flex-row sm:items-center"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function PermissionDeniedState({
  message = "Your current founding role does not have permission to view or perform this action.",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/55 p-6 text-sm text-[var(--color-dark-brown)]">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]" aria-hidden="true" />
      <div>
        <p className="font-semibold">Permission Restricted</p>
        <p className="mt-1 text-xs text-[var(--color-muted-brown)]">{message}</p>
      </div>
    </div>
  );
}
