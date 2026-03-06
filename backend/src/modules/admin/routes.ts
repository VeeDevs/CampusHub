import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authGuard, roleGuard } from "../../middleware/auth";

export const adminRouter = Router();

adminRouter.use(authGuard, roleGuard(["admin"]));

adminRouter.get("/analytics", async (_req, res) => {
  const [totalUsers, totalTransactions, itemCount, serviceCount, noteCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.item.count(),
    prisma.service.count(),
    prisma.note.count(),
    prisma.transaction.aggregate({ _sum: { amount: true } })
  ]);

  res.json({
    totalUsers,
    totalTransactions,
    marketplaceActivity: itemCount + serviceCount + noteCount,
    revenue: revenue._sum.amount ?? 0
  });
});

adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users.map((u) => ({ ...u, password: undefined })));
});

adminRouter.delete("/listings/:type/:id", async (req, res) => {
  const type = String(req.params.type);
  const id = String(req.params.id);
  if (type === "services") await prisma.service.delete({ where: { id } });
  else if (type === "items") await prisma.item.delete({ where: { id } });
  else if (type === "notes") await prisma.note.delete({ where: { id } });
  else {
    res.status(400).json({ message: "Invalid listing type" });
    return;
  }
  res.status(204).send();
});

adminRouter.delete("/posts/:id", async (req, res) => {
  const postId = String(req.params.id);
  await prisma.post.delete({ where: { id: postId } });
  res.status(204).send();
});
