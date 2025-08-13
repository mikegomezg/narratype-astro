import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix, normalize } from 'node:path';
import { readdirSync, statSync, readFileSync, existsSync, mkdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const srcTextsDir = join(projectRoot, 'texts');
const publicDir = join(projectRoot, 'public');
const publicTextsDir = join(publicDir, 'texts');
const indexPath = join(publicDir, 'texts-index.json');

function walk(dir) {
    const results = [];
    if (!existsSync(dir)) return results;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walk(fullPath));
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.txt')) {
            results.push(fullPath);
        }
    }
    return results;
}

function parseMetadata(raw) {
    const headerPattern = /^#\s*(\w+):\s*(.*)$/i;
    const lines = String(raw || '').split(/\r?\n/);
    const meta = {};
    const content = [];
    let inHeader = true;
    for (const line of lines) {
        if (inHeader) {
            const m = line.match(headerPattern);
            if (m) {
                meta[m[1].toLowerCase()] = m[2].trim();
                continue;
            }
            inHeader = false;
        }
        content.push(line);
    }
    return { meta, content: content.join('\n').trim() };
}

function countWords(text) {
    if (!text) return 0;
    const m = String(text).trim().match(/\b\w+\b/g);
    return m ? m.length : 0;
}

function ensureDir(p) {
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function toDisplayPath(abs) {
    const rel = relative(srcTextsDir, abs);
    // Always POSIX-style for URLs/consistency
    return rel.split('\\').join('/');
}

function buildIndex() {
    const items = [];
    const files = walk(srcTextsDir);
    for (const abs of files) {
        const raw = readFileSync(abs, 'utf-8');
        const { meta, content } = parseMetadata(raw);
        const displayPath = toDisplayPath(abs);
        const url = posix.join('/texts', displayPath);
        items.push({
            // Keep "filename" for compatibility with existing UI; we will allow relative on the API
            filename: displayPath,
            displayPath,
            url,
            title: meta.title || abs.split(/[/\\]/).pop().replace(/_/g, ' ').replace(/\.txt$/i, ''),
            author: meta.author,
            difficulty: meta.difficulty,
            category: meta.category,
            tags: meta.tags ? String(meta.tags).split(',').map((t) => t.trim()).filter(Boolean) : undefined,
            wordCount: countWords(content)
        });
    }
    return { items };
}

function copyTextsToPublic() {
    if (!existsSync(srcTextsDir)) return false;
    ensureDir(publicDir);
    // Clean public/texts to avoid stale files
    rmSync(publicTextsDir, { recursive: true, force: true });
    ensureDir(publicTextsDir);
    cpSync(srcTextsDir, publicTextsDir, { recursive: true });
    return true;
}

function main() {
    const copied = copyTextsToPublic();
    const index = buildIndex();
    ensureDir(publicDir);
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
    // Diagnostics for local runs
    console.log(`SUCCESS: Wrote ${index.items.length} items to public/texts-index.json`);
    if (!copied) {
        console.warn('WARNING: Source texts directory not found; created empty index.');
    } else {
        console.log('SUCCESS: Copied texts/ to public/texts/');
    }
}

main();


