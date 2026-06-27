import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Education, Certification, Achievement } from "../entities/ExtraSections";
import { ObjectId } from "mongodb";

export class EducationController {
    static getAll = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Education);
        res.send(await repo.find());
    };
    static create = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Education);
        const item = repo.create(req.body);
        res.send(await repo.save(item));
    };
    static update = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Education);
        const { id } = req.params;
        const updateData = req.body;

        try {
            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Education entry not found" });
            
            // Remove id fields from updateData to prevent overwriting the document's identity
            const { id: _, _id: __, ...updatePayload } = updateData;
            Object.assign(item, updatePayload);
            res.send(await repo.save(item));
        } catch (e) {
            res.status(404).send({ message: "Education entry not found" });
        }
    };
    static delete = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Education);
        const { id } = req.params;
        try {
            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Education entry not found" });
            await repo.remove(item);
            res.status(204).send();
        } catch (e) {
            res.status(404).send({ message: "Education entry not found" });
        }
    };
}

export class CertificationController {
    static getAll = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Certification);
        res.send(await repo.find());
    };
    static create = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Certification);
        const item = repo.create(req.body);
        res.send(await repo.save(item));
    };
    static update = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Certification);
        const { id } = req.params;
        const updateData = req.body;

        try {
            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Certification entry not found" });
            
            const { id: _, _id: __, ...updatePayload } = updateData;
            Object.assign(item, updatePayload);
            res.send(await repo.save(item));
        } catch (e) {
            res.status(404).send({ message: "Certification entry not found" });
        }
    };
    static delete = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Certification);
        const { id } = req.params;
        try {
            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Certification entry not found" });
            await repo.remove(item);
            res.status(204).send();
        } catch (e) {
            res.status(404).send({ message: "Certification entry not found" });
        }
    };
}

export class AchievementController {
    static getAll = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Achievement);
        res.send(await repo.find());
    };
    static create = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(Achievement);
            const { title, date, description, issuer, imageUrls } = req.body;
            const item = repo.create({ title, date, description, issuer, imageUrls });
            res.send(await repo.save(item));
        } catch (error) {
            console.error('Error in AchievementController.create:', error);
            res.status(500).send({ message: 'Internal server error', error });
        }
    };
    static update = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(Achievement);
            const { id } = req.params;
            const updateData = req.body;

            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Achievement not found" });

            const { id: _, _id: __, ...updatePayload } = updateData;
            Object.assign(item, updatePayload);
            res.send(await repo.save(item));
        } catch (error) {
            console.error('Error in AchievementController.update:', error);
            res.status(500).send({ message: 'Internal server error', error });
        }
    };
    static delete = async (req: Request, res: Response) => {
        const repo = AppDataSource.getMongoRepository(Achievement);
        const { id } = req.params;
        try {
            const item = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!item) return res.status(404).send({ message: "Achievement entry not found" });
            await repo.remove(item);
            res.status(204).send();
        } catch (e) {
            res.status(404).send({ message: "Achievement entry not found" });
        }
    };
}
