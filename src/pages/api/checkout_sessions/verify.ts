import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ 
      success: false,
      message: "Missing session ID." 
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product', 'customer_details']
    });

    // Return only the essential data, no sensitive information
    const productName = session.line_items?.data[0]?.price?.product;
    const formattedProductName = typeof productName === 'object' && 'name' in productName ? 
      productName.name.replace("##", "#") : 
      "Figé Spinner";

    const orderDetails = {
      success: true,
      order: {
        email: session.customer_details?.email,
        amount: session.amount_total,
        product: formattedProductName
      }
    };

    return res.status(200).json(orderDetails);
  } catch (error: any) {
    console.error("❌ Stripe session fetch failed:", error.message);
    return res.status(500).json({ 
      success: false,
      message: "There was a problem verifying your payment. Please contact support if the charge appears on your statement." 
    });
  }
}