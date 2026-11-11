import type { DatabaseSync } from "node:sqlite";
import type { RoleId } from "@/lib/dashboard-constants";

export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getAccessibleProjectIds(
  db: DatabaseSync,
  userId: string,
  roleId: RoleId
): Set<string> {
  if (roleId === "ceo") {
    const rows = db
      .prepare("SELECT id FROM projects WHERE archived_at IS NULL")
      .all() as Array<{ id: string }>;
    return new Set(rows.map((r) => r.id));
  }

  const rows = db
    .prepare(
      `SELECT DISTINCT p.id
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.archived_at IS NULL
         AND (p.lead_user_id = ? OR pm.user_id = ?)`
    )
    .all(userId, userId) as Array<{ id: string }>;
  return new Set(rows.map((r) => r.id));
}

export function canAccessProject(
  db: DatabaseSync,
  projectId: string,
  userId: string,
  roleId: RoleId
): boolean {
  if (roleId === "ceo") return true;
  const row = db
    .prepare(
      `SELECT 1 FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.id = ? AND (p.lead_user_id = ? OR pm.user_id = ?)`
    )
    .get(projectId, userId, userId);
  return Boolean(row);
}

export function getTeamMembers(db: DatabaseSync) {
  return db
    .prepare(
      `SELECT u.id, u.username, u.role_id, u.display_label, u.is_active,
              r.title as role_title, r.short_title,
              p.placeholder_name, p.responsibilities_json, p.capacity_note
       FROM users u
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN team_member_profiles p ON p.user_id = u.id
       ORDER BY CASE u.role_id
         WHEN 'ceo' THEN 1
         WHEN 'frontend' THEN 2
         WHEN 'backend' THEN 3
         WHEN 'design' THEN 4
         WHEN 'ai_automation' THEN 5
         ELSE 6
       END`
    )
    .all() as Array<{
    id: string;
    username: string;
    role_id: RoleId;
    display_label: string;
    is_active: number;
    role_title: string;
    short_title: string;
    placeholder_name: string;
    responsibilities_json: string;
    capacity_note: string;
  }>;
}

export function getCurrentWeekStartIso(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export function getOverviewData(
  db: DatabaseSync,
  userId: string,
  roleId: RoleId
) {
  const today = new Date().toISOString().slice(0, 10);
  const inSevenDays = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const weekStart = getCurrentWeekStartIso();

  const myOpenTasks = db
    .prepare(
      `SELECT t.*, p.name as project_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       WHERE t.archived_at IS NULL
         AND t.status NOT IN ('Completed', 'Archived')
         AND (t.owner_user_id = ? OR t.collaborators_json LIKE ?)
       ORDER BY CASE t.priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 ELSE 4 END, t.due_date ASC`
    )
    .all(userId, `%"${userId}"%`) as Array<Record<string, unknown>>;

  const dueThisWeek = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.archived_at IS NULL
         AND t.status NOT IN ('Completed', 'Archived')
         AND t.due_date IS NOT NULL AND t.due_date != ''
         AND t.due_date <= ?
       ORDER BY t.due_date ASC`
    )
    .all(inSevenDays) as Array<Record<string, unknown>>;

  const blockedTasks = db
    .prepare(
      `SELECT t.*, p.name as project_name, u.display_label as owner_label
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.owner_user_id
       WHERE t.archived_at IS NULL AND t.status = 'Blocked'
       ORDER BY t.updated_at DESC`
    )
    .all() as Array<Record<string, unknown>>;

  const accessibleProjectIds = getAccessibleProjectIds(db, userId, roleId);
  const allActiveProjects = db
    .prepare(
      `SELECT p.*, u.display_label as lead_label
       FROM projects p
       JOIN users u ON u.id = p.lead_user_id
       WHERE p.archived_at IS NULL AND p.status NOT IN ('Archived', 'Delivered')
       ORDER BY p.updated_at DESC`
    )
    .all() as Array<{ id: string } & Record<string, unknown>>;

  const activeProjects = allActiveProjects.filter((p) =>
    accessibleProjectIds.has(p.id)
  );

  const upcomingMilestones = (
    db
      .prepare(
        `SELECT m.*, p.name as project_name
         FROM milestones m
         JOIN projects p ON p.id = m.project_id
         WHERE p.archived_at IS NULL AND m.status != 'Completed'
         ORDER BY m.due_date ASC`
      )
      .all() as Array<{ project_id: string } & Record<string, unknown>>
  ).filter((m) => accessibleProjectIds.has(m.project_id));

  const pendingDecisions = db
    .prepare(
      `SELECT d.*, u.display_label as owner_label
       FROM decisions d
       JOIN users u ON u.id = d.owner_user_id
       WHERE d.archived_at IS NULL AND d.status IN ('Proposed', 'Under discussion')
       ORDER BY d.decision_date DESC`
    )
    .all() as Array<Record<string, unknown>>;

  const goals = db
    .prepare(
      `SELECT * FROM goals WHERE archived_at IS NULL ORDER BY id ASC`
    )
    .all() as Array<{ status: string; progress: number } & Record<string, unknown>>;

  const recentActivity = db
    .prepare(
      `SELECT a.*, u.display_label as actor_label
       FROM activity_logs a
       LEFT JOIN users u ON u.id = a.actor_user_id
       ORDER BY a.created_at DESC
       LIMIT 12`
    )
    .all() as Array<Record<string, unknown>>;

  const members = getTeamMembers(db);
  const workloadSummary = members.map((member) => {
    const counts = db
      .prepare(
        `SELECT
           COUNT(*) as total_open,
           SUM(CASE WHEN status = 'Blocked' THEN 1 ELSE 0 END) as blocked_count,
           SUM(CASE WHEN due_date IS NOT NULL AND due_date != '' AND due_date < ? THEN 1 ELSE 0 END) as overdue_count
         FROM tasks
         WHERE archived_at IS NULL AND status NOT IN ('Completed', 'Archived') AND owner_user_id = ?`
      )
      .get(today, member.id) as {
      total_open: number;
      blocked_count: number | null;
      overdue_count: number | null;
    };

    const checkIn = db
      .prepare(
        `SELECT id, confidence_level, updated_at FROM weekly_check_ins WHERE user_id = ? AND week_start = ?`
      )
      .get(member.id, weekStart) as
      | { id: string; confidence_level: string; updated_at: string }
      | undefined;

    return {
      userId: member.id,
      roleId: member.role_id,
      roleTitle: member.role_title,
      shortTitle: member.short_title,
      openTasks: counts.total_open,
      blockedTasks: counts.blocked_count ?? 0,
      overdueTasks: counts.overdue_count ?? 0,
      hasWeeklyCheckIn: Boolean(checkIn),
      confidenceLevel: checkIn?.confidence_level ?? null,
    };
  });

  const unassignedCount = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM tasks WHERE archived_at IS NULL AND status NOT IN ('Completed', 'Archived') AND (owner_user_id IS NULL OR owner_user_id = '')`
      )
      .get() as { c: number }
  ).c;

  const completedThisWeek = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM tasks WHERE status = 'Completed' AND updated_at >= ?`
      )
      .get(weekStart) as { c: number }
  ).c;

  return {
    today,
    weekStart,
    summary: {
      myOpenCount: myOpenTasks.length,
      dueThisWeekCount: dueThisWeek.length,
      blockedCount: blockedTasks.length,
      activeProjectsCount: activeProjects.length,
      pendingDecisionsCount: pendingDecisions.length,
      unassignedCount,
      completedThisWeek,
      goalsTotal: goals.length,
      goalsInProgress: goals.filter((g) => g.status === "In progress").length,
      goalsCompleted: goals.filter((g) => g.status === "Completed").length,
    },
    myOpenTasks: myOpenTasks.slice(0, 6),
    dueThisWeek: dueThisWeek.slice(0, 6),
    blockedTasks: blockedTasks.slice(0, 6),
    activeProjects: activeProjects.slice(0, 5),
    upcomingMilestones: upcomingMilestones.slice(0, 5),
    pendingDecisions: pendingDecisions.slice(0, 5),
    goals: goals.slice(0, 6),
    workloadSummary,
    recentActivity,
  };
}
