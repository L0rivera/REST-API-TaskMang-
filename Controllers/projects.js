import { ProjectModel } from "../Models/project.js";
import getCookie from "../lib/GetCookie.js";

export class ProjectControllers {
  static async GetAll(req, res) {
    const email = req.user.email;

    try {
      const result = await ProjectModel.GetAll(email);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async AddProject(req, res) {
      const { name, description } = req.body;
      //If the parameters in the inputs are empty an error will be send
      if (!name || !description) {
        return res
          .status(400)
          .send({
            status: "Error",
            messege: "Los campos estan vacios o incompletos",
          });
      } 
    const email = req.user.email;
    try {
      const { project, sections } = await ProjectModel.addProject(name, description, email);
      return res.json({ project, sections });
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
