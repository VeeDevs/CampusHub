import { Router } from "express";
import OpenAI from "openai";
import { env } from "../../config/env";
import { authGuard } from "../../middleware/auth";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

async function runAI(prompt: string): Promise<string> {
  if (!openai) {
    return "OpenAI key not configured. Add OPENAI_API_KEY in .env for live AI responses.";
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return completion.choices[0]?.message?.content ?? "No response";
}

export const aiRouter = Router();

aiRouter.post("/summarize", authGuard, async (req, res) => {
  const text = String(req.body.text ?? "");
  const output = await runAI(`Summarize these lecture notes for exam prep:\n\n${text}`);
  res.json({ summary: output });
});

aiRouter.post("/ask", authGuard, async (req, res) => {
  const question = String(req.body.question ?? "");
  const context = String(req.body.context ?? "");
  const answer = await runAI(`Use context to answer question.\nContext: ${context}\nQuestion: ${question}`);
  res.json({ answer });
});

aiRouter.post("/quiz", authGuard, async (req, res) => {
  const topic = String(req.body.topic ?? "General" );
  const quiz = await runAI(`Generate 5 short quiz questions with answers about ${topic}.`);
  res.json({ quiz });
});

aiRouter.post("/flashcards", authGuard, async (req, res) => {
  const topic = String(req.body.topic ?? "General");
  const flashcards = await runAI(`Create 10 flashcards (front/back) for ${topic}.`);
  res.json({ flashcards });
});

aiRouter.post("/study-plan", authGuard, async (req, res) => {
  const goals = String(req.body.goals ?? "Pass upcoming exams");
  const schedule = await runAI(`Create a weekly student study plan based on goals: ${goals}`);
  res.json({ studyPlan: schedule });
});
