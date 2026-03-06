import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const upload = multer({ storage: multer.memoryStorage() });
const noteSchema = z.object({
  title: z.string().min(2),
  course: z.string().min(2),
  university: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  fileUrl: z.string().url().optional().or(z.literal(""))
});

export const notesRouter = Router();

notesRouter.get("/", async (_req, res) => {
  const notes = await prisma.note.findMany({ include: { uploader: true } });
  res.json(notes);
});

notesRouter.post("/", authGuard, upload.single("file"), validate(noteSchema), async (req, res) => {
  const fileUrl = req.body.fileUrl || `https://example-storage.local/notes/${Date.now()}.pdf`;
  const note = await prisma.note.create({
    data: {
      title: req.body.title,
      course: req.body.course,
      university: req.body.university,
      price: req.body.price,
      fileUrl,
      uploaderId: req.user!.userId
    }
  });
  res.status(201).json(note);
});

notesRouter.post("/:id/purchase", authGuard, async (req, res) => {
  const noteId = String(req.params.id);
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) {
    res.status(404).json({ message: "Note not found" });
    return;
  }

  const purchase = await prisma.notePurchase.create({
    data: { noteId: note.id, buyerId: req.user!.userId }
  });
  await prisma.note.update({ where: { id: note.id }, data: { downloads: { increment: 1 } } });
  await prisma.notification.create({
    data: {
      userId: note.uploaderId,
      type: "note_purchase",
      content: `Your note ${note.title} was purchased`
    }
  });
  res.status(201).json(purchase);
});

notesRouter.get("/:id/download", authGuard, async (req, res) => {
  const noteId = String(req.params.id);
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) {
    res.status(404).json({ message: "Note not found" });
    return;
  }
  res.json({ fileUrl: note.fileUrl });
});

notesRouter.post("/:id/ratings", authGuard, async (req, res) => {
  const noteId = String(req.params.id);
  const rating = await prisma.noteRating.create({
    data: {
      noteId,
      studentId: req.user!.userId,
      rating: Number(req.body.rating ?? 5),
      comment: String(req.body.comment ?? "")
    }
  });
  res.status(201).json(rating);
});
