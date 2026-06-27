import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
    console.error("DATABASE_URL not found");
    process.exit(1);
}

async function fixData() {
    const client = new MongoClient(url!);
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("project");
        const projects = await collection.find().toArray();
        console.log(`Checking ${projects.length} projects for data corruption...`);

        for (const p of projects) {
            let needsUpdate = false;
            let fixedMedia: any[] = [];

            if (p.media && !Array.isArray(p.media)) {
                console.log(`Fixing project: "${p.name}" (ID: ${p._id})`);
                const raw = p.media;
                // If it's the { url: [], type: [] } format
                if (Array.isArray(raw.url) && Array.isArray(raw.type)) {
                    console.log(`Detected "object-of-arrays" format with ${raw.url.length} items.`);
                    for (let i = 0; i < raw.url.length; i++) {
                        fixedMedia.push({
                            url: raw.url[i],
                            type: raw.type[i] || "IMAGE"
                        });
                    }
                    needsUpdate = true;
                } else {
                    // Fallback: just make it an empty array if we don't know the format
                    console.log(`Unknown invalid format for media, defaulting to empty array.`);
                    fixedMedia = [];
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await collection.updateOne(
                    { _id: p._id },
                    { $set: { media: fixedMedia } }
                );
                console.log(`Successfully updated project "${p.name}".`);
            }
        }
        console.log("Migration complete.");
    } catch (e) {
        console.error("Error during migration:", e);
    } finally {
        await client.close();
    }
}

fixData();
