import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/routes";
import { usersRouter } from "./modules/users/routes";
import { servicesRouter } from "./modules/services/routes";
import { notesRouter } from "./modules/notes/routes";
import { jobsRouter } from "./modules/jobs/routes";
import { itemsRouter } from "./modules/items/routes";
import { chatRouter } from "./modules/chat/routes";
import { feedRouter } from "./modules/feed/routes";
import { dealsRouter } from "./modules/deals/routes";
import { adminRouter } from "./modules/admin/routes";
import { searchRouter } from "./modules/search/routes";
import { notificationsRouter } from "./modules/notifications/routes";
import { paymentsRouter } from "./modules/payments/routes";
import { aiRouter } from "./modules/ai/routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json({ limit: "5mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", name: "campushub-backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/services", servicesRouter);
app.use("/api/notes", notesRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/items", itemsRouter);
app.use("/api/chats", chatRouter);
app.use("/api/feed", feedRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/search", searchRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/ai", aiRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
