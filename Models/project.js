import { getSession } from "../config.js";
import { v4 as uuidv4 } from 'uuid';

export class ProjectModel {
  static async GetAll(email) {
    const session = getSession();
    try {
      const result = await session.run(
        "MATCH (u:User {email: $email})-[:CREATE]->(p:Project) RETURN p.id as id, p.name as name, p.description as description", // Modificar la consulta para incluir p.id
        { email: email }
      );
      const projects = result.records.map((record) => ({
        id: record.get("id"),
        name: record.get("name"),
        description: record.get("description"),
        // Agrega otras propiedades según sea necesario
      }));
      return projects;
    } catch (err) {
      console.log(err, err.messege);
    } finally {
      session.close();
    }
  }

  static async addProject( name, description, email ) {
    const session = getSession();
    const projectId = uuidv4();
    const sectionId1 = uuidv4();
    const sectionId2 = uuidv4();
    const sectionId3 = uuidv4();
    try {
      const result = await session.run(
        `CREATE (p:Project {id: $projectId, name: $name, description: $description, creation_date: date() })
            WITH p
            MATCH (u:User {email: $email}), (p:Project {name: $name}) MERGE (u)-[:CREATE]->(p)
             CREATE (s3:TaskState {id: $sectionId1, name: 'To do'})
             CREATE (s2:TaskState {id: $sectionId2, name: 'In process'})
             CREATE (s1:TaskState {id: $sectionId3, name: 'Done'})
             MERGE (p)-[:HAS_SECTION]->(s1)
             MERGE (p)-[:HAS_SECTION]->(s2)
             MERGE (p)-[:HAS_SECTION]->(s3)
            RETURN p, s1, s2, s3`,
        {
          projectId: projectId,
          name: name,
          description: description,
          email: email,
          sectionId1: sectionId1,
          sectionId2: sectionId2,
          sectionId3: sectionId3
        }
      );
      const projectRecord = result.records[0];
      const project = projectRecord.get("p").properties;
      const sections = [
        projectRecord.get("s1").properties,
        projectRecord.get("s2").properties,
        projectRecord.get("s3").properties,
      ];
      session.close();
      return { project, sections };
    } catch (err) {
      console.log(err);
    } finally {
      session.close();
    }
  }

  // static async deleteProject (email) {
  //   const session = getSession();

  //   try {
  //     const result = await session.run(
  //       'MATCH (p:Project {id: $projectId}) DETACH DELETE, '
  //     )
  //   } catch(err) {

  //   }
  // }
}
