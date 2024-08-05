import { getSession } from "../config.js";
import { v4 as uuidv4 } from "uuid";

export class SectionModel {
  static async GetALL(email, projectId) {
    const session = getSession();

    try {
      const result = await session.run(
        "MATCH (u:User {email: $email})-[:CREATE]->(p:Project {id: $projectId}), (p)-[:HAS_SECTION]->(st:TaskState) RETURN st",
        { email: email, projectId: projectId }
      );
      const Sections = result.records.map(
        (record) => record.get("st").properties
      );
      return Sections;
    } catch (err) {
      console.log(err, err.messege);
    } finally {
      session.close();
    }
  }

  static async AddSection(name, projectId) {
    const session = getSession();
    const sectionId = uuidv4();
    try {
      const result = await session.run(
        "MATCH (p:Project {id: $projectId}) CREATE (ts:TaskState {id: $sectionId, name: $name, order: 1}) CREATE (p)-[:HAS_SECTION]->(ts) RETURN ts",
        { projectId: projectId, sectionId: sectionId, name: name }
      );
      const section = result.records.map(
        (record) => record.get("ts").properties
      );
      return section;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }

  static async SortSection(order, projectId) {
        const session = getSession();

        try {
            let result = await session.run(
                `UNWIND $order AS o
                 MATCH (p:Project {id: $projectId})-[:HAS_SECTION]->(ts:TaskState {id: o.id})
                 SET ts.order = o.position
                 RETURN ts.id, ts.order`, 
                { projectId: projectId, order: order.map(({ id, position }) => ({ id, position }))}
            );
            
            console.log("Result:", result.records.map(record => record.toObject()));
            return result.records.map(record => record.toObject());
        } catch (err) {
            console.log(`Error: ${err}, Error message: ${err.message}`);
            throw err;
        } finally {
            session.close();
        }
    }

}
