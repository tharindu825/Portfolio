import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { AuthController } from "./controllers/AuthController";
import routes from "./routes";
import path from "path";
import fs from "fs";
import compression from "compression";

dotenv.config();

console.log("Starting server...");

const app = express();
app.use(compression());
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// Dynamic CORS: allow configured origins or all in dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : ["*"];

app.use(cors({
    origin: isProd && allowedOrigins[0] !== "*"
        ? (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: ${origin}`));
            }
        }
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Debug Logging Middleware
app.use((req, res, next) => {
    const bodyString = JSON.stringify(req.body);
    const bodySize = bodyString ? bodyString.length : 0;
    console.log(`[REQ] ${req.method} ${req.url} | BodySize: ${(bodySize / 1024 / 1024).toFixed(2)}MB`);
    next();
});

app.use("/api", routes);

// Serve React client build in production if it exists
// First check relative to the file's current directory, then relative to current working directory
let clientBuildPath = path.join(__dirname, "..", "..", "client", "dist");
if (!fs.existsSync(clientBuildPath)) {
    clientBuildPath = path.join(process.cwd(), "client", "dist");
}
if (isProd && fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    // SPA fallback — serve index.html for all non-API routes
    app.get(/^(?!\/api|\/uploads).*$/, (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
    console.log(`Serving React client from: ${clientBuildPath}`);
} else {
    app.get("/", (_req, res) => {
        res.send(" Portfolio API is running");
    });
}

console.log("Initializing database...");
AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        await AuthController.seedAdmin();
        app.listen(Number(PORT), "0.0.0.0", () => {
            console.log(`Server is running on http://0.0.0.0:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
