import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function clearMedia() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Success! Truncating project_media table to clear quota-hogging Base64 data...');
        await client.query('TRUNCATE TABLE "project_media" CASCADE;');
        console.log('Table cleared. Your server should now be able to start.');
    } catch (err) {
        console.error('Failed to clear table:', err);
    } finally {
        await client.end();
    }
}

clearMedia();
