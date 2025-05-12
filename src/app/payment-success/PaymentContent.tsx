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

  const containerClasses = "max-w-[600px] mx-auto my-10 p-8 bg-red-500 text-green-400 rounded-lg shadow-lg border-4 border-blue-500 relative z-50";
  const headingClasses = "text-4xl mb-6 text-center text-yellow-300 font-bold";
  const textClasses = "text-lg mb-4 text-green-400";
  const linkClasses = "block mt-6 text-fuchsia-400 text-center no-underline hover:text-fuchsia-300";

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

      <div className="mt-6 mb-6 p-4 bg-gray-800 rounded">
        <p className={textClasses}>Your Stripe Session ID:</p>
        <code className="text-sm font-mono text-gray-400">{sessionId}</code>
      </div>

      <Link href="/" className={linkClasses}>
        Return to Homepage
      </Link>
    </div>
  );
}