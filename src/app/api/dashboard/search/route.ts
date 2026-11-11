import { NextResponse } from "next/server";
import { getDb } from "@/server/db/client";
import { requireApiAuth } from "@/server/auth/session";
import { getAccessibleProjectIds } from "@/server/dashboard/queries";
import { canUserAccessDocument } from "@/server/documents/storage";

export async function GET(request: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  if (q.length < 2) {
    return NextResponse.json({
      ok: true,
      results: {
        tasks: [],
        projects: [],
        documents: [],
        decisions: [],
        roles: [],
        meetings: [],
      },
    });
  }

  const db = getDb();
  const like = `%${q}%`;
  const accessibleProjects = getAccessibleProjectIds(
    db,
    auth.founder.userId,
    auth.founder.roleId
  );

  const tasks = db
    .prepare(
      `SELECT id, title, status, priority, project_id
       FROM tasks
       WHERE archived_at IS NULL AND (title LIKE ? OR description LIKE ? OR labels_json LIKE ?)
       LIMIT 10`
    )
    .all(like, like, like);

  const rawProjects = db
    .prepare(
      `SELECT id, name, status, phase
       FROM projects
       WHERE archived_at IS NULL AND (name LIKE ? OR objective LIKE ? OR description LIKE ?)
       LIMIT 10`
    )
    .all(like, like, like) as Array<{ id: string } & Record<string, unknown>>;

  const projects = rawProjects.filter((p) => accessibleProjects.has(p.id));

  const rawDocs = db
    .prepare(
      `SELECT id, file_name, category, access_level, allowed_roles_json, related_project_id, owner_user_id, uploaded_by
       FROM documents
       WHERE archived_at IS NULL AND (file_name LIKE ? OR description LIKE ? OR category LIKE ?)
       LIMIT 15`
    )
    .all(like, like, like) as Array<{
    access_level: string;
    allowed_roles_json: string;
    related_project_id: string | null;
    owner_user_id: string;
    uploaded_by: string;
  } & Record<string, unknown>>;

  const documents = rawDocs
    .filter((d) =>
      canUserAccessDocument(db, d, auth.founder.userId, auth.founder.roleId)
    )
    .slice(0, 10)
    .map(({ id, file_name, category }) => ({ id, file_name, category }));

  const decisions = db
    .prepare(
      `SELECT id, title, status, decision_date
       FROM decisions
       WHERE archived_at IS NULL AND (title LIKE ? OR context LIKE ? OR decision_text LIKE ?)
       LIMIT 10`
    )
    .all(like, like, like);

  const roles = db
    .prepare(
      `SELECT u.id, u.role_id, r.title, p.placeholder_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN team_member_profiles p ON p.user_id = u.id
       WHERE r.title LIKE ? OR p.responsibilities_json LIKE ? OR p.placeholder_name LIKE ?
       LIMIT 5`
    )
    .all(like, like, like);

  const meetings = db
    .prepare(
      `SELECT id, title, meeting_type, meeting_date
       FROM meetings
       WHERE title LIKE ? OR agenda LIKE ? OR notes LIKE ?
       LIMIT 10`
    )
    .all(like, like, like);

  return NextResponse.json({
    ok: true,
    results: {
      tasks,
      projects,
      documents,
      decisions,
      roles,
      meetings,
    },
  });
}
