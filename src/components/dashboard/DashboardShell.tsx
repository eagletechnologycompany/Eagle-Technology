"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  FolderKanban,
  CalendarDays,
  Users,
  Target,
  Scale,
  FileText,
  Activity,
  Settings,
  Bell,
  Search,
  Plus,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react";
import { EagleLogoMark } from "@/components/ui/EagleLogo";
import type { Permission, RoleId } from "@/lib/dashboard-constants";

export interface DashboardUserView {
  userId: string;
  username: string;
  roleId: RoleId;
  roleTitle: string;
  shortTitle: string;
  displayLabel: string;
  permissions: Permission[];
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link_href: string;
  read_at: string | null;
  created_at: string;
}

interface SearchResults {
  tasks: Array<{ id: string; title: string; status: string }>;
  projects: Array<{ id: string; name: string; status: string }>;
  documents: Array<{ id: string; file_name: string; category: string }>;
  decisions: Array<{ id: string; title: string; status: string }>;
  roles: Array<{ id: string; title: string; placeholder_name: string }>;
  meetings: Array<{ id: string; title: string; meeting_date: string }>;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/my-tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/dashboard/tasks", label: "All Tasks", icon: ListTodo },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/decisions", label: "Decisions", icon: Scale },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/projects/")) return "Project Workspace";
  const match = NAV_ITEMS.find((item) => !item.exact && pathname.startsWith(item.href));
  return match ? match.label : "Founder Workspace";
}

export function DashboardShell({
  founder,
  workspaceName,
  initialUnreadCount,
  children,
}: {
  founder: DashboardUserView;
  workspaceName: string;
  initialUnreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/dashboard";
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    if (!notifOpen) return;
    fetch("/api/dashboard/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setNotifications(data.notifications);
          setUnreadCount(
            (data.notifications as NotificationItem[]).filter((n) => !n.read_at).length
          );
        }
      })
      .catch(() => {});
  }, [notifOpen]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/dashboard/search?q=${encodeURIComponent(trimmed)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) {
            setSearchResults(data.results);
            setSearchOpen(true);
          }
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function handleMarkAllRead() {
    await fetch("/api/dashboard/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
    );
    setUnreadCount(0);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const canCreateProject = founder.permissions.includes("project.create");

  function renderNavList(isMobile = false) {
    return (
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto" aria-label="Dashboard navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isMobile) setMobileOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--color-brown-gold)] text-white shadow-xs"
                  : "text-[var(--color-soft-sand)]/80 hover:bg-[var(--color-dark-brown)] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {(!collapsed || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </span>
              {item.href === "/dashboard/activity" && unreadCount > 0 && (!collapsed || isMobile) && (
                <span className="rounded-full bg-[var(--color-pale-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-dark-brown)]">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-warm-off-white)] text-[var(--color-deep-brown)]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-[var(--color-dark-brown)] bg-[var(--color-deep-brown)] text-white transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-muted-brown)]/30 px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <EagleLogoMark
              size={34}
              color="var(--color-white)"
              accentColor="var(--color-brown-gold)"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">Eagle Ops</p>
                <p className="truncate text-[10px] text-[var(--color-brown-gold)]">
                  {workspaceName}
                </p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1.5 text-[var(--color-soft-sand)]/70 hover:bg-[var(--color-dark-brown)] hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 mt-4 rounded-xl border border-[var(--color-muted-brown)]/30 bg-[var(--color-dark-brown)]/60 p-3">
            <p className="text-[10px] font-semibold tracking-wider text-[var(--color-brown-gold)] uppercase">
              Signed In Role
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-white">
              {founder.roleTitle}
            </p>
          </div>
        )}

        {renderNavList(false)}

        <div className="border-t border-[var(--color-muted-brown)]/30 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-soft-sand)]/80 transition-colors hover:bg-[var(--color-dark-brown)] hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex w-72 flex-col bg-[var(--color-deep-brown)] text-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-[var(--color-muted-brown)]/30 px-4">
              <div className="flex items-center gap-2.5">
                <EagleLogoMark
                  size={34}
                  color="var(--color-white)"
                  accentColor="var(--color-brown-gold)"
                />
                <div>
                  <p className="text-sm font-bold">Eagle Ops</p>
                  <p className="text-[10px] text-[var(--color-brown-gold)]">
                    {founder.shortTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-soft-sand)]"
                aria-label="Close navigation drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderNavList(true)}
            <div className="border-t border-[var(--color-muted-brown)]/30 p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-soft-sand)] hover:bg-[var(--color-dark-brown)]"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Responsive Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--color-soft-sand)] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-soft-sand)] text-[var(--color-dark-brown)] lg:hidden"
              aria-label="Open navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="truncate text-lg font-bold text-[var(--color-dark-brown)]">
              {pageTitle}
            </h1>
          </div>

          {/* Global Search */}
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-brown)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length < 2) {
                  setSearchResults(null);
                  setSearchOpen(false);
                }
              }}
              onFocus={() => searchResults && setSearchOpen(true)}
              placeholder="Search tasks, projects, documents, decisions..."
              aria-label="Global dashboard search"
              className="w-full rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] py-2 pr-3 pl-9 text-xs text-[var(--color-deep-brown)] focus:border-[var(--color-brown-gold)] focus:bg-white focus:outline-none"
            />

            {searchOpen && searchResults && (
              <div className="absolute right-0 left-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl border border-[var(--color-soft-sand)] bg-white p-3 shadow-lg">
                <div className="mb-2 flex items-center justify-between border-b border-[var(--color-soft-sand)] pb-2">
                  <span className="text-[11px] font-semibold text-[var(--color-muted-brown)] uppercase">
                    Search Results
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-xs text-[var(--color-muted-brown)] hover:text-[var(--color-dark-brown)]"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Tasks</p>
                      {searchResults.tasks.map((t) => (
                        <Link
                          key={t.id}
                          href={`/dashboard/tasks?task=${t.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {t.title} <span className="text-[var(--color-muted-brown)]">({t.status})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.projects.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Projects</p>
                      {searchResults.projects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/dashboard/projects/${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {p.name} <span className="text-[var(--color-muted-brown)]">({p.status})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.documents.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Documents</p>
                      {searchResults.documents.map((d) => (
                        <Link
                          key={d.id}
                          href="/dashboard/documents"
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {d.file_name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.decisions.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Decisions</p>
                      {searchResults.decisions.map((d) => (
                        <Link
                          key={d.id}
                          href="/dashboard/decisions"
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {d.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.roles.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Team Roles</p>
                      {searchResults.roles.map((r) => (
                        <Link
                          key={r.id}
                          href="/dashboard/team"
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {r.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.meetings.length > 0 && (
                    <div>
                      <p className="mb-1 font-semibold text-[var(--color-brown-gold)]">Meetings</p>
                      {searchResults.meetings.map((m) => (
                        <Link
                          key={m.id}
                          href="/dashboard/decisions?tab=meetings"
                          onClick={() => setSearchOpen(false)}
                          className="block rounded-lg px-2 py-1.5 hover:bg-[var(--color-warm-off-white)]"
                        >
                          {m.title} ({m.meeting_date})
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.tasks.length === 0 &&
                    searchResults.projects.length === 0 &&
                    searchResults.documents.length === 0 &&
                    searchResults.decisions.length === 0 &&
                    searchResults.roles.length === 0 &&
                    searchResults.meetings.length === 0 && (
                      <p className="py-2 text-center text-[var(--color-muted-brown)]">
                        No matching records found.
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Quick Create, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Create */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setQuickOpen((v) => !v);
                  setNotifOpen(false);
                  setUserMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brown-gold)] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Quick Create</span>
              </button>

              {quickOpen && (
                <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-[var(--color-soft-sand)] bg-white p-1.5 shadow-lg text-xs">
                  <Link
                    href="/dashboard/tasks?new=1"
                    onClick={() => setQuickOpen(false)}
                    className="block rounded-lg px-3 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                  >
                    + New Task
                  </Link>
                  {canCreateProject && (
                    <Link
                      href="/dashboard/projects?new=1"
                      onClick={() => setQuickOpen(false)}
                      className="block rounded-lg px-3 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                    >
                      + New Project
                    </Link>
                  )}
                  <Link
                    href="/dashboard/decisions?new=1"
                    onClick={() => setQuickOpen(false)}
                    className="block rounded-lg px-3 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                  >
                    + Log Decision
                  </Link>
                  <Link
                    href="/dashboard/documents?upload=1"
                    onClick={() => setQuickOpen(false)}
                    className="block rounded-lg px-3 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                  >
                    + Upload Document
                  </Link>
                  <Link
                    href="/dashboard/team#checkin"
                    onClick={() => setQuickOpen(false)}
                    className="block rounded-lg px-3 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
                  >
                    + Weekly Check-in
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setQuickOpen(false);
                  setUserMenuOpen(false);
                }}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-soft-sand)] text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brown-gold)] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-[var(--color-soft-sand)] bg-white p-3 shadow-lg">
                  <div className="mb-2 flex items-center justify-between border-b border-[var(--color-soft-sand)] pb-2">
                    <span className="text-xs font-bold text-[var(--color-dark-brown)]">
                      In-App Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-[var(--color-brown-gold)] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--color-muted-brown)]">
                      No notifications yet.
                    </p>
                  ) : (
                    <div className="max-h-72 space-y-2 overflow-y-auto">
                      {notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link_href}
                          onClick={() => setNotifOpen(false)}
                          className={`block rounded-lg border p-2.5 text-xs ${
                            n.read_at
                              ? "border-[var(--color-soft-sand)] bg-white"
                              : "border-[var(--color-brown-gold)]/40 bg-[var(--color-pale-gold)]/50"
                          }`}
                        >
                          <p className="font-semibold text-[var(--color-dark-brown)]">
                            {n.title}
                          </p>
                          <p className="mt-0.5 text-[var(--color-muted-brown)]">{n.message}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen((v) => !v);
                  setNotifOpen(false);
                  setQuickOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-soft-sand)] bg-[var(--color-warm-off-white)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-dark-brown)] hover:bg-[var(--color-pale-gold)]"
              >
                <span className="hidden sm:inline">{founder.shortTitle}</span>
                <span className="sm:hidden">{founder.roleId.toUpperCase()}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--color-muted-brown)]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-[var(--color-soft-sand)] bg-white p-2 shadow-lg text-xs">
                  <div className="border-b border-[var(--color-soft-sand)] px-2.5 pb-2 mb-1.5">
                    <p className="font-bold text-[var(--color-dark-brown)]">
                      {founder.roleTitle}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted-brown)]">
                      @{founder.username}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block rounded-lg px-2.5 py-2 font-medium text-[var(--color-dark-brown)] hover:bg-[var(--color-warm-off-white)]"
                  >
                    Account &amp; Settings
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="block rounded-lg px-2.5 py-2 font-medium text-[var(--color-muted-brown)] hover:bg-[var(--color-warm-off-white)]"
                  >
                    View Public Website
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 block w-full rounded-lg px-2.5 py-2 text-left font-semibold text-red-700 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
