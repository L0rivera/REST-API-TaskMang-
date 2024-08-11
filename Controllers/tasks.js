import { TaskModel } from "../Models/task.js";

export class TaskController {
  static async GetAll(req, res) {
    const { projectId, sectionId } = req.query;
    try {
      const result = await TaskModel.GetALL(projectId, sectionId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async addTask(req, res) {
    const { title, description, sectionId, importance, startdate, duedate } =
      req.body;
    try {
      const result = await TaskModel.addTask(
        title,
        description,
        sectionId,
        importance,
        startdate,
        duedate
      );
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async detailsTask(req, res) {
    let taskId = req.query.taskId;
    try {
      let result = await TaskModel.detailsTask(taskId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async editTask(req, res) {
    let { taskId } = params;
    let updates = req.body;
    try {
        let result = await TaskModel.editTask(taskId, updates);
        return res.json(result);
    } catch(err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

static async deleteTask(req, res) {
  let { taskId } = req.body;
  try {
    let result = await TaskModel.deleteTask(taskId);
    return res.json(result);
  } catch(err) {
     console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
  }
}

 static async SortTask(req, res) {
    let { order, sourceSectionId, destinationSectionId } = req.body;
    try {
      let result = await TaskModel.SortTask(order, sourceSectionId, destinationSectionId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
