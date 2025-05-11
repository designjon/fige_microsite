// src/app/api/checkout_sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key
// Ensure STRIPE_SECRET_KEY is set in your environment variables
console.log("Loaded Stripe key:", process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20", // Use the latest API version
  typescript: true,
});

const FIGE_PRICE_USD_CENTS = 500 * 100; // $500.00
const CURRENCY = "usd";

export async function POST(req: NextRequest) {
  try {
    // For simplicity, we assume a fixed price and product.
    // In a real application, you might fetch product details based on request body.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Figé Luxury Fidget Spinner (Pre-Order)",
              description: "Limited run, numbered unit. Carbon-fiber PLA, brass bearings, brass inlay.",
              // Add an image URL if desired
              // images: [`${req.headers.get("origin")}/images/preorder_coin.png`],
            },
            unit_amount: FIGE_PRICE_USD_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Use 'payment' for one-time purchases
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/?payment-cancelled=true`,
      // Consider adding metadata like user ID if applicable
      // metadata: { userId: "..." }
      // Limit quantity if needed, though handled by limited run logic elsewhere
    });

    // Return the session ID to the client
    return NextResponse.json({ sessionId: session.id });

  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    // Return an error response
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

