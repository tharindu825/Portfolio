import { Column } from "typeorm";

export class ProjectMedia {
    @Column()
    url: string;

    @Column()
    type: "IMAGE" | "VIDEO";
}
