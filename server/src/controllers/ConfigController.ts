import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Config } from "../entities/Config";

export class ConfigController {
    static getAll = async (req: Request, res: Response) => {
        const configRepository = AppDataSource.getMongoRepository(Config);
        const configs = await configRepository.find();
        // Return as key-value pair for easier frontend management
        const configMap: Record<string, string> = {};
        configs.forEach(c => configMap[c.key] = c.value);
        res.send(configMap);
    };

    static update = async (req: Request, res: Response) => {
        const configData = req.body; // Expecting { key: value }
        const configRepository = AppDataSource.getMongoRepository(Config);

        try {
            for (const key in configData) {
                let config = await configRepository.findOneBy({ key } as any);
                if (!config) {
                    config = configRepository.create({ key, value: configData[key] });
                } else {
                    config.value = configData[key];
                }
                await configRepository.save(config);
            }
            res.send({ message: "Settings updated successfully" });
        } catch (error) {
            res.status(500).send({ message: "Error updating settings" });
        }
    };
}
