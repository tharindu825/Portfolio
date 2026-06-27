import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Education {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    institution: string;

    @Column()
    degree: string;

    @Column()
    fieldOfStudy: string;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column("text", { nullable: true })
    logoUrl: string;
}

@Entity()
export class Certification {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    name: string;

    @Column()
    issuingOrganization: string;

    @Column()
    issueDate: string;

    @Column({ nullable: true })
    expirationDate: string;

    @Column({ nullable: true })
    credentialId: string;

    @Column({ nullable: true })
    credentialUrl: string;

    @Column("text", { nullable: true })
    logoUrl: string;

    @Column()
    imageUrls: string[];
}

@Entity()
export class Achievement {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    title: string;

    @Column()
    date: string;

    @Column("text")
    description: string;

    @Column({ nullable: true })
    issuer: string;

    @Column()
    imageUrls: string[];
}
