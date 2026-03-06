import { Router } from "express";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";

export const feedRouter = Router();

feedRouter.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true, comments: true }, orderBy: { createdAt: "desc" } });
  res.json(posts);
});

feedRouter.post("/", authGuard, async (req, res) => {
  const post = await prisma.post.create({
    data: {
      authorId: req.user!.userId,
      content: String(req.body.content ?? ""),
      image: req.body.image ? String(req.body.image) : null
    }
  });
  res.status(201).json(post);
});

feedRouter.post("/:id/comments", authGuard, async (req, res) => {
  const postId = String(req.params.id);
  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: req.user!.userId,
      text: String(req.body.text ?? "")
    }
  });
  res.status(201).json(comment);
});

feedRouter.post("/:id/like", authGuard, async (req, res) => {
  const postId = String(req.params.id);
  const existingLike = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId: req.user!.userId } }
  });

  if (existingLike) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    res.json(post);
    return;
  }

  await prisma.postLike.create({
    data: {
      postId,
      userId: req.user!.userId
    }
  });

  const post = await prisma.post.update({ where: { id: postId }, data: { likes: { increment: 1 } } });
  res.json(post);
});
