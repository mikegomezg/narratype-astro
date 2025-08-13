import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = join(__dirname, '..', 'database', 'narratype.db');

async function resetDatabase() {
    console.log('Resetting Narratype Database');
    if (existsSync(databasePath)) {
        console.log('Found database at: ' + databasePath);
        await unlink(databasePath);
        console.log('SUCCESS: Database deleted');
    } else {
        console.log('INFO: No database found at: ' + databasePath);
    }
    console.log('INFO: The database will be recreated on next app start');
}

resetDatabase().catch((err) => {
    console.error('ERROR: ' + String(err));
});


