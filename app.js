import express from "express";
import { Server } from 'socket.io';
import { createServer } from "node:http";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Middlewares
// import authenticateToken from "./lib/AuthenticateToken.js";

// Routes
import { Usersrouter } from "./Routes/user-routes.js";
import { Projectsrouter } from "./Routes/project-routes.js";
import { Sectionrouter } from "./Routes/section-routes.js";
import { Taskrouter } from "./Routes/task-routes.js";
import { Invitationsrouter } from "./Routes/invitation-routes.js";

// Model
import { TaskModel } from "./Models/task.js";

const _dirname = path.dirname(fileURLToPath(import.meta.url));
export const methodsDir = {
  _dirname,
};

// Configuración de CORS 
const corsOptions = {
    origin: 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

//Server
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});
//Configuration to read
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json()); // Para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear datos de formulario
app.use(cookieParser());

//ENDPOINTS

// Users
app.use('/api', Usersrouter);

// Projects
app.use('/api', Projectsrouter);

// Sections
app.use('/api', Sectionrouter);

// Tasks
app.use('/api', Taskrouter);

app.use('/api', Invitationsrouter);

// WEBSOCKET

// Edit a Task
io.on('connection', (socket) => {
  socket.on('updateTask', async (data) => {
    const { taskId, title, description, startDate, dueDate, importance } = data;

    try {
      const updatedTask = await TaskModel.updateTask(taskId, { title, description, startDate, dueDate, importance });
      socket.emit('taskUpdated', updatedTask);
    } catch (err) {
      console.error(`Error updating task: ${err.message}`);
      socket.emit('updateError', err.message);
    }
  });
});


// PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});

export default app; // Exportar la aplicación Express como el módulo por defecto