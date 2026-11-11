"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Upload, Download, Archive, Lock, X, FileText } from "lucide-react";
import {
  DOCUMENT_ACCESS_LEVELS,
  DOCUMENT_CATEGORIES,
  Permission,
  ROLE_LIST,
} from "@/lib/dashboard-constants";
import { EmptyState, ErrorState, LoadingState } from "./DashboardStates";

interface DocumentRow {
  id: string;
  file_name: string;
  category: string;
  description: string;
  version: string;
  size_bytes: number;
  access_level: string;
  owner_label: string;
  uploader_label: string;
  project_name: string | null;
  created_at: string;
}

export function DocumentsClient({
  permissions,
  initialUploadOpen,
}: {
  permissions: Permission[];
  initialUploadOpen?: boolean;
}) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const [uploadOpen, setUploadOpen] = useState(Boolean(initialUploadOpen));
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("Company Foundation");
  const [accessLevel, setAccessLevel] = useState<string>("all_founders");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [relatedProjectId, setRelatedProjectId] = useState("");
  const [version, setVersion] = useState("v1.0");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const canUpload = permissions.includes("document.upload");
  const canDelete = permissions.includes("document.delete");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (categoryFilter) qs.set("category", categoryFilter);
      if (searchText.trim()) qs.set("q", searchText.trim());

      const [dRes, pRes] = await Promise.all([
        fetch(`/api/dashboard/documents?${qs.toString()}`),
        fetch("/api/dashboard/projects"),
      ]);
      const dData = await dRes.json();
      const pData = await pRes.json();

      if (!dRes.ok || !dData.ok) {
        setError(dData.error || "Unable to load documents.");
      } else {
        setDocuments(dData.documents);
      }
      if (pRes.ok && pData.ok) {
        setProjects(pData.projects);
      }
    } catch {
      setError("Network error loading private documents.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchText]);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams();
    if (categoryFilter) qs.set("category", categoryFilter);
    if (searchText.trim()) qs.set("q", searchText.trim());

    Promise.all([
      fetch(`/api/dashboard/documents?${qs.toString()}`).then((r) =>
        r.json().then((d) => ({ ok: r.ok && d.ok, data: d }))
      ),
      fetch("/api/dashboard/projects").then((r) =>
        r.json().then((d) => ({ ok: r.ok && d.ok, data: d }))
      ),
    ])
      .then(([docRes, projRes]) => {
        if (cancelled) return;
        if (!docRes.ok) {
          setError(docRes.data.error || "Unable to load documents.");
        } else {
          setDocuments(docRes.data.documents);
          setError("");
        }
        if (projRes.ok) {
          setProjects(projRes.data.projects);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error loading private documents.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryFilter, searchText]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", category);
      form.append("accessLevel", accessLevel);
      form.append("allowedRoles", JSON.stringify(selectedRoles));
      form.append("relatedProjectId", relatedProjectId);
      form.append("version", version);
      form.append("description", description);

      const res = await fetch("/api/dashboard/documents", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Upload failed.");
      } else {
        setUploadOpen(false);
        setFile(null);
        setDescription("");
        await load();
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleArchive(id: string) {
    const res = await fetch("/api/dashboard/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-dark-brown)]">
            Private Document Library
          </h2>
          <p className="text-xs text-[var(--color-muted-brown)]">
            Protected internal files stored outside public routes with role and project
            access verification on every download.
          </p>
        </div>

        {canUpload && (
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Upload className="h-4 w-4" /> Upload Document
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-soft-sand)] bg-white p-4 sm:grid-cols-2 text-xs">
        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search document names or descriptions..."
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter documents by category"
          className="rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
        >
          <option value="">All 13 Categories</option>
          {DOCUMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState label="Loading private documents..." />
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents have been shared here."
          description="Upload approved documents (PDF, PNG, DOCX, MD, CSV, etc. up to 10 MB) with explicit role access."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] text-[11px] font-semibold text-[var(--color-muted-brown)] uppercase">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Uploaded By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-soft-sand)]">
              {documents.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 font-semibold text-[var(--color-dark-brown)]">
                      <FileText className="h-4 w-4 text-[var(--color-brown-gold)]" />
                      {d.file_name}
                    </div>
                    {d.description && (
                      <p className="mt-0.5 text-[11px] text-[var(--color-muted-brown)]">
                        {d.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted-brown)]">{d.category}</td>
                  <td className="px-4 py-3.5 font-mono">{d.version}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-pale-gold)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-dark-brown)]">
                      <Lock className="h-3 w-3" /> {d.access_level}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted-brown)]">
                    {d.uploader_label}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <a
                      href={`/api/dashboard/documents/${d.id}/download`}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--color-brown-gold)] hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleArchive(d.id)}
                        className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline"
                      >
                        <Archive className="h-3.5 w-3.5" /> Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && canUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6 shadow-xl text-xs">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Upload Private Document
              </h3>
              <button type="button" onClick={() => setUploadOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="mb-1 block font-semibold">File (max 10 MB) *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {DOCUMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Access Level</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    {DOCUMENT_ACCESS_LEVELS.map((al) => (
                      <option key={al.value} value={al.value}>
                        {al.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Related Project</label>
                  <select
                    value={relatedProjectId}
                    onChange={(e) => setRelatedProjectId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-3 py-2"
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {accessLevel === "selected_roles" && (
                <div>
                  <label className="mb-1 block font-semibold">Allowed Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_LIST.map((r) => (
                      <label key={r.id} className="inline-flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(r.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoles((prev) => [...prev, r.id]);
                            } else {
                              setSelectedRoles((prev) => prev.filter((x) => x !== r.id));
                            }
                          }}
                        />
                        <span>{r.shortTitle}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="rounded-lg border border-[var(--color-soft-sand)] px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="rounded-lg bg-[var(--color-brown-gold)] px-4 py-2 font-semibold text-white disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload Privately"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
