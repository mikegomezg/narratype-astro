import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from './client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function ensureDatabase(): Promise<void> {
  const db = await getDb();
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = await readFile(schemaPath, 'utf-8');
  await db.exec(schema);
}


