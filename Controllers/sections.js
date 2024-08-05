import { SectionModel } from "../Models/section.js";
import getCookie from "../lib/GetCookie.js";

export class SectionControllers {
  static async GetAll(req, res) {
    const projectId = req.query.projectId;
    const decode = getCookie(req, res);
    const email = decode.email;
    try {
      const result = await SectionModel.GetALL(email, projectId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async AddSection(req, res) {
    let { name, projectId } = req.body;
    try {
      const result = await SectionModel.AddSection(name, projectId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async SortSection(req, res) {
    let { order, projectId } = req.body;
    try {
      let result = await SectionModel.SortSection(order, projectId);
      return res.json(result);
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
