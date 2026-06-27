import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).send({ message: "Username and password are required" });
        }

        const userRepository = AppDataSource.getMongoRepository(User);
        let user: User | null;

        try {
            user = await userRepository.findOneBy({ username });
        } catch (error) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        // Sign JWT
        const token = jwt.sign(
            { userId: user.id.toString(), username: user.username },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.send({ token, username: user.username });
    };

    static getProfile = async (req: Request, res: Response) => {
        const userId = (req as any).tokenPayload.userId;
        const userRepository = AppDataSource.getMongoRepository(User);
        try {
            const user = await userRepository.findOneBy({ _id: new ObjectId(userId as string) } as any);
            if (!user) return res.status(404).send({ message: "User not found" });
            
            res.send({
                id: user.id,
                username: user.username,
                email: user.email
            });
        } catch (e) {
            res.status(404).send({ message: "User not found" });
        }
    };

    static updateProfile = async (req: Request, res: Response) => {
        const userId = (req as any).tokenPayload.userId;
        const { email } = req.body;
        const userRepository = AppDataSource.getMongoRepository(User);
        try {
            const user = await userRepository.findOneBy({ _id: new ObjectId(userId as string) } as any);
            if (!user) return res.status(404).send({ message: "User not found" });
            
            user.email = email;
            await userRepository.save(user);
            res.send({ message: "Profile updated", email: user.email });
        } catch (e) {
            res.status(404).send({ message: "User not found" });
        }
    };

    // Helper to create initial admin if not exists
    static seedAdmin = async () => {
        const userRepository = AppDataSource.getMongoRepository(User);
        const count = await userRepository.count();

        if (count === 0) {
            const admin = new User();
            admin.username = process.env.ADMIN_USERNAME || "admin";
            admin.passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);
            await userRepository.save(admin);
            console.log("Admin user seeded");
        }
    }
}
