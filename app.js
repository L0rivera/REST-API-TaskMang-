import './Models/cron.js'; // Esto ejecuta el cron job cuando se arranca la aplicación

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
import { Notificacionrouter } from './Routes/notification-routes.js';

// Model
import { TaskModel } from "./Models/task.js";
import { SectionModel } from './Models/section.js';

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

// Invitations
app.use('/api', Invitationsrouter);

// Notifications
app.use('/api', Notificacionrouter);

// WEBSOCKET

// Add a Task
io.on('connection', (socket) => {
    console.log('New client connected');
    // Controlador para el evento de tarea creada
    socket.on('taskCreated', (data) => {
        // Emitir el evento a todos los clientes conectados
        io.emit('newTask', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Edit a Task
io.on('connection', (socket) => {
  socket.on('updateTask', async (data) => {
    const { taskId, title, description, startDate, dueDate, importance } = data;

    try {
      const updatedTask = await TaskModel.updateTask(taskId, { title, description, startDate, dueDate, importance });
      io.emit('taskUpdated', updatedTask);
    } catch (err) {
      console.error(`Error updating task: ${err.message}`);
      socket.emit('updateError', err.message);
    }
  });
});

// Delete a Task
io.on('connection', (socket) => {
    // Controlador para el evento de eliminación de tarea
    socket.on('deleteTask', async (data) => {
        const { taskId } = data;
        try {
            // Aquí debes llamar a la función que maneja la eliminación de tareas en tu modelo
            const result = await TaskModel.deleteTask(taskId);
            // Emitir un evento a todos los clientes conectados
            io.emit('taskDeleted', result );
        } catch (err) {
            console.error(`Error deleting task: ${err.message}`);
            io.emit('deleteError', err.message);
        }
    });
});

// Sort a Task
io.on('connection', (socket) => {
    console.log('New client connected');
    // Controlador para el evento de tarea creada
    socket.on('TaskSorted', (data) => {
        // Emitir el evento a todos los clientes conectados
        io.emit('newTasksort', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Add a Section
io.on('connection', (socket) => {
    console.log('New client connected');
    // Controlador para el evento de tarea creada
    socket.on('sectionCreated', (data) => {
        // Emitir el evento a todos los clientes conectados
        io.emit('newSection', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Sort a Section
io.on('connection', (socket) => {
  // Controlador para el evento de ordenación de secciones
  socket.on('sortSections', async (data) => {
    const { order, projectId } = data;
    try {
      // Aquí debes llamar a la función que maneja la reordenación de secciones en tu modelo
      const result = await SectionModel.SortSection(order, projectId);
      // Emitir un evento a todos los clientes conectados
      io.emit('sectionsSorted', result );
    } catch (err) {
      console.error(`Error sorting sections: ${err.message}`);
      socket.emit('sortError', err.message);
    }
  });
});

// PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});

export default app; // Exportar la aplicación Express como el módulo por defecto