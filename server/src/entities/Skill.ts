import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class SkillSection {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    title: string;

    @Column()
    skills: string[];
}
