import type { APIRoute } from 'astro';
import { scanTexts } from '@/lib/texts';
import { getDb } from '@/db/client';
import { ensureDatabase } from '@/db/init';

export const GET: APIRoute = async () => {
  await ensureDatabase();
  const [fsItems, db] = await Promise.all([scanTexts(), getDb()]);
  const rows = await db.all('SELECT filename, last_practiced, times_practiced FROM texts');
  const map = new Map<string, { last_practiced: string | null; times_practiced: number }>();
  rows.forEach((r) => map.set(r.filename, { last_practiced: r.last_practiced, times_practiced: r.times_practiced }));

  const items = fsItems.map((it) => ({
    ...it,
    inDatabase: map.has(it.filename),
    lastPracticed: map.get(it.filename)?.last_practiced ?? null,
    timesPracticed: map.get(it.filename)?.times_practiced ?? 0
  }));

  return new Response(JSON.stringify({ items }), { headers: { 'Content-Type': 'application/json' } });
};


