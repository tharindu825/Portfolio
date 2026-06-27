import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { About } from "../entities/About";
import { User } from "../entities/User";

export class AboutController {
    static get = async (req: Request, res: Response) => {
        const aboutRepository = AppDataSource.getMongoRepository(About);
        try {
            const about = await aboutRepository.find();
            res.send(about[0] || {});
        } catch (error) {
            res.status(500).send({ message: "Error fetching about info" });
        }
    };

    static update = async (req: Request, res: Response) => {
        const aboutRepository = AppDataSource.getMongoRepository(About);
        let about: About;

        try {
            const results = await aboutRepository.find();
            if (results.length > 0) {
                about = results[0];
            } else {
                about = new About();
            }

            const {
                bioTitle, bioContent, yearsExperience, projectsCompleted, techStackCount,
                heroTitle, heroSubtitle, email, phone, location, skills, headline,
                profilePhotoUrl, defaultTheme, heroMainTitlePrefix, heroMainTitleGradient,
                heroMainTitleSuffix, availabilityText, resumeUrl, githubUrl, linkedinUrl,
                heroDescription, footerAbout, footerCopyright
            } = req.body;
            about.bioTitle = bioTitle;
            about.bioContent = bioContent;
            about.yearsExperience = yearsExperience;
            about.projectsCompleted = projectsCompleted;
            about.techStackCount = techStackCount;
            about.heroTitle = heroTitle;
            about.heroSubtitle = heroSubtitle;
            about.email = email;
            about.phone = phone;
            about.location = location;
            about.skills = skills;
            about.headline = headline;
            about.profilePhotoUrl = profilePhotoUrl;
            about.heroMainTitlePrefix = heroMainTitlePrefix;
            about.heroMainTitleGradient = heroMainTitleGradient;
            about.heroMainTitleSuffix = heroMainTitleSuffix;
            about.availabilityText = availabilityText;
            about.resumeUrl = resumeUrl;
            about.githubUrl = githubUrl;
            about.linkedinUrl = linkedinUrl;
            about.heroDescription = heroDescription;
            about.footerAbout = footerAbout;
            about.footerCopyright = footerCopyright;
            if (defaultTheme) about.defaultTheme = defaultTheme;

            await aboutRepository.save(about);

            // Sync with User table for contact functionality
            try {
                const userRepository = AppDataSource.getMongoRepository(User);
                const adminUsername = process.env.ADMIN_USERNAME || "admin";
                const admin = await userRepository.findOne({ where: { username: adminUsername } } as any);
                if (admin) {
                    admin.email = email;
                    await userRepository.save(admin);
                }
            } catch (userErr) {
                console.error("Failed to sync user email:", userErr);
            }

            res.send(about);
        } catch (error) {
            res.status(400).send({ message: "Error updating about info" });
        }
    };
}
