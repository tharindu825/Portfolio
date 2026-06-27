import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Config } from "./entities/Config";
import { ProjectMedia } from "./entities/ProjectMedia";
import { Experience } from "./entities/Experience";
import { About } from "./entities/About";
import { Education, Certification, Achievement } from "./entities/ExtraSections";
import { SkillSection } from "./entities/Skill";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;

const config: any = databaseUrl?.startsWith("mongodb") ? {
    type: "mongodb",
    url: databaseUrl,
    authSource: "admin",
} : (databaseUrl?.startsWith("postgresql") ? {
    type: "postgres",
    url: databaseUrl,
    ssl: { rejectUnauthorized: false },
} : {
    type: "sqlite",
    database: "database.sqlite",
});

export const AppDataSource = new DataSource({
    ...config,
    synchronize: true, // Auto-update schema
    logging: false,
    entities: [User, Project, Config, ProjectMedia, Experience, About, Education, Certification, Achievement, SkillSection],
    migrations: [],
    subscribers: [],
});
