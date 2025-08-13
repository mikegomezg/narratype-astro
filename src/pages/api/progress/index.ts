import type { APIRoute } from 'astro';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const prerender = false;

export const GET: APIRoute = async () => {
  await ensureDatabase();
  const db = await getDb();
  const rows = await db.all(`
    SELECT date(started_at) as date,
      COUNT(*) as sessions,
      AVG(COALESCE(wpm, 0)) as avg_wpm,
      AVG(COALESCE(accuracy, 100)) as avg_accuracy,
      SUM(COALESCE((julianday(COALESCE(ended_at, started_at)) - julianday(started_at)) * 24 * 60, 0)) as minutes
    FROM practice_sessions
    GROUP BY date
    ORDER BY date ASC
  `);

  const summary = {
    dates: rows.map((r) => r.date),
    averageWpm: rows.map((r) => Math.round(r.avg_wpm ?? 0)),
    averageAccuracy: rows.map((r) => Math.round(r.avg_accuracy ?? 0)),
    minutes: rows.map((r) => Math.round(r.minutes ?? 0))
  };

  return new Response(JSON.stringify({ summary }), { headers: { 'Content-Type': 'application/json' } });
};


