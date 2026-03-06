import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { signToken } from "../../utils/jwt";
import { validate } from "../../middleware/validate";
import { authGuard } from "../../middleware/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  university: z.string().min(2),
  role: z.enum(["student", "business"]).default("student")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const resetSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8)
});

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password, university, role } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, university, role }
  });

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ token, user: { ...user, password: undefined } });
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user: { ...user, password: undefined } });
});

authRouter.post("/reset-password", validate(resetSchema), async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  res.json({ message: "Password reset successfully" });
});

authRouter.get("/me", authGuard, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ ...user, password: undefined });
});
