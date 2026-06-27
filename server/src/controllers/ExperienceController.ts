import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Experience } from "../entities/Experience";
import { ObjectId } from "mongodb";

export class ExperienceController {
    static getAll = async (req: Request, res: Response) => {
        const experienceRepository = AppDataSource.getMongoRepository(Experience);
        const experiences = await experienceRepository.find();
        res.send(experiences);
    };

    static create = async (req: Request, res: Response) => {
        const { companyName, role, startDate, endDate, shortDescription, fullDescription } = req.body;
        const experience = new Experience();
        experience.companyName = companyName;
        experience.role = role;
        experience.startDate = startDate;
        experience.endDate = endDate;
        experience.shortDescription = shortDescription;
        experience.fullDescription = fullDescription;
        experience.logoUrl = req.body.logoUrl;

        const experienceRepository = AppDataSource.getMongoRepository(Experience);
        try {
            await experienceRepository.save(experience);
            res.status(201).send(experience);
        } catch (e) {
            res.status(400).send({ message: "Error creating experience" });
        }
    };

    static update = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { companyName, role, startDate, endDate, shortDescription, fullDescription } = req.body;
        const experienceRepository = AppDataSource.getMongoRepository(Experience);
        try {
            const experience = await experienceRepository.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!experience) return res.status(404).send({ message: "Experience not found" });
            
            experience.companyName = companyName;
            experience.role = role;
            experience.startDate = startDate;
            experience.endDate = endDate;
            experience.shortDescription = shortDescription;
            experience.fullDescription = fullDescription;
            experience.logoUrl = req.body.logoUrl;

            await experienceRepository.save(experience);
            res.send(experience);
        } catch (error) {
            return res.status(404).send({ message: "Experience not found" });
        }
    };

    static delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        const experienceRepository = AppDataSource.getMongoRepository(Experience);
        try {
            const experience = await experienceRepository.findOneBy({ _id: new ObjectId(id as string) } as any);
            if (!experience) return res.status(404).send({ message: "Experience not found" });
            await experienceRepository.remove(experience);
            res.status(204).send();
        } catch (error) {
            res.status(404).send({ message: "Experience not found" });
        }
    };
}
