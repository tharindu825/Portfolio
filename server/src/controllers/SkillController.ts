import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SkillSection } from "../entities/Skill";
import { ObjectId } from "mongodb";

export class SkillController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(SkillSection);
            const skills = await repo.find();
            res.send(skills);
        } catch (error) {
            res.status(500).send({ message: "Failed to fetch skills", error });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(SkillSection);
            const section = repo.create(req.body);
            const result = await repo.save(section);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to create skill section", error });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(SkillSection);
            const { id } = req.params;
            const updateData = req.body;

            const section = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);

            if (!section) {
                return res.status(404).send({ message: "Skill section not found" });
            }

            const { id: _, _id: __, ...updatePayload } = updateData;
            Object.assign(section, updatePayload);
            const result = await repo.save(section);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: "Failed to update skill section", error });
        }
    };

    static delete = async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getMongoRepository(SkillSection);
            const { id } = req.params;
            const section = await repo.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!section) return res.status(404).send({ message: "Skill section not found" });
            await repo.remove(section);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ message: "Failed to delete skill section", error });
        }
    };
}
