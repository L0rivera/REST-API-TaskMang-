import { Router } from "express";
import { SectionControllers } from "../Controllers/sections.js";

export const Sectionrouter = Router();

Sectionrouter.get('/sections', SectionControllers.GetAll);
Sectionrouter.post('/section', SectionControllers.AddSection);
Sectionrouter.post('/section/sort', SectionControllers.SortSection);