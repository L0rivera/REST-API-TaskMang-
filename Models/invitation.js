import { getSession } from "../config.js";
import { v4 as uuidv4 } from 'uuid';

export class InvitationModel {
  static async createInvitation(email, receiverId, projectId) {
    const session = getSession();
    let invitationId = uuidv4();
    try {
      const result = await session.run(
        `MATCH (sender:User {email: $email}), (receiver:User {id: $receiverId})
             MERGE (sender)-[:SENT_INVITE]->(i:Invitation {id: $invitationId, receiverId: $receiverId,senderId: sender.id, projectId: $projectId, status: 'pending'})
             MERGE (receiver)-[:RECEIVED_INVITE]->(i)
             RETURN i`,
        { email, invitationId, receiverId, projectId }
      );
      return result.records[0].get("i").properties;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }

  static async getPendingInvitations(email) {
    const session = getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {email: $email}) 
             WITH u
             MATCH (i:Invitation {receiverId: u.id, status: 'pending'})
             MATCH (sender:User {id: i.senderId})
             RETURN u, i, sender
        `,
        { email }
      );
      return result.records.map((record) => ({
        user: record.get('u').properties,
        invitation: record.get("i").properties,
        sender: record.get("sender").properties
      }));
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }

  static async respondInvitation(invitationId, action) {
    const session = getSession();
    try {
      let result;
      if (action === "accept") {
        result = await session.run(
          `MATCH (i:Invitation {id: $invitationId})
                 SET i.status = 'accepted'
                 WITH i
                 MATCH (sender:User {id: i.senderId}), (receiver:User {id: i.receiverId}), (project:Project {id: i.projectId})
                 CREATE (receiver)-[:MEMBER_OF]->(project)
                 CREATE (sender)-[:TEAMMATE]->(receiver)
                 RETURN i`,
          { invitationId }
        );
      } else if (action === "reject") {
        result = await session.run(
          `MATCH (i:Invitation {id: $invitationId})
                 SET i.status = 'rejected'
                 RETURN i`,
          { invitationId }
        );
      }
      return result.records[0].get("i").properties;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }
}
