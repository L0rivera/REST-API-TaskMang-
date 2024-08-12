import { NotificationModel } from "../Models/notification.js";

export class NotificationControllers {
  static async addNotification(req, res) {
    let { taskId, action } = req.body;
    let email = req.user.email;
    if (!email) {
      return res.status(401).json({ error: "Usuario no autenticado." });
    }
    try {
      const result = await NotificationModel.addNotification(taskId, action, email);
      if (result) {
        return res
          .status(200)
          .json({ message: "Notificación activada.", result });
      } else {
        return res.status(200).json({ message: "Notificación no creada." });
      }
    } catch (err) {
     
    }
  }

  static async GetNotifications(req, res) {
    let email = req.user.email;
    try {
        let result = await NotificationModel.GetNotifications(email);
          return res.json(result);
    } catch(err) {
          console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
