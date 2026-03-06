import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

type Env = {
  NODE_ENV: string;
  BACKEND_PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_ORIGIN: string;
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  PLATFORM_COMMISSION_RATE: number;
};

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  BACKEND_PORT: Number(process.env.BACKEND_PORT ?? 8080),
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  PLATFORM_COMMISSION_RATE: Number(process.env.PLATFORM_COMMISSION_RATE ?? 0.1)
};

if (!env.DATABASE_URL || !env.JWT_SECRET) {
  console.warn("Missing DATABASE_URL or JWT_SECRET in environment.");
}
