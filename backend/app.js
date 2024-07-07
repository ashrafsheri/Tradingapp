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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/trades", tradesRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"], 
    credentials: true, 
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

export { server, io };
