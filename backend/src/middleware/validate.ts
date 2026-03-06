import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, pick: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[pick]);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation failed", issues: parsed.error.issues });
      return;
    }
    (req as any)[pick] = parsed.data;
    next();
  };
}
