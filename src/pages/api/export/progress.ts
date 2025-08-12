import type { APIRoute } from 'astro';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const GET: APIRoute = async () => {
  await ensureDatabase();
  const db = await getDb();
  const rows = await db.all('SELECT * FROM practice_sessions ORDER BY started_at ASC');
  return new Response(JSON.stringify({ sessions: rows }), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="progress.json"' }
  });
};


