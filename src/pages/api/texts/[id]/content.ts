import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { ensureDatabase } from '@/db/init';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    await ensureDatabase();
    const id = params.id ?? '';
    const path = Buffer.from(id, 'base64').toString('utf-8');
    const content = await readFile(path, 'utf-8');
    return new Response(JSON.stringify({ content }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to read text', error: String(err) }), { status: 500 });
  }
};


