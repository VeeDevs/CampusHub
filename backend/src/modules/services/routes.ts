import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string().min(2),
  university: z.string().min(2)
});

export const servicesRouter = Router();

servicesRouter.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({ include: { seller: true } });
  res.json(services);
});

servicesRouter.post("/", authGuard, validate(serviceSchema), async (req, res) => {
  const created = await prisma.service.create({
    data: { ...req.body, sellerId: req.user!.userId }
  });
  res.status(201).json(created);
});

servicesRouter.patch("/:id", authGuard, async (req, res) => {
  const serviceId = String(req.params.id);
  const updated = await prisma.service.updateMany({
    where: { id: serviceId, sellerId: req.user!.userId },
    data: req.body
  });
  res.json(updated);
});

servicesRouter.delete("/:id", authGuard, async (req, res) => {
  const serviceId = String(req.params.id);
  await prisma.service.deleteMany({ where: { id: serviceId, sellerId: req.user!.userId } });
  res.status(204).send();
});

servicesRouter.post("/:id/book", authGuard, async (req, res) => {
  const serviceId = String(req.params.id);
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  const booking = await prisma.serviceBooking.create({
    data: { serviceId, studentId: req.user!.userId }
  });
  await prisma.notification.create({
    data: {
      userId: service.sellerId,
      type: "service_booking",
      content: `New booking for ${service.title}`
    }
  });
  res.status(201).json(booking);
});

servicesRouter.post("/:id/reviews", authGuard, async (req, res) => {
  const serviceId = String(req.params.id);
  const review = await prisma.serviceReview.create({
    data: {
      serviceId,
      studentId: req.user!.userId,
      rating: Number(req.body.rating ?? 5),
      comment: String(req.body.comment ?? "")
    }
  });
  res.status(201).json(review);
});
