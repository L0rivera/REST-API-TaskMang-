import { Router } from "express";
import { NotificationControllers } from "../Controllers/notifications.js";
import authMiddleware from "../middlewares/Cookieauth.js";

export const Notificacionrouter = Router();

Notificacionrouter.post('/activate-notification', authMiddleware, NotificationControllers.addNotification);
Notificacionrouter.get('/notifications', authMiddleware, NotificationControllers.GetNotifications);