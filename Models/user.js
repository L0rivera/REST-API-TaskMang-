import bcryptjs from "bcryptjs";
import { getSession } from "../config.js";
import { v4 as uuidv4 } from "uuid";
import { error } from "neo4j-driver";

export class UserModel {
  static async register(username, email, password) {
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    let userId = uuidv4(); 
    const session = getSession();

    try {
      const result = await session.run(
        "CREATE (u:User {id: $userId, username: $username, email: $email, password: $password}) RETURN u",
        { userId: userId ,username: username, email: email, password: hashPassword }
      );
      const registered = result.records.map(
        (record) => record.get("u").properties
      );
      return registered;
    } catch (err) {
      console.log(err);
    } finally {
      session.close();
    }
  }

  static async login(email, password) {
    const session = getSession();

    try {
      let result = await session.run(
        //Query to take the password of the user by the given email
        "MATCH (u:User {email: $email}) RETURN u.password AS storedPassword",
        { email: email }
      );
      if (result.records.length === 0) {
        // Si no se encuentra el usuario
        console.error("Invalid email or password");
        console.error(`Error ${error}`);
      }
      //Create a const for the password of the database that is hash
      const storedPassword = result.records[0].get("storedPassword");

      //Using bcyptjs we compare the two password
      const isMatch = await bcryptjs.compare(password, storedPassword);
      
      //Compare accepts two parameters one string(password) and one hash(storedPassword) to compare them
        if (!isMatch) {
            throw new Error("Invalid email or password");
        } 
        return result;
    } catch (err) {
      console.log(`Error: ${err}, messege: ${err.messege}`);
    } finally {
      session.close();
    }
  }

  static async GetAll(query) {
     const session = getSession();
        try {
            const result = await session.run(
                `MATCH (u:User)
                 WHERE toLower(u.username) CONTAINS toLower($query)
                 RETURN u`,
                { query }
            );

            return result.records.map(record => record.get('u').properties);
        } catch (err) {
            console.error(err);
            throw new Error('Error searching users');
        } finally {
            session.close();
        }
  }
}
