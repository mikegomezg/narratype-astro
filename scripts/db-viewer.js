import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = join(__dirname, '..', 'database', 'narratype.db');

async function viewDatabase() {
    if (!existsSync(databasePath)) {
        console.log('WARNING: Database not found at: ' + databasePath);
        console.log('INFO: Start the app (npm run dev) to create it.');
        return;
    }

    const db = await open({ filename: databasePath, driver: sqlite3.Database });

    console.log('Narratype Database Viewer');
    console.log('Database: ' + databasePath);
    console.log('============================================================');

    console.log('\nTEXTS TABLE:');
    const texts = await db.all('SELECT * FROM texts ORDER BY COALESCE(last_practiced, created_at) DESC LIMIT 25');
    if (texts.length === 0) {
        console.log('  (empty)');
    } else {
        for (const t of texts) {
            console.log(`  ID: ${t.id} | ${t.title}`);
            console.log(`      Author: ${t.author || 'Unknown'}`);
            console.log(`      File: ${t.filename}`);
            console.log(`      Favorite: ${Number(t.is_favorite ?? 0) === 1 ? 'Yes' : 'No'}`);
            console.log(`      Practiced: ${t.times_practiced}x | Last: ${t.last_practiced || 'Never'}`);
            console.log(`      Words: ${t.word_count} | Difficulty: ${t.difficulty || 'Unrated'}`);
        }
    }

    console.log('\nRECENT PRACTICE SESSIONS:');
    const sessions = await db.all(
        'SELECT s.*, t.title FROM practice_sessions s LEFT JOIN texts t ON s.text_id = t.id ORDER BY s.started_at DESC LIMIT 10'
    );
    if (sessions.length === 0) {
        console.log('  (empty)');
    } else {
        for (const s of sessions) {
            console.log(`  Session ${s.id}: ${s.title || 'Unknown Text'}`);
            console.log(`      Started: ${s.started_at}`);
            console.log(`      WPM: ${s.wpm ?? 'N/A'} | Accuracy: ${s.accuracy ?? 'N/A'}%`);
            console.log(`      Completed: ${Number(s.completed) === 1 ? 'Yes' : 'No'}`);
        }
    }

    console.log('\nPROGRESS SUMMARY:');
    const stats = await db.get(
        'SELECT COUNT(DISTINCT text_id) as texts_practiced, COUNT(*) as total_sessions, AVG(wpm) as avg_wpm, AVG(accuracy) as avg_accuracy, MAX(date(started_at)) as last_practice FROM practice_sessions'
    );
    console.log(`  Texts Practiced: ${stats?.texts_practiced ?? 0}`);
    console.log(`  Total Sessions: ${stats?.total_sessions ?? 0}`);
    console.log(`  Average WPM: ${stats?.avg_wpm ?? 'N/A'}`);
    console.log(`  Average Accuracy: ${stats?.avg_accuracy ?? 'N/A'}%`);
    console.log(`  Last Practice: ${stats?.last_practice ?? 'Never'}`);

    await db.close();
}

viewDatabase().catch((err) => {
    console.error('ERROR: ' + String(err));
});


