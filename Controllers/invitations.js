import { InvitationModel } from "../Models/invitation.js";

export class InvitationController {

    static async Invite(req, res) {
    const { receiverId, projectId } = req.body;
    let senderId = req.user.email;
    try {
        const invitation = await InvitationModel.createInvitation(senderId, receiverId, projectId);
        return res.status(201).json(invitation);
    } catch (err) {
        console.error(`Error: ${err}, message: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

static async Pendinginvitations(req, res) {
    let email = req.user.email;
    try {
        const invitations = await InvitationModel.getPendingInvitations(email);
        return res.status(200).json(invitations);
    } catch (err) {
        console.error(`Error: ${err}, message: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

static async inviteResponse(req, res) {
    const { invitationId, action } = req.body;
    try {
        if (action === 'accept') {
            await InvitationModel.respondInvitation(invitationId);
        } else if (action === 'reject') {
            await InvitationModel.respondInvitation(invitationId);
        }
        return res.status(200).json({ message: "Invitation updated successfully" });
    } catch (err) {
        console.error(`Error: ${err}, message: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
}