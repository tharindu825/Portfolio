import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
    console.error("DATABASE_URL not found");
    process.exit(1);
}

async function checkData() {
    const client = new MongoClient(url!);
    try {
        await client.connect();
        const db = client.db();
        const projects = await db.collection("project").find().toArray();
        console.log(`Found ${projects.length} projects.`);
        for (const p of projects) {
            if (p.media && !Array.isArray(p.media)) {
                console.log(`Project "${p.name}" has INVALID media format:`, JSON.stringify(p.media, null, 2));
            } else {
                console.log(`Project "${p.name}" media is an array of length ${p.media ? p.media.length : 0}`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

checkData();
