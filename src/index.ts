import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { UserRoutes } from "./routers/userRoute";
import { EventRoutes } from "./routers/eventRoute";
import { CategoryRoutes } from "./routers/categoryRoute";
dotenv.config();
import { Server } from 'socket.io';
import {  MessageRoutes } from "./routers/messageRoute";
import { GroupRoutes } from "./routers/groupRoute";
import http from 'http';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('send-message', (data) => {
    console.log(data);
    io.emit('new-message', data);
  });
});


app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization,multipart/form-data"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const userRoutes = new UserRoutes();
const eventRoutes = new EventRoutes();
const categoryRoutes = new CategoryRoutes();
const messageRoutes = new MessageRoutes();
const groupRoutes = new GroupRoutes();

app.use("/api/users", userRoutes.router);
app.use("/api/categories", categoryRoutes.router);
app.use("/api/events", eventRoutes.router);
app.use("/api/messages", messageRoutes.router);
app.use("/api/groups", groupRoutes.router);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});