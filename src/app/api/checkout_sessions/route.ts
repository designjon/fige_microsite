import { NextRequest } from "next/server";
import Stripe from "stripe";
import { cookies } from 'next/headers';
import { encrypt } from '../../../utils/encryption';

// Log the environment variables (excluding sensitive data)
console.log("Environment check:", {
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Helper function to get the base URL
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback for development
  return 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
  console.log("➡️ Received POST request to create Stripe session");

  try {
    const { unitId }: { unitId: string } = await req.json();
    console.log("📦 unitId from request body:", unitId);

    // Create a unique reference ID
    const clientReferenceId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const baseUrl = getBaseUrl();
    console.log("Using base URL:", baseUrl);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
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
      mode: "payment" as const,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?payment-cancelled=true`,
      client_reference_id: clientReferenceId,
      metadata: {
        unitId,
      },
    };

    console.log("Creating session with config:", {
      ...sessionConfig,
      success_url: sessionConfig.success_url,
      cancel_url: sessionConfig.cancel_url
    });

    // Create and encrypt the session ID before creating the checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log("✅ Session created successfully:", { sessionId: session.id });

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
      console.log("✅ Cookie set successfully");
    } catch (cookieError) {
      // Log the cookie error but don't fail the request
      console.error("Failed to set cookie:", cookieError);
    }

    // Always return the session ID for the redirect
    return Response.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("🔥 Stripe session creation failed:", {
      error: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    
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