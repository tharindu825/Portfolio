# 🗄️ MongoDB Atlas — Backup & Restore Guide

> **Portfolio Project** | `server/backup.ts` & `server/restore.ts`

---

## 📁 File Overview

| File | Purpose |
|---|---|
| [`backup.ts`](./backup.ts) | Exports all MongoDB collections to a JSON file |
| [`restore.ts`](./restore.ts) | Imports a backup JSON file into a (new) MongoDB database |
| `backups/` | Folder where all backup files are saved automatically |

---

## 🚀 Quick Start

### Run a Backup
```bash
cd server
npm run backup
```

### Run a Restore
```bash
cd server
npm run restore backups/backup_2026-07-01_06-59-39.json
```

---

## 📦 Backup Script (`backup.ts`)

### What it does
- Connects to your **MongoDB Atlas** cluster using credentials in `.env`
- Reads every document from all 10 collections:
  - `user`, `project`, `config`, `project_media`, `experience`
  - `about`, `education`, `certification`, `achievement`, `skill_section`
- Saves everything to a single timestamped `.json` file inside `server/backups/`

### How to run
```bash
# Option 1 — npm script (recommended)
npm run backup

# Option 2 — direct
npx ts-node backup.ts
```

### Output example
```
🔗  Connecting to MongoDB Atlas...
✅  Connected to database: "Portfolio"
  📦  user                 -> 1 document(s)
  📦  project              -> 3 document(s)
  📦  experience           -> 5 document(s)
  📦  education            -> 14 document(s)
  📦  certification        -> 4 document(s)
  📦  skill_section        -> 4 document(s)
  ...

✅  Backup complete!
📄  File   : F:\...\server\backups\backup_2026-07-01_06-59-39.json
📊  Total  : 29 document(s) across 10 collections
💾  Size   : 339.46 KB
```

### Backup file structure
```json
{
  "meta": {
    "createdAt": "2026-07-01T06:59:39.130Z",
    "database": "Portfolio",
    "collections": ["user", "project", "config", ...],
    "version": "1.0.0"
  },
  "data": {
    "user": [ { "_id": "...", "username": "...", ... } ],
    "project": [ ... ],
    "education": [ ... ],
    ...
  }
}
```

### ⏰ How often should I backup?
| Scenario | Recommended Frequency |
|---|---|
| Active development | Once a day |
| Production (live site) | Every 1–3 days |
| Before major changes | Always — backup first! |
| Before migrating databases | Always — backup first! |

---

## 🔄 Restore Script (`restore.ts`)

### What it does
- Reads a backup `.json` file you specify
- Connects to the **target MongoDB Atlas** database (from your `.env`)
- **Drops** existing collections and re-inserts all documents with original `_id` values preserved
- Supports a `--no-drop` mode to merge instead of replace

### How to run

**Standard restore** (drops existing data, then restores):
```bash
npm run restore backups/backup_2026-07-01_06-59-39.json
```

**Merge restore** (keeps existing data, only adds new documents):
```bash
npx ts-node restore.ts backups/backup_2026-07-01_06-59-39.json --no-drop
```

### Output example
```
📂  Loading backup file: backup_2026-07-01_06-59-39.json (339.46 KB)

📋  Backup Info:
   Created    : 2026-07-01T06:59:39.130Z
   Source DB  : Portfolio
   Collections: user, project, config, ...

🔗  Connecting to target MongoDB Atlas database: "Portfolio"...
✅  Connected!

  ✅  user                 -> 1/1 document(s) restored
  ✅  experience           -> 5/5 document(s) restored
  ✅  education            -> 14/14 document(s) restored
  ...

✅  Restore complete!
📊  Documents restored : 29
🗄️   Target database    : Portfolio
```

---

## 🆘 Disaster Recovery — Step by Step

> Use this if your MongoDB Atlas cluster is deleted, corrupted, or you're migrating to a new cluster.

### Step 1 — Find your latest backup file
```
server/
└── backups/
    ├── backup_2026-07-01_06-59-39.json  ← use the most recent one
    ├── backup_2026-06-30_10-00-00.json
    └── ...
```

> **💡 If you haven't backed up recently**, check if an older backup file exists. Any backup is better than nothing.

---

### Step 2 — Create a new MongoDB Atlas cluster

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **"Create"** → Choose **Free Tier (M0)**
3. Choose a cloud provider & region (same as before if possible)
4. Wait for the cluster to provision (~2–3 minutes)

---

### Step 3 — Create a database user

1. In Atlas sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set a username and password (write these down!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

---

### Step 4 — Whitelist your IP address

1. In Atlas sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add your specific IP)
4. Click **"Confirm"**

---

### Step 5 — Get the new connection string

1. In Atlas → click **"Connect"** on your new cluster
2. Choose **"Connect your application"**
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 6 — Update your `.env` file

Open `server/.env` and update these three values:

```env
# Replace with your NEW cluster details
MONGODB_URI="mongodb+srv://NEW-cluster0.xxxxx.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0"
MONGODB_USER="your_new_username"
MONGODB_PASS="your_new_password"
```

> ⚠️ **Do NOT change the database name** (`Portfolio`) unless you also update it in your code.

---

### Step 7 — Run the restore

```bash
cd server
npx ts-node restore.ts backups/backup_2026-07-01_06-59-39.json
```

You should see all your collections being restored one by one.

---

### Step 8 — Restart the server

```bash
# Stop the current dev server (Ctrl+C) then:
npm run dev

# Or if deploying to production:
npm start
```

---

### Step 9 — Verify

Visit your portfolio and check:
- [ ] Admin login works
- [ ] Experience section loads
- [ ] Education / Certifications display
- [ ] Skills section is correct
- [ ] Projects appear

---

## 📂 Backup Storage — Best Practices

> ⚠️ **Keep backup files safe!** If you lose them AND Atlas goes down, your data is gone.

### Option A — OneDrive (easiest — you already use it)
Since your project is already in `F:\Onedrive\Tharindu\Researches\Portfolio`, the `backups/` folder is **automatically synced to OneDrive**. ✅ You're already covered!

### Option B — Add to `.gitignore`
Backup files are large and contain sensitive data. Keep them out of Git:

```gitignore
# In server/.gitignore — add this line:
backups/
```

### Option C — Keep the 3 most recent backups only
To avoid filling up storage, manually delete older backup files and keep only the last 3.

---

## 🔐 Security Notes

> The backup file contains **sensitive data** including:
> - Hashed passwords (`passwordHash` field in `user` collection)
> - Email addresses
> - All your portfolio content

**Do:**
- ✅ Store backups in OneDrive / Google Drive (encrypted at rest)
- ✅ Add `backups/` to `.gitignore`
- ✅ Keep backup files on your personal machine only

**Don't:**
- ❌ Commit backup files to GitHub
- ❌ Share backup files publicly
- ❌ Store in an unencrypted public location

---

## 🛠️ Troubleshooting

### ❌ `querySrv ENOTFOUND` error
**Cause:** Connection string URL has an unencoded `@` in the password.
**Fix:** Make sure `.env` has all three separate fields:
```env
MONGODB_URI="mongodb+srv://cluster0.xxxxx.mongodb.net/Portfolio?..."
MONGODB_USER="your_username"
MONGODB_PASS="your_password"
```
The scripts automatically build the safe URL using `encodeURIComponent()`.

---

### ❌ `Backup file not found` error
**Fix:** Make sure you run the command from inside the `server/` directory:
```bash
cd server
npx ts-node restore.ts backups/backup_2026-07-01_06-59-39.json
```

---

### ❌ `Invalid backup file format` error
**Cause:** The file is corrupted or wasn't created by this backup script.
**Fix:** Use a file created by `backup.ts` — it must have the `{ meta, data }` structure.

---

### ⚠️ Some documents skipped during restore
**Cause:** Documents with duplicate `_id` values (only happens in `--no-drop` / merge mode).
**Fix:** Run without `--no-drop` to do a full clean restore:
```bash
npx ts-node restore.ts backups/backup_2026-07-01_06-59-39.json
```

---

## 📋 Command Reference

| Command | Description |
|---|---|
| `npm run backup` | Run a full backup of the current database |
| `npm run restore <file>` | Restore from a backup file (drops & replaces) |
| `npx ts-node restore.ts <file> --no-drop` | Restore in merge mode (keeps existing data) |

---

*Last updated: July 2026 — Portfolio Project*
