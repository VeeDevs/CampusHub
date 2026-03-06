import { Router } from "express";
import { prisma } from "../../config/prisma";

export const searchRouter = Router();

searchRouter.get("/", async (req, res) => {
  const q = String(req.query.q ?? "");
  const category = req.query.category ? String(req.query.category) : undefined;
  const university = req.query.university ? String(req.query.university) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  const [services, items, notes, jobs] = await Promise.all([
    prisma.service.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(category ? { category } : {}),
        ...(university ? { university } : {}),
        ...(maxPrice ? { price: { lte: maxPrice } } : {})
      }
    }),
    prisma.item.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(category ? { category } : {}),
        ...(university ? { university } : {}),
        ...(maxPrice ? { price: { lte: maxPrice } } : {})
      }
    }),
    prisma.note.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(university ? { university } : {}),
        ...(maxPrice ? { price: { lte: maxPrice } } : {})
      }
    }),
    prisma.job.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(category ? { type: category as any } : {})
      }
    })
  ]);

  res.json({ services, items, notes, jobs });
});
