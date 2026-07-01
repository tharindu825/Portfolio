# 🚀 Replit Deployment Guide — Portfolio

> **Full-Stack**: React + Vite (frontend) + Express + TypeScript (backend) + MongoDB Atlas

---

## ⚠️ Important: Free Tier Limitations

| Feature | Free Tier | Paid (Core) |
|---|---|---|
| Run while Replit tab is open | ✅ | ✅ |
| Permanent `.replit.app` URL | ❌ | ✅ |
| Always-On (no sleep) | ❌ | ✅ |
| Custom domain | ❌ | ✅ |

**On the free tier:** Your app sleeps after 5 minutes of inactivity. A permanent public URL requires a paid deployment. The free tier is great for testing and sharing a dev URL.

---

## 📋 Prerequisites

- [ ] A **GitHub account**
- [ ] A **Replit account** (free at replit.com)
- [ ] Your code pushed to a **GitHub repository**

---

## Step 1 — Push Your Code to GitHub

### If you don't have a GitHub repo yet:

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `portfolio` (or anything you like)
3. Set it to **Public** or **Private**
4. Click **Create repository**

### Push from your local machine:

Open a terminal in `F:\Onedrive\Tharindu\Researches\Portfolio` and run:

```bash
git init
git add .
git commit -m "Initial commit — portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> ⚠️ Your `.gitignore` already excludes `.env` files and `node_modules` — your secrets are safe.

---

## Step 2 — Import to Replit

1. Go to [replit.com](https://replit.com) and sign in
2. Click the **"+ Create Repl"** button (top left)
3. Choose **"Import from GitHub"**
4. Connect your GitHub account if not already connected
5. Search for and select your **portfolio** repository
6. Click **"Import from GitHub"**

Replit will clone your repo and open the workspace.

---

## Step 3 — Add Environment Variables (Secrets)

> **Never put your `.env` file in GitHub.** Use Replit Secrets instead.

1. In your Replit workspace, find the **🔒 Secrets** tool in the left sidebar (or Tools menu)
2. Add each secret from your `.env` file **one by one**:

| Secret Key | Value (from your `.env`) |
|---|---|
| `DATABASE_URL` | `mongodb+srv://tharindudilshan0825:Ddunac@41@cluster0.l0r9b.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0` |
| `MONGODB_URI` | `mongodb+srv://cluster0.l0r9b.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0` |
| `MONGODB_USER` | `tharindudilshan0825` |
| `MONGODB_PASS` | `Ddunac@41` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `LXOHiwkZHB` |
| `ADMIN_USERNAME` | `Tharidu` |
| `ADMIN_PASSWORD` | `@Methuli@2023` |

> ℹ️ To add a secret: click **"New Secret"**, enter the Key, paste the Value, click **"Add Secret"**.

### Allow MongoDB Atlas to connect from Replit

Replit uses dynamic IPs. You need to allow all IPs in MongoDB Atlas:

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **Confirm**

---

## Step 4 — Run the App

### First Run (Build + Start)

In the Replit **Shell** tab at the bottom, run:

```bash
npm run replit:build
```

This will:
- Install all dependencies (root + client + server)
- Build the React frontend (`client/dist/`)
- Compile TypeScript server (`server/dist/`)

This takes **3–5 minutes** on first run.

### Start the Server

After the build completes:

```bash
npm run replit:start
```

Or just click the ▶️ **Run** button at the top — Replit will use the command from `.replit`.

### Verify it's working

You should see in the console:
```
Data Source has been initialized!
Server is running on http://0.0.0.0:5000
```

Replit will show a **Webview** panel with your app running. You'll also get a **Dev URL** like:
```
https://portfolio.YOUR-USERNAME.repl.co
```

---

## Step 5 — Test the App

Open the Webview or visit your dev URL and check:

- [ ] Portfolio homepage loads
- [ ] Experience, Education, Certifications show correctly
- [ ] Skills section displays
- [ ] Navigate to `/admin` — login with `Tharidu` / `@Methuli@2023`
- [ ] Admin panel works

---

## Step 6 — (Optional) Deploy for Permanent URL

> Requires a **paid Replit plan**

1. In Replit, click the **"Deploy"** button (top right)
2. Choose **"Autoscale"** deployment type
3. Set:
   - **Build command**: `npm run replit:build`
   - **Run command**: `npm run replit:start`
4. Click **"Deploy"**
5. You'll get a permanent URL: `https://portfolio.YOUR-USERNAME.replit.app`

---

## 🔁 Rebuilding After Code Changes

When you push new code to GitHub:

1. In Replit Shell, pull latest changes:
   ```bash
   git pull origin main
   ```
2. Rebuild:
   ```bash
   npm run replit:build
   ```
3. Restart:
   ```bash
   npm run replit:start
   ```

---

## 🛠️ Troubleshooting

### ❌ App shows blank page / 404
**Cause:** React build not found.
**Fix:** Run `npm run replit:build` again and check for build errors.

---

### ❌ `Cannot connect to database` / MongoDB error
**Cause:** Missing secrets or MongoDB IP not whitelisted.
**Fix:**
1. Check all 4 MongoDB secrets are added in Replit Secrets
2. In MongoDB Atlas → Network Access → allow `0.0.0.0/0`

---

### ❌ `PORT already in use`
**Fix:** In Shell, kill any running process:
```bash
pkill -f "node server/dist/index.js"
npm run replit:start
```

---

### ❌ Build fails with TypeScript errors
**Fix:** Run the build with more info:
```bash
cd server && npx tsc --noEmit
```
Fix any reported type errors, then rebuild.

---

### ⚠️ App sleeps / visitors see slow load
**Cause:** Free tier inactivity sleep (5 min).
**Options:**
- Upgrade to Replit Core for always-on
- Use [UptimeRobot](https://uptimerobot.com) (free) to ping your URL every 5 min to keep it awake
- Switch to Render.com free tier (same sleep, better performance)

---

## 📁 Files Added/Modified for Replit

| File | Change |
|---|---|
| `.replit` | Updated with build/run commands and port config |
| `replit.nix` | Pins Node.js 20.x environment |
| `package.json` (root) | Added `replit:build` and `replit:start` scripts |

---

## 🔗 Quick Reference

| Resource | URL |
|---|---|
| Replit | https://replit.com |
| MongoDB Atlas | https://cloud.mongodb.com |
| Your dev URL | `https://portfolio.YOUR-USERNAME.repl.co` |
| Admin panel | `https://YOUR-URL/admin` |

---

*Last updated: July 2026 — Portfolio Project*
