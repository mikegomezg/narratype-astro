import type { APIRoute } from 'astro';
import { getTextsRoot } from '@/lib/paths';
import { ensureDatabase } from '@/db/init';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureDatabase();
    const contentType = request.headers.get('content-type') || '';
    let content = '';
    let filename = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      content = String(body?.content || '').trim();
      filename = String(body?.filename || '').trim();
    } else if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const buf = Buffer.from(await file.arrayBuffer());
        content = buf.toString('utf-8');
        filename = (file as File).name;
      }
    }

    if (!content) return new Response(JSON.stringify({ message: 'No content provided' }), { status: 400 });

    const root = getTextsRoot();
    const safeName = (filename || `import_${randomUUID().slice(0, 8)}.txt`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = join(root, 'custom', safeName);
    await writeFile(outPath, content, 'utf-8');

    return new Response(JSON.stringify({ message: `Saved to texts/custom/${safeName}` }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to import', error: String(err) }), { status: 500 });
  }
};


