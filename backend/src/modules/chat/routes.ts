import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";

export const chatRouter = Router();

chatRouter.get("/", authGuard, async (req, res) => {
  const chats = await prisma.chat.findMany({
    where: { participants: { some: { userId: req.user!.userId } } },
    include: { participants: { include: { user: true } }, messages: true }
  });
  res.json(chats);
});

chatRouter.post("/", authGuard, async (req, res) => {
  const participantIds: string[] = req.body.participantIds ?? [];
  const uniqueParticipantIds = Array.from(new Set([req.user!.userId, ...participantIds]));

  const chat = await prisma.chat.create({
    data: {
      participants: {
        create: uniqueParticipantIds.map((userId) => ({ userId }))
      }
    },
    include: { participants: true }
  });

  res.status(201).json(chat);
});

chatRouter.post("/:chatId/messages", authGuard, async (req, res) => {
  const participant = await prisma.chatParticipant.findUnique({
    where: { chatId_userId: { chatId: req.params.chatId, userId: req.user!.userId } }
  });

  if (!participant) {
    res.status(403).json({ message: "You are not a participant of this chat" });
    return;
  }

  const message = await prisma.message.create({
    data: {
      chatId: req.params.chatId,
      senderId: req.user!.userId,
      message: String(req.body.message ?? "")
    }
  });
  res.status(201).json(message);
});
