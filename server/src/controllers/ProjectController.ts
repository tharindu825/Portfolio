import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";
import { ProjectMedia } from "../entities/ProjectMedia";
import { ObjectId } from "mongodb";

function normalizeTechStack(techStack: any): string[] {
    if (!techStack) return [];
    if (Array.isArray(techStack)) return techStack.filter(s => typeof s === "string").map(s => s.trim());
    if (typeof techStack === "string") return techStack.split(",").map(item => item.trim()).filter(Boolean);
    return [];
}

/**
 * Ensures media data is safe and within MongoDB document limits.
 */
function sanitizeMedia(rawMedia: any[]): any[] {
    if (!Array.isArray(rawMedia)) {
        console.warn("[ProjectController.sanitizeMedia] Expected array, got:", typeof rawMedia);
        return [];
    }

    return rawMedia
        .filter((m: any) => {
            if (!m || !m.url || typeof m.url !== "string") return false;
            // Strict length check for all media URLs (especially base64)
            // 1MB = 1,048,576 characters approx.
            if (m.url.length > 2 * 1024 * 1024) {
                console.warn(`[ProjectController.sanitizeMedia] Dropping media entry too large for a document (${(m.url.length / 1024 / 1024).toFixed(1)}MB).`);
                return false;
            }
            return true;
        })
        .map((m: any) => ({
            url: m.url,
            type: (m.type === "IMAGE" || m.type === "VIDEO") ? m.type : "IMAGE"
        }));
}

export class ProjectController {
    static getAll = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Project);
        try {
            const projects = await repo.find();
            res.send(projects || []);
        } catch (error: any) {
            console.error("[ProjectController.getAll] ERROR:", error.message);
            res.status(500).send({ message: "Failed to fetch projects" });
        }
    };

    static getOneById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const repo = AppDataSource.getMongoRepository(Project);
        try {
            const sid = id as string;
            if (!ObjectId.isValid(sid)) return res.status(400).send({ message: "Invalid project ID" });
            const project = await repo.findOneBy({ _id: new ObjectId(sid) } as any);
            if (!project) return res.status(404).send({ message: "Project not found" });
            res.send(project);
        } catch (error: any) {
            console.error("[ProjectController.getOne] ERROR:", error.message);
            res.status(500).send({ message: "Failed to fetch project" });
        }
    };

    static create = async (req: Request, res: Response) => {
        const { name, shortDescription, fullDescription, techStack, githubUrl, liveUrl, status, media } = req.body;
        console.log(`[ProjectController.create] New project request for: "${name}"`);

        const repo = AppDataSource.getMongoRepository(Project);
        const project = repo.create({
            name: name || "Untitled Project",
            shortDescription: shortDescription || "",
            fullDescription: fullDescription || "",
            techStack: normalizeTechStack(techStack),
            githubUrl: githubUrl || "",
            liveUrl: liveUrl || "",
            status: status || "Ongoing",
            media: sanitizeMedia(media)
        });

        try {
            const saved = await repo.save(project);
            res.status(201).send(saved);
        } catch (error: any) {
            console.error("[ProjectController.create] CRITICAL SAVE ERROR:", error.message);
            res.status(400).send({
                message: "MongoDB Save Failed",
                detail: error.message,
                hint: error.message.includes("exceeds maximum") ? "File too large. Ensure media is uploaded via button, not pasted." : undefined
            });
        }
    };

    static update = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;
        console.log(`[ProjectController.update] Patching project ID: ${id}`);

        const repo = AppDataSource.getMongoRepository(Project);
        try {
            const sid = id as string;
            if (!ObjectId.isValid(sid)) return res.status(400).send({ message: "Invalid project ID" });

            const existing = await repo.findOneBy({ _id: new ObjectId(sid) } as any);
            if (!existing) return res.status(404).send({ message: "Project not found" });

            // Apply updates
            if (body.name !== undefined) existing.name = body.name;
            if (body.shortDescription !== undefined) existing.shortDescription = body.shortDescription;
            if (body.fullDescription !== undefined) existing.fullDescription = body.fullDescription;
            if (body.techStack !== undefined) existing.techStack = normalizeTechStack(body.techStack);
            if (body.githubUrl !== undefined) existing.githubUrl = body.githubUrl;
            if (body.liveUrl !== undefined) existing.liveUrl = body.liveUrl;
            if (body.status !== undefined) existing.status = body.status;
            if (body.media !== undefined) existing.media = sanitizeMedia(body.media);

            const saved = await repo.save(existing);
            res.send(saved);
        } catch (error: any) {
            console.error("[ProjectController.update] CRITICAL UPDATE ERROR:", error.message);
            res.status(400).send({
                message: "Update Failed",
                detail: error.message,
                hint: error.message.includes("too large") ? "Document size exceeded. Use GridFS for large media." : undefined
            });
        }
    };

    static delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        const repo = AppDataSource.getMongoRepository(Project);
        try {
            const sid = id as string;
            if (!ObjectId.isValid(sid)) return res.status(400).send({ message: "Invalid project ID" });
            const existing = await repo.findOneBy({ _id: new ObjectId(sid) } as any);
            if (!existing) return res.status(404).send({ message: "Project not found" });

            await repo.remove(existing);
            res.status(204).send();
        } catch (error: any) {
            console.error("[ProjectController.delete] Error:", error.message);
            res.status(500).send({ message: "Failed to delete project" });
        }
    };
}
