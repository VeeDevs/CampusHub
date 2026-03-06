import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authGuard, roleGuard } from "../../middleware/auth";

export const dealsRouter = Router();

dealsRouter.get("/", async (_req, res) => {
  const deals = await prisma.deal.findMany({ where: { expiryDate: { gte: new Date() } } });
  res.json(deals);
});

dealsRouter.post("/", authGuard, roleGuard(["business", "admin"]), async (req, res) => {
  const deal = await prisma.deal.create({
    data: {
      businessName: String(req.body.businessName),
      title: String(req.body.title),
      description: String(req.body.description),
      discount: String(req.body.discount),
      location: String(req.body.location),
      expiryDate: new Date(req.body.expiryDate)
    }
  });
  res.status(201).json(deal);
});
