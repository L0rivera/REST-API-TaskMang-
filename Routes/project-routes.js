import { Router } from "express";
import { ProjectControllers } from "../Controllers/projects.js";
import authMiddleware from "../middlewares/Cookieauth.js";

export const Projectsrouter = Router();

Projectsrouter.get('/projects', authMiddleware, ProjectControllers.GetAll);
Projectsrouter.post('/project', authMiddleware, ProjectControllers.AddProject);