import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class About {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ default: 'Name' })
    heroTitle: string;

    @Column({ default: 'Software Engineer' })
    headline: string;

    @Column("text", { default: '' })
    profilePhotoUrl: string;

    @Column({ default: 'Designing' })
    heroMainTitlePrefix: string;

    @Column({ default: 'Digital' })
    heroMainTitleGradient: string;

    @Column({ default: 'Experiences.' })
    heroMainTitleSuffix: string;

    @Column({ default: 'AVAILABLE FOR PROJECTS' })
    availabilityText: string;

    @Column({ default: 'I build robust & scalable digital solutions.' })
    heroSubtitle: string;

    @Column({ default: 'name@gmail.com' })
    email: string;

    @Column({ default: '+1 (234) 567-890' })
    phone: string;

    @Column({ default: 'New York, USA' })
    location: string;

    @Column()
    bioTitle: string;

    @Column("text")
    bioContent: string;

    // Plain column so MongoDB stores as a native BSON array (not comma-joined string)
    @Column({ nullable: true })
    skills: string[];

    @Column({ default: 0 })
    yearsExperience: number;

    @Column({ default: 0 })
    projectsCompleted: number;

    @Column({ default: 0 })
    techStackCount: number;

    @Column({ default: 'dark' })
    defaultTheme: string;

    @Column("text", { default: '' })
    resumeUrl: string;

    @Column({ default: '' })
    githubUrl: string;

    @Column({ default: '' })
    linkedinUrl: string;

    @Column({ default: 'dedicated to craft high-performance applications.' })
    heroDescription: string;

    @Column({ default: 'Crafting innovative digital experiences with modern technologies and a passion for design.' })
    footerAbout: string;

    @Column({ default: 'PORTFOLIO. MADE WITH PASSION.' })
    footerCopyright: string;
}
