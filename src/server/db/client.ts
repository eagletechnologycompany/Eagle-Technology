import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { runMigrations } from "./migrations";
import { seedDatabaseIfNeeded } from "./seed";

let dbInstance: DatabaseSync | null = null;
let initializedPath: string | null = null;

export function getDbPath(): string {
  if (process.env.EAGLE_DB_PATH) {
    return process.env.EAGLE_DB_PATH;
  }
  return path.join(process.cwd(), "data", "eagle-ops.db");
}

export function getDb(): DatabaseSync {
  const targetPath = getDbPath();
  if (dbInstance && initializedPath === targetPath) {
    return dbInstance;
  }

  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // ignore close errors on path switch
    }
    dbInstance = null;
  }

  if (targetPath !== ":memory:") {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  }

  const db = new DatabaseSync(targetPath);
  db.exec("PRAGMA foreign_keys = ON;");
  if (targetPath !== ":memory:") {
    db.exec("PRAGMA journal_mode = WAL;");
  }

  runMigrations(db);
  seedDatabaseIfNeeded(db);

  dbInstance = db;
  initializedPath = targetPath;
  return db;
}

export function resetDbConnectionForTests(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // ignore
    }
  }
  dbInstance = null;
  initializedPath = null;
}
