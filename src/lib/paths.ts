import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';
const projectRoot = isDev ? join(__dirname, '../../..') : join(__dirname, '../..');

export function getProjectRoot(): string {
  return projectRoot;
}

export function getTextsRoot(): string {
  const candidates = [
    join(projectRoot, 'texts'),
    join(projectRoot, 'public', 'texts'),
    join(process.cwd(), 'texts'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  const fallback = candidates[0];
  if (!existsSync(fallback)) mkdirSync(fallback, { recursive: true });
  return fallback;
}

export function getGeneratedExercisesRoot(): string {
  const p = join(projectRoot, 'exercises', 'generated');
  if (!existsSync(p)) {
    mkdirSync(p, { recursive: true });
  }
  return p;
}

export function getDatabaseDir(): string {
  const p = join(projectRoot, 'database');
  if (!existsSync(p)) {
    mkdirSync(p, { recursive: true });
  }
  return p;
}


