import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcTexts = join(__dirname, '..', 'texts');
const distTexts = join(__dirname, '..', 'dist', 'texts');

if (existsSync(srcTexts)) {
    mkdirSync(distTexts, { recursive: true });
    cpSync(srcTexts, distTexts, { recursive: true });
    console.log('Copied texts folder to dist');
} else {
    console.warn('WARNING: No texts folder found to copy');
}



