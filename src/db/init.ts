import { getDb } from './client';
// Vite will inline this string at build time
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schemaSqlRaw from './schema.sql?raw';


export async function ensureDatabase(): Promise<void> {
  const db = await getDb();
  const schema = String(schemaSqlRaw || '').trim();
  if (schema) {
    await db.exec(schema);
  }

  // Lightweight migrations for incremental schema changes
  // 1) Ensure texts.is_favorite exists
  try {
    const cols = await db.all<{ name: string }>("PRAGMA table_info(texts)");
    const hasFavorite = cols.some((c) => c.name === 'is_favorite');
    if (!hasFavorite) {
      await db.exec('ALTER TABLE texts ADD COLUMN is_favorite BOOLEAN DEFAULT 0');
    }
  } catch {
    // ignore
  }
}


