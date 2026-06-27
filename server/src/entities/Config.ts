import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Config {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    key: string;

    @Column("text")
    value: string;
}
