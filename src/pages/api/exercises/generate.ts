import type { APIRoute } from 'astro';
import { generateLessons } from '@/lib/exercises';
import { getTextsRoot } from '@/lib/paths';
import { join } from 'node:path';
import { getDb } from '@/db/client';
import { ensureDatabase } from '@/db/init';
import { readFile } from 'node:fs/promises';
import { parseMetadata, countWords } from '@/lib/texts';

export const POST: APIRoute = async ({ request }) => {
  await ensureDatabase();
  const db = await getDb();
  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  let sourcePath: string | null = null;
  if (body?.sourcePath) sourcePath = body.sourcePath;

  if (!sourcePath && body?.fallback) {
    // Create a minimal sample text if none exists
    const textsRoot = getTextsRoot();
    sourcePath = join(textsRoot, 'technical', 'programming_basics.txt');
    try {
      await readFile(sourcePath, 'utf-8');
    } catch {
      const sample = `# title: Programming Basics\n# author: Narratype\n# difficulty: Easy\n# category: Technical\n\nTyping improves with consistent practice. Keep your wrists relaxed and eyes on the screen. Practice home row first, then expand.`;
      await (await import('node:fs/promises')).mkdir(join(textsRoot, 'technical'), { recursive: true });
      await (await import('node:fs/promises')).writeFile(sourcePath, sample, 'utf-8');
    }
  }

  if (!sourcePath) return new Response(JSON.stringify({ message: 'Missing sourcePath' }), { status: 400 });

  // Ensure DB text row exists
  const raw = await (await import('node:fs/promises')).readFile(sourcePath, 'utf-8');
  const { meta, content } = parseMetadata(raw);
  const wc = countWords(content);

  const result = await db.run(
    `INSERT INTO texts (filename, title, author, category, word_count, difficulty, last_practiced, times_practiced)
     VALUES (?, ?, ?, ?, ?, ?, NULL, 0)
     ON CONFLICT(filename) DO UPDATE SET title = excluded.title, author = excluded.author, category = excluded.category, word_count = excluded.word_count, difficulty = excluded.difficulty`,
    sourcePath,
    meta.title || 'Untitled',
    meta.author || null,
    meta.category || null,
    wc,
    meta.difficulty || null
  );
  const row = await db.get('SELECT id FROM texts WHERE filename = ?', sourcePath);

  const lessons = await generateLessons({ sourcePath, maxLessons: 1 });
  return new Response(JSON.stringify({ textId: row?.id ?? result.lastID ?? null, lessons }), { headers: { 'Content-Type': 'application/json' } });
};


