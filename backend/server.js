import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import usersRoute from "./routes/users.js";

dotenv.config();
const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Backend working fine!" }));

app.use("/api/users", usersRoute);

// HTTP + socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } });

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  socket.on("disconnect", () => console.log("socket disconnected:", socket.id));
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
