import { Request, Response } from "express";
import multer, { MulterError } from "multer";
import { GridFSBucket, ObjectId, Db } from "mongodb";
import { AppDataSource } from "../data-source";

// Memory storage — stream directly into GridFS
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (_req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
        const isDoc = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ].includes(file.mimetype);

        if (isImage || isVideo || isDoc) return cb(null, true);
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
    },
}).single("file");

// Safer native DB access for TypeORM MongoDB driver
async function getNativeDb(): Promise<Db> {
    const driver = AppDataSource.driver as any;

    // Access native database object from TypeORM's connection
    if (driver.databaseConnection && typeof driver.databaseConnection.db === "function") {
        return driver.databaseConnection.db();
    }

    // Fallback if queryRunner is present
    const qrConnection = driver.queryRunner?.databaseConnection;
    if (qrConnection && typeof qrConnection.db === "function") {
        return qrConnection.db();
    }

    throw new Error("Unable to access native MongoDB driver. Check your TypeORM configuration.");
}

const GRIDFS_THRESHOLD = 500 * 1024; // Lower to 500KB to ensure doc safety

export class MediaController {
    static uploadFile = (req: Request, res: Response) => {
        upload(req, res, async (err) => {
            if (err) {
                if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
                    return res.status(413).send({ message: "File too large. Max 100MB allowed." });
                }
                return res.status(400).send({ message: err.message });
            }

            if (!req.file) return res.status(400).send({ message: "No file provided" });

            const { buffer, mimetype, originalname, size } = req.file;

            // Small files -> base64 directly
            if (size < GRIDFS_THRESHOLD) {
                const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;
                return res.json({ url: base64, storageType: "base64" });
            }

            // Large files -> GridFS
            try {
                const db = await getNativeDb();
                const bucket = new GridFSBucket(db, { bucketName: "media" });

                const uploadStream = bucket.openUploadStream(originalname, {
                    contentType: mimetype,
                    metadata: { uploadedAt: new Date(), mimetype }
                });

                uploadStream.write(buffer);
                uploadStream.end();

                await new Promise<void>((resolve, reject) => {
                    uploadStream.on("finish", resolve);
                    uploadStream.on("error", reject);
                });

                const fileId = uploadStream.id.toString();
                // Return relative URL that getMediaUrl() will handle
                return res.json({ url: `/api/media/${fileId}`, storageType: "gridfs" });
            } catch (gridErr: any) {
                console.error("[MediaController] GridFS Failure:", gridErr);
                return res.status(500).send({ message: "Failed to store large file in database. Check server logs." });
            }
        });
    };

    static serveFile = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if (!ObjectId.isValid(id)) return res.status(400).send({ message: "Invalid media ID" });

        try {
            const db = await getNativeDb();
            const bucket = new GridFSBucket(db, { bucketName: "media" });

            const files = await bucket.find({ _id: new ObjectId(id) }).toArray();
            if (!files || files.length === 0) return res.status(404).send({ message: "Media not found" });

            const file = files[0];
            let disposition = 'inline';
            // Force download prompt for PDFs or docs if requested, though inline is usually fine for PDFs.
            res.set({
                "Content-Type": file.contentType || "application/octet-stream",
                "Content-Length": String(file.length),
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=31536000",
                "Content-Disposition": `${disposition}; filename="${file.filename || 'download'}"`
            });

            bucket.openDownloadStream(new ObjectId(id)).pipe(res);
        } catch (err: any) {
            console.error("[MediaController] Serve Failure:", err);
            if (!res.headersSent) res.status(500).send({ message: "Internal server error reading media" });
        }
    };

    static deleteFile = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if (!ObjectId.isValid(id)) return res.status(400).send({ message: "Invalid media ID" });
        try {
            const db = await getNativeDb();
            const bucket = new GridFSBucket(db, { bucketName: "media" });
            await bucket.delete(new ObjectId(id));
            res.status(204).send();
        } catch (err) {
            res.status(500).send({ message: "Deletion failed" });
        }
    };
}
