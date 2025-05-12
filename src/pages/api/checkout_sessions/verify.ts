import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ message: "Missing or invalid session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product', 'customer_details']
    });

    // Only return the necessary fields
    const sanitizedSession = {
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      line_items: session.line_items?.data.map(item => ({
        price: {
          product: {
            name: typeof item.price?.product === 'object' ? (item.price.product as Stripe.Product).name : undefined
          }
        }
      }))
    };

    return res.status(200).json({ session: sanitizedSession });
  } catch (error: any) {
    console.error("❌ Stripe session fetch failed:", error.message);
    res.status(500).json({ message: error.message });
  }
}