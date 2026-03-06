import { Router } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { authGuard } from "../../middleware/auth";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export const paymentsRouter = Router();

paymentsRouter.post("/checkout", authGuard, async (req, res) => {
  const { sellerId, amount, type } = req.body as { sellerId: string; amount: number; type: string };

  const commission = amount * env.PLATFORM_COMMISSION_RATE;
  const netAmount = amount - commission;

  const tx = await prisma.transaction.create({
    data: {
      buyerId: req.user!.userId,
      sellerId,
      amount,
      type,
      status: stripe ? "pending" : "succeeded",
      platformFee: commission,
      sellerNet: netAmount
    }
  });

  if (!stripe) {
    res.json({ message: "Stripe not configured; recorded local transaction", transaction: tx });
    return;
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: { transactionId: tx.id, buyerId: req.user!.userId, sellerId }
  });

  res.json({ clientSecret: intent.client_secret, transaction: tx });
});

paymentsRouter.post("/:id/confirm", authGuard, async (req, res) => {
  const transactionId = String(req.params.id);
  const tx = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "succeeded" }
  });
  res.json(tx);
});
