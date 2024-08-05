import { Router } from "express";
import { InvitationController } from "../Controllers/invitations.js";
import authMiddleware from "../middlewares/Cookieauth.js";

export const Invitationsrouter = Router();

Invitationsrouter.get('/invitations', authMiddleware, InvitationController.Pendinginvitations);
Invitationsrouter.post('/invite', authMiddleware, InvitationController.Invite);
Invitationsrouter.post('/response/invite', InvitationController.inviteResponse);


