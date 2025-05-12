import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});
// why is it no worky
export async function POST(req: NextRequest) {
  console.log("➡️ Received POST request to create Stripe session");

  try {
    const { unitId }: { unitId: string } = await req.json();
    console.log("📦 unitId from request body:", unitId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Figé Spinner #${unitId}`,
            },
            unit_amount: 50000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment-cancelled=true`,
      metadata: {
        unitId,
      },
    });

    return Response.json({ sessionId: session.id });
  } catch (error) {
    console.error("🔥 Stripe session creation failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}