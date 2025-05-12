import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref, session_id } = req.query;

  // Handle both new and old parameters
  if (!ref && !session_id) {
    return res.status(400).json({ message: "Missing payment verification details" });
  }

  try {
    let session;

    // Prioritize session_id if available
    if (session_id && typeof session_id === 'string') {
      try {
        session = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ['line_items.data.price.product', 'customer_details']
        });
      } catch (error) {
        console.error("Failed to retrieve session by ID:", error);
        // If session_id fails, fall back to ref
        if (ref && typeof ref === 'string') {
          const sessions = await stripe.checkout.sessions.list({
            limit: 100,
          });

          const foundSession = sessions.data.find(s => s.client_reference_id === ref);
          if (!foundSession) {
            return res.status(404).json({ message: "Session not found" });
          }

          session = await stripe.checkout.sessions.retrieve(foundSession.id, {
            expand: ['line_items.data.price.product', 'customer_details']
          });
        } else {
          throw error;
        }
      }
    } else if (ref && typeof ref === 'string') {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
      });

      const foundSession = sessions.data.find(s => s.client_reference_id === ref);
      if (!foundSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      session = await stripe.checkout.sessions.retrieve(foundSession.id, {
        expand: ['line_items.data.price.product', 'customer_details']
      });
    } else {
      return res.status(400).json({ message: "Invalid payment verification details" });
    }

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