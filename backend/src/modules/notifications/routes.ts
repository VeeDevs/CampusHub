import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";

export const notificationsRouter = Router();

notificationsRouter.get("/", authGuard, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(notifications);
});

notificationsRouter.patch("/:id/read", authGuard, async (req, res) => {
  const updated = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user!.userId },
    data: { read: true }
  });
  res.json(updated);
});
