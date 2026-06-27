import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { ProjectController } from "../controllers/ProjectController";
import { ExperienceController } from "../controllers/ExperienceController";
import { AboutController } from "../controllers/AboutController";
import { EducationController, CertificationController, AchievementController } from "../controllers/ExtraControllers";
import { SkillController } from "../controllers/SkillController";
import { MediaController } from "../controllers/MediaController";
import { ContactController } from "../controllers/ContactController";
import { ConfigController } from "../controllers/ConfigController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

// Auth Routes
router.post("/auth/login", AuthController.login);
router.get("/auth/profile", [checkJwt], AuthController.getProfile);
router.put("/auth/profile", [checkJwt], AuthController.updateProfile);

// Config Routes (Admin only)
router.get("/config", [checkJwt], ConfigController.getAll);
router.put("/config", [checkJwt], ConfigController.update);

// Contact Route
router.post("/contact", ContactController.sendEmail);

// Upload Route (stored in GridFS for large files, base64 for small)
router.post("/upload", [checkJwt], MediaController.uploadFile);

// Media Serve Route (public — for streaming GridFS files)
router.get("/media/:id", MediaController.serveFile);
router.delete("/media/:id", [checkJwt], MediaController.deleteFile);

// About Routes
router.get("/about", AboutController.get);
router.put("/about", [checkJwt], AboutController.update);

// Project Routes
router.get("/projects", ProjectController.getAll);
router.get("/projects/:id", ProjectController.getOneById);
router.post("/projects", [checkJwt], ProjectController.create);
router.put("/projects/:id", [checkJwt], ProjectController.update);
router.delete("/projects/:id", [checkJwt], ProjectController.delete);

// Experience Routes
router.get("/experiences", ExperienceController.getAll);
router.post("/experiences", [checkJwt], ExperienceController.create);
router.put("/experiences/:id", [checkJwt], ExperienceController.update);
router.delete("/experiences/:id", [checkJwt], ExperienceController.delete);

// Education Routes
router.get("/education", EducationController.getAll);
router.post("/education", [checkJwt], EducationController.create);
router.put("/education/:id", [checkJwt], EducationController.update);
router.delete("/education/:id", [checkJwt], EducationController.delete);

// Certification Routes
router.get("/certifications", CertificationController.getAll);
router.post("/certifications", [checkJwt], CertificationController.create);
router.put("/certifications/:id", [checkJwt], CertificationController.update);
router.delete("/certifications/:id", [checkJwt], CertificationController.delete);

// Achievement Routes
router.get("/achievements", AchievementController.getAll);
router.post("/achievements", [checkJwt], AchievementController.create);
router.put("/achievements/:id", [checkJwt], AchievementController.update);
router.delete("/achievements/:id", [checkJwt], AchievementController.delete);

// Skill Routes
router.get("/skills", SkillController.getAll);
router.post("/skills", [checkJwt], SkillController.create);
router.put("/skills/:id", [checkJwt], SkillController.update);
router.delete("/skills/:id", [checkJwt], SkillController.delete);

export default router;
