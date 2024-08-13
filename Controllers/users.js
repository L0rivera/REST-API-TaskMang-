import jsonwebtoken from "jsonwebtoken";
import { UserModel } from "../Models/user.js";
import CreateCookie from "../lib/CreateCookie.js";

export class UserController {
  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const registered = await UserModel.register(username, email, password);
      const token = jsonwebtoken.sign(
        { username, email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", token, {
        path: "/",
        httpOnly: true, // Agrega esta opción para mayor seguridad
        secure: process.env.NODE_ENV === "production", // Configura secure solo en producción
        maxAge: 1000 * 60 * 60,
      });
      if (registered)
        return res.status(200).json({ message: "Register successful", token });
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    const { username, email, password } = req.body;
    try {
      const logged = await UserModel.login(email, password);
      const token = jsonwebtoken.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log('Setting cookie:', token);
res.cookie("jwt", token, {
    path: "/",
    httpOnly: true, // Agrega para mayor seguridad
    secure: process.env.NODE_ENV === "production",
     sameSite: 'None',
    maxAge: 1000 * 60 * 60 * 24 * 1,
});
      if (logged)
        return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error(`Error: ${err}, message: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async GetAll(req, res) {
    const { query } = req.query;
    try {
      const users = await UserModel.GetAll(query);
      return res.json(users);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
