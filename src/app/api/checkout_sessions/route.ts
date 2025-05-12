import { NextRequest } from "next/server";
import Stripe from "stripe";
import { cookies } from 'next/headers';
import { encrypt } from '../../../utils/encryption';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  console.log("➡️ Received POST request to create Stripe session");

  try {
    const { unitId }: { unitId: string } = await req.json();
    console.log("📦 unitId from request body:", unitId);

    // Create a unique reference ID
    const clientReferenceId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Figé Spinner ${unitId}`,
            },
            unit_amount: 50000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?ref=${clientReferenceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment-cancelled=true`,
      client_reference_id: clientReferenceId,
      metadata: {
        unitId,
      },
    });

    try {
      // Attempt to encrypt and store the session ID in a cookie
      const encryptedSessionId = await encrypt(session.id);
      const cookieStore = cookies();
      cookieStore.set('stripe_session', encryptedSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        maxAge: 3600, // 1 hour
        path: '/'
      });
    } catch (cookieError) {
      // Log the cookie error but don't fail the request
      console.error("Failed to set cookie:", cookieError);
    }

    // Always return the session ID for the redirect
    return Response.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("🔥 Stripe session creation failed:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to create checkout session",
      details: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}