import { Router } from "express";
import { TaskController } from "../Controllers/tasks.js";

export const Taskrouter = Router();

Taskrouter.get('/tasks', TaskController.GetAll);
Taskrouter.post('/task', TaskController.addTask);
Taskrouter.get('/detail/task', TaskController.detailsTask);
Taskrouter.delete('/delete/task', TaskController.deleteTask);
Taskrouter.delete('/sort/task', TaskController.SortTask);