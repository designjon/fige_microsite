import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { decrypt } from "../../../utils/encryption";
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionCookie = req.cookies.stripe_session;

  if (!sessionCookie) {
    return res.status(400).json({ 
      success: false,
      message: "Unable to verify payment. Please contact support if you believe this is an error." 
    });
  }

  try {
    const session_id = await decrypt(sessionCookie);
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

    // Clear the session cookie after successful verification
    res.setHeader('Set-Cookie', 'stripe_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.status(200).json(orderDetails);
  } catch (error: any) {
    console.error("❌ Stripe session fetch failed:", error.message);
    return res.status(500).json({ 
      success: false,
      message: "There was a problem verifying your payment. Please contact support if the charge appears on your statement." 
    });
  }
}