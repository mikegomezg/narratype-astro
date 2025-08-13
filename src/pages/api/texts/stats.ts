import type { APIRoute } from 'astro';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const prerender = false;

export const GET: APIRoute = async () => {
  await ensureDatabase();
  const db = await getDb();

  const summary = await db.get(
    `SELECT 
       COUNT(DISTINCT text_id) as unique_texts,
       AVG(wpm) as avg_wpm,
       AVG(accuracy) as avg_accuracy,
       COUNT(*) as total_sessions
     FROM practice_sessions
     WHERE date(started_at) > date('now', '-30 days')`
  );

  const days = await db.all(
    `SELECT DISTINCT date(started_at) AS d FROM practice_sessions WHERE date(started_at) > date('now', '-30 days') ORDER BY d ASC`
  );

  return new Response(
    JSON.stringify({
      unique_texts: summary?.unique_texts ?? 0,
      avg_wpm: Math.round(summary?.avg_wpm ?? 0),
      avg_accuracy: Math.round(summary?.avg_accuracy ?? 0),
      total_sessions: summary?.total_sessions ?? 0,
      days: days.map((r: any) => r.d)
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};


