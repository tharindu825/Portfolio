/**
 * ============================================================
 *  MongoDB Atlas — Database Restore Script
 * ============================================================
 *  Usage:
 *    npx ts-node restore.ts <backup-file.json>
 *
 *  Example:
 *    npx ts-node restore.ts backups/backup_2025-01-01_10-00-00.json
 *
 *  What it does:
 *    1. Reads the backup JSON file
 *    2. Connects to the NEW MongoDB Atlas database (via DATABASE_URL in .env)
 *    3. Drops existing collections (to start fresh) — SKIPPED if --no-drop is passed
 *    4. Restores all documents with their original _id values preserved
 *
 *  Options:
 *    --no-drop   Skip dropping existing collections before restore
 *                (useful if you want to merge instead of replace)
 *
 *  IMPORTANT:
 *    Before running, update DATABASE_URL in your .env to point
 *    to the NEW database you want to restore into.
 * ============================================================
 */

import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Recursively converts plain _id / $oid strings back to proper ObjectId instances
 * so MongoDB indexes work correctly after restore.
 */
function reviveObjectIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(reviveObjectIds);
  }
  if (obj !== null && typeof obj === "object") {
    // MongoDB extended JSON format: { "$oid": "..." }
    if (typeof obj["$oid"] === "string") {
      return new ObjectId(obj["$oid"]);
    }
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[key] = reviveObjectIds(obj[key]);
    }
    return result;
  }
  return obj;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const noDrop = args.includes("--no-drop");
  const backupFile = args.find((a) => !a.startsWith("--"));

  if (!backupFile) {
    console.error("❌  Usage: npx ts-node restore.ts <backup-file.json> [--no-drop]");
    console.error("   Example: npx ts-node restore.ts backups/backup_2025-01-01_10-00-00.json");
    process.exit(1);
  }

  // Resolve path (support relative and absolute)
  const resolvedPath = path.isAbsolute(backupFile)
    ? backupFile
    : path.join(__dirname, backupFile);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌  Backup file not found: ${resolvedPath}`);
    process.exit(1);
  }

  // ── Load backup file ────────────────────────────────────────────────────────
  const fileSize = fs.statSync(resolvedPath).size;
  console.log(`📂  Loading backup file: ${path.basename(resolvedPath)} (${formatSize(fileSize)})`);

  let backup: any;
  try {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    backup = JSON.parse(raw);
  } catch (err: any) {
    console.error(`❌  Failed to parse backup file: ${err.message}`);
    process.exit(1);
  }

  if (!backup.meta || !backup.data) {
    console.error("❌  Invalid backup file format. Expected { meta: {...}, data: {...} }");
    process.exit(1);
  }

  console.log(`\n📋  Backup Info:`);
  console.log(`   Created    : ${backup.meta.createdAt}`);
  console.log(`   Source DB  : ${backup.meta.database}`);
  console.log(`   Collections: ${(backup.meta.collections || []).join(", ")}`);
  console.log(`   Version    : ${backup.meta.version || "unknown"}\n`);

  // ── Connect to target database ──────────────────────────────────────────────
  // Build a safe connection URL using MONGODB_URI + credentials
  // DATABASE_URL may contain unencoded @ in the password which breaks URL parsing
  let mongoUrl: string;
  const mongoUri = process.env.MONGODB_URI?.replace(/"/g, "");
  const mongoUser = process.env.MONGODB_USER?.replace(/"/g, "");
  const mongoPass = process.env.MONGODB_PASS?.replace(/"/g, "");

  if (mongoUri && mongoUser && mongoPass) {
    mongoUrl = mongoUri.replace(
      "mongodb+srv://",
      `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPass)}@`
    );
  } else {
    mongoUrl = process.env.DATABASE_URL || "";
    if (!mongoUrl.startsWith("mongodb")) {
      console.error("❌  No valid MongoDB connection info found in .env");
      console.error("    Set MONGODB_URI, MONGODB_USER, MONGODB_PASS  or  DATABASE_URL");
      process.exit(1);
    }
  }

  const dbNameMatch = mongoUrl.match(/\/([^/?]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : "Portfolio";

  console.log(`🔗  Connecting to target MongoDB Atlas database: "${dbName}"...`);
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("✅  Connected!\n");

    if (noDrop) {
      console.log("ℹ️   --no-drop flag set: skipping collection drop (merge mode)\n");
    } else {
      console.log("🗑️   Dropping existing collections before restore...");
    }

    let totalRestored = 0;
    let totalSkipped = 0;

    const collections = Object.keys(backup.data);

    for (const collectionName of collections) {
      const documents: any[] = backup.data[collectionName];

      if (!Array.isArray(documents)) {
        console.warn(`  ⚠️   Skipping "${collectionName}" — data is not an array`);
        totalSkipped++;
        continue;
      }

      if (documents.length === 0) {
        console.log(`  ⏭️   ${collectionName.padEnd(20)} -> 0 documents, skipped`);
        continue;
      }

      const collection = db.collection(collectionName);

      // Drop & recreate for clean restore
      if (!noDrop) {
        try {
          await collection.drop();
        } catch {
          // Collection might not exist yet — that's fine
        }
      }

      // Revive ObjectIds before inserting
      const revivedDocs = documents.map(reviveObjectIds);

      try {
        const result = await collection.insertMany(revivedDocs, {
          ordered: false, // Continue even if a document fails
        });
        totalRestored += result.insertedCount;
        console.log(
          `  ✅  ${collectionName.padEnd(20)} -> ${result.insertedCount}/${documents.length} document(s) restored`
        );
      } catch (err: any) {
        // insertMany with ordered:false may partially succeed
        if (err.insertedCount !== undefined) {
          totalRestored += err.insertedCount;
          console.warn(
            `  ⚠️   ${collectionName.padEnd(20)} -> ${err.insertedCount}/${documents.length} restored (some duplicates skipped)`
          );
        } else {
          console.error(`  ❌  ${collectionName.padEnd(20)} -> Failed: ${err.message}`);
          totalSkipped++;
        }
      }
    }

    console.log("\n-------------------------------------------------");
    console.log("✅  Restore complete!");
    console.log(`📊  Documents restored : ${totalRestored}`);
    console.log(`⏭️   Collections skipped: ${totalSkipped}`);
    console.log(`🗄️   Target database    : ${dbName}`);
    console.log("-------------------------------------------------\n");

    console.log("💡  Next steps:");
    console.log("   1. Update your .env DATABASE_URL if you haven't already");
    console.log("   2. Restart your server: npm run dev");
    console.log("   3. Verify data at your API endpoints\n");
  } catch (err: any) {
    console.error("❌  Restore failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
