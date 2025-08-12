import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { ensureDatabase } from '@/db/init';

export const GET: APIRoute = async () => {
  await ensureDatabase();
  const db = await getDb();
  const rows = await db.all('SELECT * FROM texts ORDER BY title ASC');
  return new Response(JSON.stringify({ texts: rows }), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="texts.json"' }
  });
};


