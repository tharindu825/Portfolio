import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = <string>req.headers["authorization"]?.split(" ")[1];
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET || "secret");
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        console.error("JWT verification failed:", error instanceof Error ? error.message : error);
        console.log("Headers received:", req.headers);
        return res.status(401).send({ message: "Unauthorized" });
    }

    // Call the next middleware or controller
    next();
};
