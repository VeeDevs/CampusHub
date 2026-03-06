import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  university: z.string().min(2).optional(),
  avatar: z.string().url().optional()
});

export const usersRouter = Router();

usersRouter.patch("/profile", authGuard, validate(updateSchema), async (req, res) => {
  const updated = await prisma.user.update({
    where: { id: req.user!.userId },
    data: req.body
  });
  res.json({ ...updated, password: undefined });
});

usersRouter.post("/logout", authGuard, (_req, res) => {
  res.json({ message: "Logged out. Discard token on client." });
});
