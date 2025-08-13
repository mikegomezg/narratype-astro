import type { APIRoute } from 'astro';
import { scanTexts } from '@/lib/texts';
import { getDb } from '@/db/client';
import { ensureDatabase } from '@/db/init';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  await ensureDatabase();
  const [fsItems, db] = await Promise.all([scanTexts(), getDb()]);

  const favoritesOnly = url.searchParams.get('favorites') === 'true';
  const recentOnly = url.searchParams.get('recent') === 'true';

  const rows = await db.all('SELECT id, filename, last_practiced, times_practiced, COALESCE(is_favorite, 0) AS is_favorite FROM texts');
  const byFilename = new Map<string, { id: number; last_practiced: string | null; times_practiced: number; is_favorite: number }>();
  rows.forEach((r) => byFilename.set(r.filename, { id: r.id, last_practiced: r.last_practiced, times_practiced: r.times_practiced, is_favorite: Number(r.is_favorite) }));

  let items = fsItems.map((it) => ({
    ...it,
    id: byFilename.get(it.filename)?.id ?? null,
    inDatabase: byFilename.has(it.filename),
    lastPracticed: byFilename.get(it.filename)?.last_practiced ?? null,
    timesPracticed: byFilename.get(it.filename)?.times_practiced ?? 0,
    isFavorite: (byFilename.get(it.filename)?.is_favorite ?? 0) === 1
  }));

  if (favoritesOnly) items = items.filter((i) => i.isFavorite);
  if (recentOnly) items = items
    .filter((i) => i.lastPracticed)
    .sort((a, b) => new Date(b.lastPracticed as string).getTime() - new Date(a.lastPracticed as string).getTime());

  return new Response(JSON.stringify({ items }), { headers: { 'Content-Type': 'application/json' } });
};


