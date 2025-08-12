import type { APIRoute } from 'astro';
import { ensureDatabase } from '@/db/init';
import { getDb } from '@/db/client';

export const GET: APIRoute = async ({ request }) => {
  await ensureDatabase();
  const url = new URL(request.url);
  const textId = url.searchParams.get('text_id');
  const db = await getDb();
  const rows = textId ? await db.all('SELECT * FROM practice_sessions WHERE text_id = ? ORDER BY started_at DESC', textId) : await db.all('SELECT * FROM practice_sessions ORDER BY started_at DESC');
  return new Response(JSON.stringify({ items: rows }), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  await ensureDatabase();
  const body = await request.json();
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO practice_sessions (text_id, started_at, ended_at, exercise_type, lesson_number, exercise_number, wpm, accuracy, characters_typed, errors, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    body.text_id,
    body.started_at,
    body.ended_at,
    body.exercise_type ?? null,
    body.lesson_number ?? null,
    body.exercise_number ?? null,
    body.wpm ?? null,
    body.accuracy ?? null,
    body.characters_typed ?? null,
    body.errors ?? null,
    body.completed ? 1 : 0
  );
  await db.run('UPDATE texts SET last_practiced = ?, times_practiced = times_practiced + 1 WHERE id = ?', body.ended_at ?? body.started_at, body.text_id);
  return new Response(JSON.stringify({ id: result.lastID }), { headers: { 'Content-Type': 'application/json' } });
};


