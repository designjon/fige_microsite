"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  email: string;
  amount: number;
  product: string;
}

interface ApiResponse {
  success: boolean;
  order?: OrderDetails;
  message?: string;
}

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setError("Missing session ID.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkout_sessions/verify?session_id=${sessionId}`);
        const data = await res.json() as ApiResponse;

        if (!res.ok) throw new Error(data.message || "Could not verify payment.");
        if (!data.success || !data.order) throw new Error(data.message || "Verification failed.");

        setOrderDetails(data.order);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message || "There was a problem verifying your payment. Please contact support if the charge appears on your statement.");
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  const containerClasses = "w-full max-w-2xl mx-auto px-6 py-12 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl";
  const headingClasses = "text-5xl mb-8 font-serif bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent";
  const textClasses = "text-xl mb-6 text-gray-300";
  const linkClasses = "mt-8 inline-block px-8 py-3 bg-amber-700/20 hover:bg-amber-700/30 text-amber-300 rounded-full transition-all duration-300 border border-amber-700/50";
  const sessionIdClasses = "mt-8 p-6 bg-black/50 rounded-lg border border-gray-800 font-mono text-sm text-gray-400 break-all";

  if (isLoading) {
    return <div className={containerClasses}><p className={textClasses}>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <h1 className={headingClasses}>Payment Verification Failed</h1>
        <p className={textClasses}>{error}</p>
        <Link href="/" className={linkClasses}>Return to Homepage</Link>
      </div>
    );
  }

  if (!orderDetails) {
    return <div className={containerClasses}><p className={textClasses}>No order details found.</p></div>;
  }

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Pre-Order Confirmed!</h1>
      
      <p className={textClasses}>
        Thank you! Order confirmation sent to {orderDetails.email}
      </p>
      
      <p className={textClasses}>
        Product: {orderDetails.product}
      </p>
      
      <p className={textClasses}>
        Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
      </p>

      <div className={sessionIdClasses}>
        <p className="mb-2 text-gray-500">Your Stripe Session ID:</p>
        <code>{sessionId}</code>
      </div>

      <Link href="/" className={linkClasses}>
        Return to Homepage
      </Link>
    </div>
  );
}