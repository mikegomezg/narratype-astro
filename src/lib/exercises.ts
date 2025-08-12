import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { parseMetadata } from './texts';
import { getGeneratedExercisesRoot } from './paths';

export type ExerciseType = 'touch_typing' | 'words' | 'phrases' | 'full_text';

export interface ExerciseItem {
  id: string; // X.Y.Z
  type: ExerciseType;
  lesson: number;
  sequence: number;
  content: string;
}

export interface GeneratedLesson {
  lesson: number;
  items: ExerciseItem[]; // always 8
}

export interface GenerationRequest {
  sourcePath: string; // absolute path to .txt
  maxLessons?: number;
}

export async function generateLessons(req: GenerationRequest): Promise<GeneratedLesson[]> {
  const raw = await fs.readFile(req.sourcePath, 'utf-8');
  const { content } = parseMetadata(raw);
  const text = normalizeWhitespace(content);

  const maxLessons = req.maxLessons ?? 3;
  const lessons: GeneratedLesson[] = [];

  for (let lesson = 1; lesson <= maxLessons; lesson += 1) {
    const items: ExerciseItem[] = [];
    // 2 touch typing
    for (let i = 1; i <= 2; i += 1) {
      items.push({
        id: `${lesson}.1.${i}`,
        type: 'touch_typing',
        lesson,
        sequence: i,
        content: buildTouchTyping(text, 120, lesson, i)
      });
    }
    // 2 words
    for (let i = 1; i <= 2; i += 1) {
      items.push({
        id: `${lesson}.2.${i}`,
        type: 'words',
        lesson,
        sequence: i,
        content: buildWords(text, 128)
      });
    }
    // 2 phrases
    for (let i = 1; i <= 2; i += 1) {
      items.push({
        id: `${lesson}.3.${i}`,
        type: 'phrases',
        lesson,
        sequence: i,
        content: buildPhrases(text, 256)
      });
    }
    // 2 full text
    for (let i = 1; i <= 2; i += 1) {
      items.push({
        id: `${lesson}.4.${i}`,
        type: 'full_text',
        lesson,
        sequence: i,
        content: sampleContinuous(text, 512, (lesson - 1) * 2 + i)
      });
    }
    lessons.push({ lesson, items });
  }

  // persist to file cache for reuse within session
  const outDir = getGeneratedExercisesRoot();
  const outPath = join(outDir, `${hashString(req.sourcePath)}.json`);
  await fs.writeFile(outPath, JSON.stringify(lessons, null, 2), 'utf-8');
  return lessons;
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function buildTouchTyping(text: string, length: number, lesson: number, seed: number): string {
  // Simple gradient: early lessons emphasize home row characters
  const home = 'asdfjkl;';
  const upper = 'qwertyuiop';
  const lower = 'zxcvbnm';
  const bias = Math.min(1, lesson / 5);
  const pool = repeatChars(home, Math.round(10 * (1 - bias))) + repeatChars(upper + lower, Math.round(6 * bias)) + ' ';

  let out = '';
  let i = 0;
  while (out.length < length) {
    const c = pool.charAt((seed * 131 + i * 17) % pool.length);
    out += c;
    i += 1;
  }
  return out.slice(0, length);
}

function buildWords(text: string, length: number): string {
  const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  const unique = uniqueShuffle(words).slice(0, Math.max(10, Math.min(words.length, 100)));
  let out = '';
  let i = 0;
  while (out.length < length && unique.length > 0) {
    out += (i > 0 ? ' ' : '') + unique[i % unique.length];
    i += 1;
  }
  return out.slice(0, length);
}

function buildPhrases(text: string, length: number): string {
  const fragments = text.split(/[\.\!\?]/).map((s) => s.trim()).filter(Boolean);
  const shuffled = uniqueShuffle(fragments);
  let out = '';
  let i = 0;
  while (out.length < length && shuffled.length > 0) {
    const frag = shuffled[i % shuffled.length];
    out += (out ? ' | ' : '') + takeMiddle(frag, 24 + (i % 16));
    i += 1;
  }
  return out.slice(0, length);
}

function sampleContinuous(text: string, length: number, offset: number): string {
  if (text.length <= length) return text;
  const stride = Math.max(50, Math.floor(text.length / 8));
  const start = Math.min(text.length - length, (offset * stride) % (text.length - length));
  return text.slice(start, start + length);
}

function uniqueShuffle<T>(arr: T[]): T[] {
  const set = Array.from(new Set(arr));
  for (let i = set.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [set[i], set[j]] = [set[j], set[i]];
  }
  return set;
}

function takeMiddle(s: string, n: number): string {
  if (s.length <= n) return s;
  const start = Math.max(0, Math.floor((s.length - n) / 2));
  return s.slice(start, start + n);
}

function repeatChars(chars: string, times: number): string {
  return chars.repeat(Math.max(1, times));
}

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}


