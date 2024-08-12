import cron from 'node-cron';
import { getSession } from '../config.js';
import { sendNotificationEmail } from '../lib/SendEmail.js';

cron.schedule('0 0 * * *', async () => { // Ejecuta todos los días a medianoche
  console.log('Cron job iniciado'); // Log de inicio
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (n:Notification)-[:RELATED_TO]->(t:Task)
      WHERE n.status = "pending" AND date(t.due_date) = date() + duration({days: 1})
      MATCH (u:User)-[:HAS_NOTIFICATION]->(n)
      RETURN n, t, u
      `
    );
    console.log(`Notificaciones encontradas: ${result.records.length}`);
    const notifications = result.records.map(record => ({
      notification: record.get('n').properties,
      task: record.get('t').properties,
      user: record.get('u').properties,
    }));

    for (const { notification, task, user } of notifications) {
      const message = `La tarea "${task.title}" está a un día de su fecha límite (${task.due_date}).`;
       // Log antes de enviar el correo
       console.log(`Enviando notificación para la tarea: ${task.title} al usuario: ${user.email}`);
      // Enviar correo al usuario
      await sendNotificationEmail(user.email, 'Recordatorio de tarea pendiente', message);
      
      // Actualizar el estado de la notificación a "enviada"
      await session.run(
        `
        MATCH (n:Notification {id: $notificationId})
        SET n.status = "sent"
        `,
        { notificationId: notification.id }
      );
    }
  } catch (err) {
    console.error('Error executing cron job:', err);
  } finally {
    session.close();
  }
});