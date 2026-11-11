"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Shield, CheckCircle2, KeyRound, Archive } from "lucide-react";
import { Permission, ROLE_LIST } from "@/lib/dashboard-constants";
import { ErrorState, LoadingState } from "./DashboardStates";

interface AccountRow {
  id: string;
  username: string;
  role_id: string;
  display_label: string;
  placeholder_name: string;
  is_active: number;
  active_sessions: number;
}

export function SettingsClient({
  currentUserId,
  roleTitle,
  permissions,
}: {
  currentUserId: string;
  roleTitle: string;
  permissions: Permission[];
}) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [companyStage, setCompanyStage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/settings");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Unable to load settings.");
      } else {
        setSettings(data.settings);
        setWorkspaceName(data.settings.workspace_name ?? "");
        setCompanyStage(data.settings.company_stage ?? "");
        setCanManage(Boolean(data.canManage));
        setAccounts(data.accounts ?? []);
      }
    } catch {
      setError("Network error loading settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/settings")
      .then((r) => r.json().then((data) => ({ ok: r.ok && data.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load settings.");
        } else {
          setSettings(data.settings);
          setWorkspaceName(data.settings.workspace_name ?? "");
          setCompanyStage(data.settings.company_stage ?? "");
          setCanManage(Boolean(data.canManage));
          setAccounts(data.accounts ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading settings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitPatch(payload: Record<string, unknown>) {
    setError("");
    setNotice("");
    const res = await fetch("/api/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error || "Update failed.");
      return false;
    }
    setNotice(data.message || "Saved.");
    await load();
    return true;
  }

  if (loading) return <LoadingState label="Loading settings..." />;

  return (
    <div className="space-y-8">
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/60 p-4 text-xs font-semibold text-[var(--color-dark-brown)]">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-brown-gold)]" />
          {notice}
        </div>
      )}
      {error && <ErrorState message={error} onRetry={load} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Role & Security Password Change */}
        <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[var(--color-brown-gold)]" />
            <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
              My Role Security ({roleTitle})
            </h2>
          </div>
          <p className="mb-4 text-[var(--color-muted-brown)]">
            Workspace: <strong>{settings.workspace_name}</strong> · Stage:{" "}
            <strong>{settings.company_stage}</strong>
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await submitPatch({
                action: "change_own_password",
                currentPassword,
                newPassword,
              });
              if (ok) {
                setCurrentPassword("");
                setNewPassword("");
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="mb-1 block font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">New Password (min 10 chars)</label>
              <input
                type="password"
                required
                minLength={10}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* Effective Permissions for Current Role */}
        <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--color-brown-gold)]" />
            <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
              Assigned Server-Side Permissions ({permissions.length})
            </h2>
          </div>
          <p className="mb-4 text-[var(--color-muted-brown)]">
            Permissions are enforced server-side on every API route and protected page.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {permissions.map((perm) => (
              <span
                key={perm}
                className="rounded-md border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-dark-brown)]"
              >
                {perm}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* CEO Workspace Management */}
      {canManage && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
            <h2 className="text-base font-bold text-[var(--color-dark-brown)]">
              CEO Workspace Administration
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitPatch({
                  action: "update_workspace",
                  workspaceName,
                  companyStage,
                });
              }}
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="mb-1 block font-semibold">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Company Stage</label>
                <input
                  type="text"
                  value={companyStage}
                  onChange={(e) => setCompanyStage(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap justify-between gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white"
                >
                  Save Workspace Settings
                </button>
                <button
                  type="button"
                  onClick={() => submitPatch({ action: "archive_demo_data" })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                >
                  <Archive className="h-3.5 w-3.5" /> Archive Demo Seed Records
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
            <h2 className="mb-4 text-base font-bold text-[var(--color-dark-brown)]">
              Founding Role Accounts ({accounts.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[var(--color-soft-sand)] text-[11px] text-[var(--color-muted-brown)] uppercase">
                  <tr>
                    <th className="py-2 pr-4">Role / Username</th>
                    <th className="py-2 pr-4">Display Label</th>
                    <th className="py-2 pr-4">Active Sessions</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-soft-sand)]">
                  {accounts.map((acc) => (
                    <tr key={acc.id}>
                      <td className="py-3 pr-4 font-semibold text-[var(--color-dark-brown)]">
                        {acc.role_id} (@{acc.username})
                      </td>
                      <td className="py-3 pr-4">{acc.display_label}</td>
                      <td className="py-3 pr-4 font-mono">{acc.active_sessions}</td>
                      <td className="py-3">
                        {acc.id === currentUserId ? (
                          <span className="font-semibold text-emerald-700">Active (You)</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              submitPatch({
                                action: "update_member_profile",
                                targetUserId: acc.id,
                                isActive: acc.is_active !== 1,
                              })
                            }
                            className={`rounded-lg px-2.5 py-1 font-semibold ${
                              acc.is_active === 1
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {acc.is_active === 1 ? "Active (Click to Disable)" : "Disabled (Enable)"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 text-xs">
            <h2 className="mb-3 text-base font-bold text-[var(--color-dark-brown)]">
              Role Permissions Matrix
            </h2>
            <div className="space-y-3">
              {ROLE_LIST.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-3"
                >
                  <p className="font-bold text-[var(--color-dark-brown)]">{r.title}</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--color-muted-brown)]">
                    {r.permissions.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
