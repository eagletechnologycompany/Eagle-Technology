import type { DatabaseSync } from "node:sqlite";

interface Migration {
  version: number;
  name: string;
  sql: string;
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "initial_founder_operations_schema",
    sql: `
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        short_title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        role_id TEXT NOT NULL REFERENCES roles(id),
        display_label TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS team_member_profiles (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        role_id TEXT NOT NULL REFERENCES roles(id),
        placeholder_name TEXT NOT NULL,
        responsibilities_json TEXT NOT NULL,
        capacity_note TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        token_hash TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL,
        revoked_at TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        objective TEXT NOT NULL,
        problem_or_opportunity TEXT NOT NULL,
        description TEXT NOT NULL,
        lead_user_id TEXT NOT NULL REFERENCES users(id),
        status TEXT NOT NULL,
        phase TEXT NOT NULL,
        start_date TEXT,
        target_date TEXT,
        deliverables_json TEXT NOT NULL DEFAULT '[]',
        dependencies_json TEXT NOT NULL DEFAULT '[]',
        notes TEXT NOT NULL DEFAULT '',
        completion_review TEXT NOT NULL DEFAULT '',
        is_demo INTEGER NOT NULL DEFAULT 0,
        archived_at TEXT,
        created_by TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project_members (
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_role TEXT NOT NULL DEFAULT 'Contributor',
        added_at TEXT NOT NULL,
        PRIMARY KEY (project_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        due_date TEXT,
        status TEXT NOT NULL DEFAULT 'Planned',
        completed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project_risks (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'Medium',
        mitigation TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'Open',
        owner_user_id TEXT REFERENCES users(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
        task_type TEXT NOT NULL,
        owner_user_id TEXT REFERENCES users(id),
        collaborators_json TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'Backlog',
        priority TEXT NOT NULL DEFAULT 'Normal',
        due_date TEXT,
        start_date TEXT,
        estimated_effort TEXT NOT NULL DEFAULT '',
        labels_json TEXT NOT NULL DEFAULT '[]',
        dependencies_json TEXT NOT NULL DEFAULT '[]',
        blocker_reason TEXT NOT NULL DEFAULT '',
        completion_notes TEXT NOT NULL DEFAULT '',
        is_demo INTEGER NOT NULL DEFAULT 0,
        archived_at TEXT,
        created_by TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS task_comments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        author_user_id TEXT NOT NULL REFERENCES users(id),
        body TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS task_attachments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        storage_key TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        uploaded_by TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS weekly_check_ins (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        week_start TEXT NOT NULL,
        completed_last_week TEXT NOT NULL,
        planned_this_week TEXT NOT NULL,
        current_blocker TEXT NOT NULL DEFAULT '',
        support_needed TEXT NOT NULL DEFAULT '',
        important_update TEXT NOT NULL DEFAULT '',
        confidence_level TEXT NOT NULL DEFAULT 'Steady',
        is_demo INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        owner_user_id TEXT REFERENCES users(id),
        time_period TEXT NOT NULL DEFAULT 'Initial 90-Day Foundation',
        status TEXT NOT NULL DEFAULT 'Not started',
        progress INTEGER NOT NULL DEFAULT 0,
        key_results_json TEXT NOT NULL DEFAULT '[]',
        related_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
        notes TEXT NOT NULL DEFAULT '',
        review_date TEXT,
        is_demo INTEGER NOT NULL DEFAULT 0,
        archived_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        context TEXT NOT NULL,
        decision_text TEXT NOT NULL,
        options_considered TEXT NOT NULL DEFAULT '',
        owner_user_id TEXT NOT NULL REFERENCES users(id),
        contributors_json TEXT NOT NULL DEFAULT '[]',
        decision_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Proposed',
        related_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
        supporting_documents_json TEXT NOT NULL DEFAULT '[]',
        review_date TEXT,
        approved_by TEXT REFERENCES users(id),
        is_demo INTEGER NOT NULL DEFAULT 0,
        archived_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        meeting_type TEXT NOT NULL,
        meeting_date TEXT NOT NULL,
        participants_json TEXT NOT NULL DEFAULT '[]',
        agenda TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        decisions_summary TEXT NOT NULL DEFAULT '',
        action_items_json TEXT NOT NULL DEFAULT '[]',
        follow_up_date TEXT,
        created_by TEXT NOT NULL REFERENCES users(id),
        is_demo INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        storage_key TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        owner_user_id TEXT NOT NULL REFERENCES users(id),
        uploaded_by TEXT NOT NULL REFERENCES users(id),
        version TEXT NOT NULL DEFAULT 'v1.0',
        related_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
        access_level TEXT NOT NULL DEFAULT 'all_founders',
        allowed_roles_json TEXT NOT NULL DEFAULT '[]',
        is_demo INTEGER NOT NULL DEFAULT 0,
        archived_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        recipient_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link_href TEXT NOT NULL DEFAULT '/dashboard',
        read_at TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        summary TEXT NOT NULL,
        metadata_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        actor_role TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        status TEXT NOT NULL,
        details_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS workspace_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_owner ON tasks(owner_user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(recipient_user_id, read_at);
      CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
    `,
  },
  {
    version: 2,
    name: "client_portal_and_developer_platform",
    sql: `
      CREATE TABLE IF NOT EXISTS client_deliverables (
        id TEXT PRIMARY KEY,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        summary TEXT NOT NULL,
        status TEXT NOT NULL, -- pending_review, approved, revision_requested, in_progress, scheduled
        review_notes TEXT NOT NULL DEFAULT '',
        asset_url TEXT,
        submitted_by TEXT REFERENCES users(id),
        reviewed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS client_requests (
        id TEXT PRIMARY KEY,
        client_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_id TEXT REFERENCES projects(id),
        title TEXT NOT NULL,
        type TEXT NOT NULL, -- feature, change_request, bug, consultation, general
        priority TEXT NOT NULL, -- low, medium, high, urgent
        details TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'received', -- received, under_review, scheduled, in_progress, completed, declined
        founder_response TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS developer_sandbox_keys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key_prefix TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        label TEXT NOT NULL,
        environment TEXT NOT NULL DEFAULT 'sandbox',
        revoked_at TEXT,
        last_used_at TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_client_deliv_proj ON client_deliverables(project_id);
      CREATE INDEX IF NOT EXISTS idx_client_req_user ON client_requests(client_user_id);
      CREATE INDEX IF NOT EXISTS idx_dev_keys_user ON developer_sandbox_keys(user_id);
    `,
  },
];

export function runMigrations(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedStmt = db.prepare("SELECT version FROM schema_migrations");
  const applied = new Set(
    (appliedStmt.all() as Array<{ version: number }>).map((r) => r.version)
  );

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.version)) continue;

    db.exec("BEGIN;");
    try {
      db.exec(migration.sql);
      db.prepare(
        "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)"
      ).run(migration.version, migration.name, new Date().toISOString());
      db.exec("COMMIT;");
    } catch (err) {
      db.exec("ROLLBACK;");
      throw err;
    }
  }
}
