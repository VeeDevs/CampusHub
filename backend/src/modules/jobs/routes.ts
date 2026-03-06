import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authGuard, roleGuard } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const jobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  description: z.string().min(10),
  pay: z.number().nonnegative(),
  location: z.string().min(2),
  type: z.enum(["part_time", "full_time", "internship", "gig"])
});

export const jobsRouter = Router();

jobsRouter.get("/", async (_req, res) => {
  const jobs = await prisma.job.findMany({ include: { poster: true } });
  res.json(jobs);
});

jobsRouter.post("/", authGuard, roleGuard(["business", "admin"]), validate(jobSchema), async (req, res) => {
  const job = await prisma.job.create({ data: { ...req.body, postedBy: req.user!.userId } });
  res.status(201).json(job);
});

jobsRouter.post("/:id/apply", authGuard, roleGuard(["student"]), async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  const app = await prisma.application.create({
    data: {
      jobId: job.id,
      studentId: req.user!.userId,
      resumeUrl: String(req.body.resumeUrl ?? "https://example-storage.local/resume.pdf"),
      status: "pending"
    }
  });
  await prisma.notification.create({
    data: {
      userId: job.postedBy,
      type: "job_application",
      content: `New application received for ${job.title}`
    }
  });
  res.status(201).json(app);
});
