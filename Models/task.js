import { record } from "zod";
import { getSession } from "../config.js";
import { v4 as uuidv4 } from "uuid";

export class TaskModel {
  static async GetALL(projectId, sectionId) {
    const session = getSession();

    try {
      const result = await session.run(
        `
                 MATCH (p:Project {id: $projectId})-[:HAS_SECTION]->(ts:TaskState {id: $sectionId})
            MATCH (ts)-[:HAS_TASK]->(t:Task)
            RETURN t
                `,
        { projectId: projectId, sectionId: sectionId }
      );
      const tasks = result.records.map((record) => record.get("t").properties);
      return tasks;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }

  static async addTask(
    title,
    description,
    sectionId,
    importance,
    startdate,
    duedate
  ) {
    const session = getSession();
    const Taskid = uuidv4();
    try {
      const result = await session.run(
        `
            CREATE (t:Task {id: $Taskid, title: $title, description: $description, start_date: $startdate, due_date: $duedate, importance: $importance, order: 0}) WITH t
            MATCH (ts:TaskState {id: $sectionId})
            MERGE (ts)-[:HAS_TASK]->(t)
            RETURN t
            `,
        {
          Taskid: Taskid,
          title: title,
          description: description,
          sectionId: sectionId,
          startdate: startdate,
          duedate: duedate,
          importance: importance,
        }
      );

      const task = result.records.map((record) => record.get("t").properties);
      return task;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }
  static async detailsTask(taskId) {
    const session = getSession();
    try {
      let result = await session.run(`MATCH (t:Task {id: $taskId}) RETURN t`, {
        taskId: taskId,
      });
      let details = result.records.map((record) => record.get("t").properties);
      return details;
    } catch (err) {
      console.log(`Error: ${err}, Error message: ${err.message}`);
    } finally {
      session.close();
    }
  }

  static async updateTask(taskId, updates) {
    const session = getSession();
    const { title, description, startDate, dueDate, importance } = updates;

    // Construir la consulta dinámica
    const setClauses = [];
    if (title !== undefined) setClauses.push("t.title = $title");
    if (description !== undefined) setClauses.push("t.description = $description");
    if (startDate !== undefined) setClauses.push("t.start_date = $startDate");
    if (dueDate !== undefined) setClauses.push("t.due_date = $dueDate");
    if (importance !== undefined) setClauses.push("t.importance = $importance");

    const query = `
      MATCH (t:Task {id: $taskId})
      SET ${setClauses.join(", ")}
      RETURN t
    `;

    try {
      const result = await session.run(query, {
        taskId,
        title,
        description,
        startDate,
        dueDate,
        importance
      });

      if (result.records.length === 0) {
        throw new Error("Task not found");
      }

      return result.records[0].get("t");
    } catch (err) {
      console.error(`Error updating task: ${err.message}`);
      throw err;
    } finally {
      session.close();
    }
  }

  static async deleteTask(taskId) { 
    const session = getSession();
    try {
      const result = await session.run(
        `MATCH (t:Task {id: $taskId}) DETACH DELETE t`,
        { taskId: taskId }
      )
      return result;
    } catch(err) {
      console.error(`Error updating task: ${err.message}`);
      throw err;
    } finally {
      session.close();
    }
  }

  static async SortTask(order, sectionId) {
        const session = getSession();
        try {
            let result = await session.run(
                `UNWIND $order AS o
                 MATCH (ts:TaskState {id: $sectionId})-[:HAS_TASK]->(t:Task {id: o.id})
                 SET t.order = o.position
                 RETURN t.id, t.order`, 
                { sectionId: sectionId, order: order.map(({ id, position }) => ({ id, position }))}
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