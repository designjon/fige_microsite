import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref } = req.query;

  if (!ref || typeof ref !== "string") {
    return res.status(400).json({ message: "Missing order reference" });
  }

  try {
    // List recent sessions and find the one with matching reference ID
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const session = sessions.data.find(s => s.client_reference_id === ref);

    if (!session) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get full session details
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product', 'customer_details']
    });

    // Return only the essential data, no sensitive information
    const productName = fullSession.line_items?.data[0]?.price?.product;
    const formattedProductName = typeof productName === 'object' && 'name' in productName ? 
      productName.name.replace("##", "#") : 
      "Figé Spinner";

    const orderDetails = {
      success: true,
      order: {
        email: fullSession.customer_details?.email,
        amount: fullSession.amount_total,
        product: formattedProductName
      }
    };

    return res.status(200).json(orderDetails);
  } catch (error: any) {
    console.error("❌ Stripe session fetch failed:", error.message);
    res.status(500).json({ message: error.message });
  }
}