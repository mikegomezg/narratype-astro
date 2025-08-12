import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '../../..');

export function getProjectRoot(): string {
  return projectRoot;
}

export function getTextsRoot(): string {
  const p = join(projectRoot, 'texts');
  if (!existsSync(p)) {
    mkdirSync(p, { recursive: true });
  }
  return p;
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


