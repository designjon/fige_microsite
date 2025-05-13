import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ 
      success: false,
      message: "Missing session ID." 
    }, { status: 400 });
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

    return NextResponse.json(orderDetails);
  } catch (error: any) {
    console.error("❌ Stripe session fetch failed:", error.message);
    return NextResponse.json({ 
      success: false,
      message: "There was a problem verifying your payment. Please contact support if the charge appears on your statement." 
    }, { status: 500 });
  }
} 