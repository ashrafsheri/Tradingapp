// import express from 'express';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import offerRoutes from './routes/offerRouter.js';
// import tradesRoutes from './routes/tradeRoutes.js';
// import path from 'path';
// import multer from 'multer';
// import { fileURLToPath } from 'url';
// import { Server } from 'socket.io';
// import http from 'http';
// const app = express();

// // Correcting __dirname in an ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static file serving for uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/users', userRoutes);
// app.use('/api/offers', offerRoutes);
// app.use('/api/trades', tradesRoutes);

// export default app;

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import offerRoutes from "./routes/offerRouter.js";
import tradesRoutes from "./routes/tradeRoutes.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";

const app = express();

// Correcting __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend to access
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/trades", tradesRoutes);

// Create HTTP server and attach it to Express app
const server = http.createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend URL
    methods: ["GET", "POST"], // Allowed request methods
    credentials: true, // Allow cookies/socket session to be sent
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Example of joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Example of handling disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Additional socket.io event handling here
});

// Export server instead of app for listening
export { server, io };
