import { Request, Response } from "express";
import multer from "multer";
import { MulterError } from "multer";

// Configure memory storage for Base64 database persistence
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for video uploads
    fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        const isDocument =
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (isImage || isVideo || isDocument) {
            return cb(null, true);
        }
        cb(new Error(`Unsupported file type: ${file.mimetype}. Only images, videos, and documents are allowed.`));
    },
}).single("file");

export class UploadController {
    static uploadFile = (req: Request, res: Response) => {
        upload(req, res, (err) => {
            if (err) {
                console.error("[Upload] Error:", err.message, "| Code:", (err as any).code);

                if (err instanceof MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res.status(413).send({
                            message: `File is too large. Maximum allowed size is 200 MB. Your file exceeds this limit.`
                        });
                    }
                    return res.status(400).send({ message: `Upload error: ${err.message}` });
                }

                // File type rejection
                return res.status(400).send({ message: err.message });
            }

            if (!req.file) {
                return res.status(400).send({ message: "Please upload a file" });
            }



            // Convert file buffer to Base64 string for direct database storage
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            res.send({ url: base64 });
        });
    };
}

