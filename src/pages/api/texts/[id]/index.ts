import type { APIRoute } from 'astro';
import { unlink } from 'node:fs/promises';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id ?? '';
  const path = Buffer.from(id, 'base64').toString('utf-8');
  try {
    await ensureDatabase();
    await unlink(path);
  } catch {}

  const db = await getDb();
  await db.run('DELETE FROM texts WHERE filename = ?', path);
  return new Response(JSON.stringify({ message: 'Deleted' }), { headers: { 'Content-Type': 'application/json' } });
};


