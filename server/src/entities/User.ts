import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    username: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    email: string;
}
