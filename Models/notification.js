import { record } from "zod";
import { getSession } from "../config.js";
import { v4 as uuidv4 } from "uuid";

export class NotificationModel {
  static async addNotification(taskId, action, email) {
    const session = getSession();
    let notificationid = uuidv4();
    try {
      let result;
      if (action === "yes") {
        result = await session.run(
          `MATCH (t:Task {id: $taskId}) 
           WITH t
           CREATE (n:Notification {
           id: $notificationid,
           message: "La tarea '" + t.title + "' está a un día de su fecha límite.",
           due_date: t.due_date,
           created_at: datetime(),
           status: "pending"
            })
         WITH t, n
         MATCH (u:User {email: $email})
         MERGE (u)-[:HAS_NOTIFICATION]->(n)
         MERGE (n)-[:RELATED_TO]->(t)
         RETURN t, n
            `,
          {
            taskId,
            notificationid,
            email,
          }
        );
        return result.records[0].get("n").properties;
      } else if (action === "no") {
        return null;
      }
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
      throw err;
    } finally {
      session.close();
    }
  }

  static async GetNotifications(email) {
    const session = getSession();

    try {
      let result = await session.run(
        `
           MATCH (u:User {email: $email})
-[:HAS_NOTIFICATION]->(n:Notification)
-[:RELATED_TO]->(t:Task)
<-[:HAS_TASK]-(ts:TaskState)
<-[:HAS_SECTION]-(p:Project)
RETURN n.id AS notificationId, 
       n.message AS notificationMessage, 
       n.status AS notificationStatus, 
       t.title AS taskTitle, 
       t.due_date AS taskDueDate, 
       p.name AS projectName`,
        { email }
      );
      // Procesar resultados
      const notifications = result.records.map((record) => ({
        notificationId: record.get("notificationId"),
        notificationMessage: record.get("notificationMessage"),
        notificationStatus: record.get("notificationStatus"),
        taskTitle: record.get("taskTitle"),
        taskDueDate: record.get("taskDueDate"),
        projectName: record.get("projectName"),
      }));

      return notifications;
    } catch (err) {
      console.error("Error fetching notifications:", err);
      throw err; // Re-throw the error to be handled by the caller
    } finally {
      session.close(); // Always close the session
    }
  }
}
