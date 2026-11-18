import type { DatabaseSync } from "node:sqlite";
import {
  INITIAL_COMPANY_FOCUS_AREAS,
  PERMISSIONS,
  ROLE_DEFINITIONS,
  ROLE_LIST,
} from "@/lib/dashboard-constants";
import { hashPassword } from "@/server/auth/crypto";

function getBootstrapPassword(roleId: string): string {
  if (roleId === "client") {
    return process.env.EAGLE_BOOTSTRAP_CLIENT_PASSWORD || "EagleClient!2026";
  }
  const perRoleEnv = process.env[`EAGLE_BOOTSTRAP_${roleId.toUpperCase()}_PASSWORD`];
  if (perRoleEnv && perRoleEnv.length >= 8) return perRoleEnv;
  if (
    process.env.EAGLE_FOUNDER_BOOTSTRAP_PASSWORD &&
    process.env.EAGLE_FOUNDER_BOOTSTRAP_PASSWORD.length >= 8
  ) {
    return process.env.EAGLE_FOUNDER_BOOTSTRAP_PASSWORD;
  }
  return "EagleFounders!2026";
}

export function seedDatabaseIfNeeded(db: DatabaseSync): void {
  const existingUsers = db
    .prepare("SELECT COUNT(*) as count FROM users")
    .get() as { count: number };

  const now = new Date().toISOString();

  if (existingUsers.count === 0) {
    db.exec("BEGIN;");
    try {
      const insertPerm = db.prepare(
        "INSERT OR IGNORE INTO permissions (id, description) VALUES (?, ?)"
      );
      for (const perm of PERMISSIONS) {
        insertPerm.run(perm, `Permission to ${perm.replace(".", " ")}`);
      }

      const insertRole = db.prepare(
        "INSERT OR IGNORE INTO roles (id, title, short_title, description, created_at) VALUES (?, ?, ?, ?, ?)"
      );
      const insertRolePerm = db.prepare(
        "INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)"
      );
      const insertUser = db.prepare(
        "INSERT INTO users (id, username, role_id, display_label, password_hash, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)"
      );
      const insertProfile = db.prepare(
        "INSERT INTO team_member_profiles (user_id, role_id, placeholder_name, responsibilities_json, capacity_note, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      );

      for (const role of ROLE_LIST) {
        insertRole.run(
          role.id,
          role.title,
          role.shortTitle,
          `Official Eagle Technology founding role: ${role.title}`,
          now
        );
        for (const perm of role.permissions) {
          insertRolePerm.run(role.id, perm);
        }

        const userId = `usr_${role.id}`;
        insertUser.run(
          userId,
          role.username,
          role.id,
          role.title,
          hashPassword(getBootstrapPassword(role.id)),
          now,
          now
        );
        insertProfile.run(
          userId,
          role.id,
          role.placeholderLabel,
          JSON.stringify(role.responsibilities),
          "Role-based profile — replace placeholder name once confirmed.",
          now
        );
      }

      // Seed workspace settings
      db.prepare(
        "INSERT OR IGNORE INTO workspace_settings (key, value, updated_at) VALUES (?, ?, ?)"
      ).run("workspace_name", "Eagle Technology — Founders Workspace", now);
      db.prepare(
        "INSERT OR IGNORE INTO workspace_settings (key, value, updated_at) VALUES (?, ?, ?)"
      ).run("company_stage", "Initial 90-Day Foundation", now);

      // Seed the 10 initial blueprint focus areas (0% progress, honest Not started state)
      const insertGoal = db.prepare(
        "INSERT INTO goals (id, title, description, owner_user_id, time_period, status, progress, key_results_json, notes, is_demo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)"
      );
      INITIAL_COMPANY_FOCUS_AREAS.forEach((focusArea, idx) => {
        insertGoal.run(
          `goal_foundation_${idx + 1}`,
          focusArea,
          "Initial company focus area from the Eagle Technology Company Blueprint. Add concrete targets and key results as the team confirms scope.",
          "usr_ceo",
          "Initial 90-Day Roadmap",
          "Not started",
          0,
          JSON.stringify([]),
          "No invented targets — awaiting team baseline confirmation.",
          now,
          now
        );
      });

      // Seed clearly labeled [DEMO] starter project & tasks so workspace views are inspectable
      const today = now.slice(0, 10);
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      const inThreeDays = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

      db.prepare(
        `INSERT INTO projects (
          id, name, objective, problem_or_opportunity, description, lead_user_id,
          status, phase, start_date, target_date, deliverables_json, dependencies_json,
          notes, is_demo, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
      ).run(
        "proj_demo_foundation",
        "[Demo] Official Website & Brand Foundation",
        "Demonstrate Eagle's 8-phase project structure from Identify through Evaluate.",
        "Pre-launch workspace demonstration aligned with Month 2 of the blueprint roadmap.",
        "Clearly marked demo project illustrating project tabs, milestones, tasks, risks, and decision tracking. Archive or clear in Settings when adding live company projects.",
        "usr_ceo",
        "Active",
        "Execute",
        today,
        nextWeek,
        JSON.stringify([
          "Approved brand asset kit",
          "Verified public website routes",
          "Founding team role confirmation",
        ]),
        JSON.stringify(["Final founder review of service scope"]),
        "DEMO RECORD: Safe to archive or clear from Settings -> Demo Data.",
        "usr_ceo",
        now,
        now
      );

      const addMember = db.prepare(
        "INSERT OR IGNORE INTO project_members (project_id, user_id, project_role, added_at) VALUES (?, ?, ?, ?)"
      );
      for (const role of ROLE_LIST) {
        addMember.run("proj_demo_foundation", `usr_${role.id}`, role.shortTitle, now);
      }

      db.prepare(
        "INSERT INTO milestones (id, project_id, title, description, due_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(
        "ms_demo_1",
        "proj_demo_foundation",
        "[Demo] Founders Content & Identity Sign-off",
        "Confirm founder names, official domain email, and approved service scope.",
        nextWeek,
        "In Progress",
        now,
        now
      );

      db.prepare(
        "INSERT INTO project_risks (id, project_id, title, severity, mitigation, status, owner_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(
        "risk_demo_1",
        "proj_demo_foundation",
        "[Demo] Official domain & email accounts pending provisioning",
        "Medium",
        "Keep public contact details clearly labeled as placeholders until official domain is registered.",
        "Open",
        "usr_ceo",
        now,
        now
      );

      const insertTask = db.prepare(
        `INSERT INTO tasks (
          id, title, description, project_id, task_type, owner_user_id,
          collaborators_json, status, priority, due_date, start_date,
          estimated_effort, labels_json, is_demo, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
      );

      insertTask.run(
        "task_demo_1",
        "[Demo] Confirm official founding member names and portraits",
        "Collect approved public names and portraits for the five founding roles before public launch.",
        "proj_demo_foundation",
        "Administration",
        "usr_ceo",
        JSON.stringify(["usr_design"]),
        "Ready",
        "High",
        inThreeDays,
        today,
        "2h",
        JSON.stringify(["demo", "foundation"]),
        "usr_ceo",
        now,
        now
      );

      insertTask.run(
        "task_demo_2",
        "[Demo] Review responsive public website accessibility",
        "Verify keyboard focus states, contrast ratios, and mobile drawer behavior across viewports.",
        "proj_demo_foundation",
        "Development",
        "usr_frontend",
        JSON.stringify(["usr_design"]),
        "In Progress",
        "Normal",
        nextWeek,
        today,
        "4h",
        JSON.stringify(["demo", "frontend"]),
        "usr_ceo",
        now,
        now
      );

      insertTask.run(
        "task_demo_3",
        "[Demo] Configure SMTP credentials for contact & notification delivery",
        "Prepare production environment variables once the official company email domain is active.",
        "proj_demo_foundation",
        "Development",
        "usr_backend",
        JSON.stringify(["usr_ceo"]),
        "Blocked",
        "High",
        nextWeek,
        today,
        "3h",
        JSON.stringify(["demo", "backend", "security"]),
        "usr_ceo",
        now,
        now
      );

      db.prepare("UPDATE tasks SET blocker_reason = ? WHERE id = ?").run(
        "Waiting for official domain and email provider selection.",
        "task_demo_3"
      );

      db.prepare(
        `INSERT INTO decisions (
          id, title, context, decision_text, options_considered, owner_user_id,
          contributors_json, decision_date, status, related_project_id,
          review_date, is_demo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
      ).run(
        "dec_demo_1",
        "[Demo] Use role-based placeholders until official team profiles are confirmed",
        "Per the Company Blueprint, we must never publish unverified names, clients, or metrics.",
        "Use explicit role-based labels and placeholder indicators across both public and internal interfaces until approved by founders.",
        "Option A: Wait to build UI; Option B: Build with explicit transparent placeholders.",
        "usr_ceo",
        JSON.stringify(["usr_frontend", "usr_backend", "usr_design", "usr_ai_automation"]),
        today,
        "Proposed",
        "proj_demo_foundation",
        nextWeek,
        now,
        now
      );

      db.prepare(
        `INSERT INTO meetings (
          id, title, meeting_type, meeting_date, participants_json, agenda,
          notes, decisions_summary, action_items_json, follow_up_date,
          created_by, is_demo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
      ).run(
        "mtg_demo_1",
        "[Demo] Weekly Founding Team Sync Template",
        "Weekly team meeting",
        today,
        JSON.stringify(ROLE_LIST.map((r) => `usr_${r.id}`)),
        "1. Completed last week\n2. Plan for this week\n3. Blockers & dependencies\n4. Priority decisions",
        "Demo meeting template aligned with Part 5 Section 22 of the Eagle Technology blueprint.",
        "Keep meetings focused, short, and action-oriented.",
        JSON.stringify([
          { text: "Each founder submits weekly check-in before sync", ownerRole: "All founders", done: false },
        ]),
        nextWeek,
        "usr_ceo",
        now,
        now
      );

      db.prepare(
        "INSERT INTO activity_logs (id, actor_user_id, entity_type, entity_id, action, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(
        "act_seed_1",
        "usr_ceo",
        "workspace",
        "eagle_ops",
        "initialized",
        "Initialized Eagle Technology Founder Operations workspace with 5 approved roles and 10 foundation goals.",
        now
      );

      db.exec("COMMIT;");
    } catch (err) {
      db.exec("ROLLBACK;");
      throw err;
    }
  }

  // Ensure client permissions, role, demo customer account, and developer foundation exist
  seedClientPortalIfNeeded(db, now);
}

function seedClientPortalIfNeeded(db: DatabaseSync, now: string): void {
  // 1. Ensure any new permissions from PERMISSIONS exist
  const insertPerm = db.prepare(
    "INSERT OR IGNORE INTO permissions (id, description) VALUES (?, ?)"
  );
  for (const perm of PERMISSIONS) {
    insertPerm.run(perm, `Permission to ${perm.replace(".", " ")}`);
  }

  // 2. Ensure client role exists in roles table
  const clientRole = ROLE_DEFINITIONS.client;
  db.prepare(
    "INSERT OR IGNORE INTO roles (id, title, short_title, description, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(
    clientRole.id,
    clientRole.title,
    clientRole.shortTitle,
    "Registered customer and project participant platform role",
    now
  );

  for (const perm of clientRole.permissions) {
    db.prepare(
      "INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)"
    ).run(clientRole.id, perm);
  }

  // 3. Ensure usr_client exists
  const existingClient = db
    .prepare("SELECT id FROM users WHERE id = 'usr_client'")
    .get();

  if (!existingClient) {
    db.prepare(
      "INSERT INTO users (id, username, role_id, display_label, password_hash, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)"
    ).run(
      "usr_client",
      clientRole.username,
      clientRole.id,
      clientRole.title,
      hashPassword(getBootstrapPassword("client")),
      now,
      now
    );

    db.prepare(
      "INSERT OR IGNORE INTO team_member_profiles (user_id, role_id, placeholder_name, responsibilities_json, capacity_note, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
      "usr_client",
      clientRole.id,
      clientRole.placeholderLabel,
      JSON.stringify(clientRole.responsibilities),
      "Registered customer participant for active sprint delivery.",
      now
    );

    // Seed starter client deliverables
    const demoProject = db
      .prepare("SELECT id FROM projects WHERE is_demo = 1 LIMIT 1")
      .get() as { id: string } | undefined;
    const projId = demoProject?.id ?? "proj_demo_1";

    db.prepare(
      `INSERT OR IGNORE INTO client_deliverables (id, project_id, title, category, summary, status, review_notes, asset_url, submitted_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "deliv_1",
      projId,
      "Design System & Interactive Prototype Specification",
      "UI/UX Design",
      "Component tokens, responsive layouts, color accessibility audit, and desktop/mobile user journeys ready for client validation.",
      "pending_review",
      "Ready for client review. Please verify the navigation taxonomy and brand color token alignment.",
      "/brand/eagle-logo.svg",
      "usr_design",
      now,
      now
    );

    db.prepare(
      `INSERT OR IGNORE INTO client_deliverables (id, project_id, title, category, summary, status, review_notes, asset_url, submitted_by, reviewed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "deliv_2",
      projId,
      "System Architecture & API Specification (OpenAPI 3.1)",
      "Technical Architecture",
      "Comprehensive endpoint contract, HMAC session authentication flow, and database schema documentation.",
      "approved",
      "Approved by client lead during Architecture Review Sprint 1.",
      "/docs/OPERATIONS_SECURITY.md",
      "usr_backend",
      now,
      now,
      now
    );

    db.prepare(
      `INSERT OR IGNORE INTO client_deliverables (id, project_id, title, category, summary, status, review_notes, asset_url, submitted_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "deliv_3",
      projId,
      "Database Schema & WAL Migration Pipeline",
      "Backend & Data",
      "19 relational tables with foreign-key constraints, append-only security audit log, and document storage abstraction.",
      "in_progress",
      "Under active development in Sprint 2.",
      null,
      "usr_backend",
      now,
      now
    );

    // Seed starter client request
    db.prepare(
      `INSERT OR IGNORE INTO client_requests (id, client_user_id, project_id, title, type, priority, details, status, founder_response, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "req_1",
      "usr_client",
      projId,
      "Request for Webhook Event on Deliverable Status Change",
      "feature",
      "medium",
      "We would like our internal team to receive an automated webhook payload whenever a deliverable moves to 'pending_review' or 'approved'.",
      "under_review",
      "Approved in principle. AI & Automation specialist will wire into Developer Sandbox in Sprint 3.",
      now,
      now
    );

    // Seed starter developer sandbox key
    db.prepare(
      `INSERT OR IGNORE INTO developer_sandbox_keys (id, user_id, key_prefix, key_hash, label, environment, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      "key_sandbox_1",
      "usr_client",
      "eag_test_9f2a",
      "hash_mock_eag_test_9f2a71b80c",
      "Alpha Integration Sandbox Key",
      "sandbox",
      now
    );
  }
}
