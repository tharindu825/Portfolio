import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Experience {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    companyName: string;

    @Column()
    role: string;

    @Column()
    startDate: string;

    @Column({ nullable: true })
    endDate: string;

    @Column("text")
    shortDescription: string;

    @Column("text", { nullable: true })
    fullDescription: string;

    @Column("text", { nullable: true })
    logoUrl: string;
}
