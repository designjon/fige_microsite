import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref } = req.query;

  if (!ref || typeof ref !== "string") {
    return res.status(400).json({ message: "Missing or invalid reference ID" });
  }

  try {
    // List recent sessions and find the one with matching reference ID
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const session = sessions.data.find(s => s.client_reference_id === ref);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Retrieve full session details
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product', 'customer_details']
    });

    // Only return the necessary fields
    const sanitizedSession = {
      customer_details: fullSession.customer_details,
      amount_total: fullSession.amount_total,
      line_items: fullSession.line_items?.data.map(item => ({
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