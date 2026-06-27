import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";
import { ProjectMedia } from "./ProjectMedia";

@Entity()
export class Project {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    name: string;

    @Column()
    shortDescription: string;

    @Column({ nullable: true })
    fullDescription: string;

    // Use plain Column for MongoDB — native arrays are stored directly as BSON arrays
    @Column()
    techStack: string[];

    @Column({ nullable: true })
    githubUrl: string;

    @Column({ nullable: true })
    liveUrl: string;

    @Column({ default: "Ongoing" })
    status: string;

    // Store media as an array of objects directly in MongoDB
    @Column()
    media: ProjectMedia[];
}
