import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const itemSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.number().nonnegative(),
  category: z.string().min(2),
  images: z.array(z.string().url()).default([]),
  university: z.string().min(2),
  status: z.enum(["available", "sold", "reserved"]).default("available")
});

export const itemsRouter = Router();

itemsRouter.get("/", async (_req, res) => {
  const items = await prisma.item.findMany({ include: { seller: true } });
  res.json(items);
});

itemsRouter.post("/", authGuard, validate(itemSchema), async (req, res) => {
  const item = await prisma.item.create({ data: { ...req.body, sellerId: req.user!.userId } });
  res.status(201).json(item);
});

itemsRouter.patch("/:id", authGuard, async (req, res) => {
  const itemId = String(req.params.id);
  const item = await prisma.item.updateMany({
    where: { id: itemId, sellerId: req.user!.userId },
    data: req.body
  });
  res.json(item);
});
