/**
 * ============================================================
 *  MongoDB Atlas — Full Database Backup Script
 * ============================================================
 *  Usage:
 *    npx ts-node backup.ts
 *
 *  Output:
 *    backups/backup_<YYYY-MM-DD_HH-MM-SS>.json
 *
 *  What it backs up:
 *    - users, projects, configs, project_media,
 *      experiences, abouts, educations,
 *      certifications, achievements, skill_sections
 * ============================================================
 */

import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

// ── Collections to back up (must match TypeORM entity table names) ──────────
const COLLECTIONS = [
  "user",
  "project",
  "config",
  "project_media",
  "experience",
  "about",
  "education",
  "certification",
  "achievement",
  "skill_section",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function timestamp(): string {
  const now = new Date();
  return now
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .replace(/\.\d+Z$/, "");
}

function ensureBackupDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁  Created backup directory: ${dir}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Build a safe connection URL using MONGODB_URI + credentials
  // DATABASE_URL may contain unencoded @ in the password which breaks URL parsing
  let mongoUrl: string;
  const mongoUri = process.env.MONGODB_URI?.replace(/"/g, "");
  const mongoUser = process.env.MONGODB_USER?.replace(/"/g, "");
  const mongoPass = process.env.MONGODB_PASS?.replace(/"/g, "");

  if (mongoUri && mongoUser && mongoPass) {
    // Build the full URL: mongodb+srv://user:pass@host/db?options
    mongoUrl = mongoUri.replace(
      "mongodb+srv://",
      `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPass)}@`
    );
  } else {
    // Fallback to DATABASE_URL
    mongoUrl = process.env.DATABASE_URL || "";
    if (!mongoUrl.startsWith("mongodb")) {
      console.error("❌  No valid MongoDB connection info found in .env");
      console.error("    Set MONGODB_URI, MONGODB_USER, MONGODB_PASS  or  DATABASE_URL");
      process.exit(1);
    }
  }

  // Extract database name from connection string
  const dbNameMatch = mongoUrl.match(/\/([^/?]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : "Portfolio";

  console.log("🔗  Connecting to MongoDB Atlas...");
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`✅  Connected to database: "${dbName}"`);

    const backup: Record<string, any> = {
      meta: {
        createdAt: new Date().toISOString(),
        database: dbName,
        collections: COLLECTIONS,
        version: "1.0.0",
      },
      data: {},
    };

    let totalDocuments = 0;

    for (const collectionName of COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();

        // Convert ObjectId and other BSON types to plain JSON-serialisable form
        const serialised = JSON.parse(JSON.stringify(documents));
        backup.data[collectionName] = serialised;
        totalDocuments += documents.length;

        console.log(
          `  📦  ${collectionName.padEnd(20)} -> ${documents.length} document(s)`
        );
      } catch (err: any) {
        console.warn(
          `  ⚠️   Could not read collection "${collectionName}": ${err.message}`
        );
        backup.data[collectionName] = [];
      }
    }

    // ── Write to file ─────────────────────────────────────────────────────────
    const backupDir = path.join(__dirname, "backups");
    ensureBackupDir(backupDir);

    const filename = `backup_${timestamp()}.json`;
    const filePath = path.join(backupDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), "utf-8");

    const fileSizeKb = (fs.statSync(filePath).size / 1024).toFixed(2);

    console.log("\n-------------------------------------------------");
    console.log(`✅  Backup complete!`);
    console.log(`📄  File   : ${filePath}`);
    console.log(`📊  Total  : ${totalDocuments} document(s) across ${COLLECTIONS.length} collections`);
    console.log(`💾  Size   : ${fileSizeKb} KB`);
    console.log("-------------------------------------------------\n");
  } catch (err: any) {
    console.error("❌  Backup failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
