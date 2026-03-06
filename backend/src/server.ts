import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("join_chat", (chatId: string) => {
    socket.join(chatId);
  });

  socket.on(
    "send_message",
    async (payload: { chatId: string; senderId: string; message: string }) => {
      const msg = await prisma.message.create({
        data: {
          chatId: payload.chatId,
          senderId: payload.senderId,
          message: payload.message
        }
      });
      io.to(payload.chatId).emit("new_message", msg);
    }
  );
});

httpServer.listen(env.BACKEND_PORT, () => {
  console.log(`CampusHub backend running on http://localhost:${env.BACKEND_PORT}`);
});
