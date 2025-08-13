import type { APIRoute } from 'astro';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const POST: APIRoute = async ({ params }) => {
  await ensureDatabase();
  const db = await getDb();
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) return new Response(JSON.stringify({ message: 'Invalid id' }), { status: 400 });

  await db.run('UPDATE texts SET is_favorite = CASE WHEN COALESCE(is_favorite, 0) = 1 THEN 0 ELSE 1 END WHERE id = ?', id);
  const row = await db.get('SELECT is_favorite FROM texts WHERE id = ?', id);
  return new Response(JSON.stringify({ success: true, is_favorite: Number(row?.is_favorite ?? 0) === 1 }), { headers: { 'Content-Type': 'application/json' } });
};


