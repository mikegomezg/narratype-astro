import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '../../..');
const databaseDir = join(projectRoot, 'database');
const databasePath = join(databaseDir, 'narratype.db');

if (!existsSync(databaseDir)) {
  mkdirSync(databaseDir, { recursive: true });
}

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!dbPromise) {
    dbPromise = open({ filename: databasePath, driver: sqlite3.Database });
  }
  const db = await dbPromise;
  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}


