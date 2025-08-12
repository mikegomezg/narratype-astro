import { promises as fs } from 'node:fs';
import { join, relative } from 'node:path';
import { getTextsRoot } from './paths';

export interface TextMeta {
  filename: string; // absolute path
  displayPath: string; // relative under texts/
  title: string;
  author?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  wordCount: number;
}

const headerPattern = /^#\s*(\w+):\s*(.*)$/i;

export async function scanTexts(): Promise<TextMeta[]> {
  const root = getTextsRoot();
  const files: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.txt')) files.push(full);
    }
  }

  await walk(root);

  const metas: TextMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8');
    const { meta, content } = parseMetadata(raw);
    const wc = countWords(content);
    metas.push({
      filename: file,
      displayPath: relative(root, file).replaceAll('\\', '/'),
      title: meta.title || deriveTitleFromPath(file),
      author: meta.author,
      difficulty: meta.difficulty,
      category: meta.category,
      tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()) : undefined,
      wordCount: wc
    });
  }
  return metas;
}

export function parseMetadata(input: string): { meta: Record<string, string>; content: string } {
  const lines = input.split(/\r?\n/);
  const meta: Record<string, string> = {};
  const contentLines: string[] = [];
  let inHeader = true;

  for (const line of lines) {
    if (inHeader) {
      const match = line.match(headerPattern);
      if (match) {
        const key = match[1].toLowerCase();
        meta[key] = match[2].trim();
        continue;
      }
      // First non-header line switches to content
      inHeader = false;
    }
    contentLines.push(line);
  }

  return { meta, content: contentLines.join('\n').trim() };
}

export function countWords(txt: string): number {
  if (!txt) return 0;
  const m = txt.trim().match(/\b\w+\b/g);
  return m ? m.length : 0;
}

function deriveTitleFromPath(p: string): string {
  const base = p.split(/[\\/]/).pop() || 'Untitled';
  return base.replace(/_/g, ' ').replace(/\.(txt)$/i, '');
}


