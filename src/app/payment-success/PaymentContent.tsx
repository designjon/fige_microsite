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
  console.log('PaymentContent rendering');

  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    console.log('PaymentContent mounted');
    
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

  useEffect(() => {
    console.log('State updated:', { isLoading, error, orderDetails });
  }, [isLoading, error, orderDetails]);

  const Content = () => {
    if (isLoading) {
      return <p className="text-lg text-gray-300">Loading...</p>;
    }

    if (error) {
      return (
        <>
          <h1 className="text-4xl font-serif mb-8 text-red-400">Payment Verification Failed</h1>
          <p className="text-lg text-gray-300 mb-6">{error}</p>
        </>
      );
    }

    if (!orderDetails) {
      return <p className="text-lg text-gray-300">No order details found.</p>;
    }

    return (
      <>
        <h1 className="text-4xl font-serif mb-8 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
          Pre-Order Confirmed!
        </h1>
        
        <p className="text-lg text-gray-300 mb-6">
          Thank you! Order confirmation sent to {orderDetails.email}
        </p>
        
        <p className="text-lg text-gray-300 mb-6">
          Product: {orderDetails.product}
        </p>
        
        <p className="text-lg text-gray-300 mb-6">
          Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
        </p>

        <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-500 mb-2">Your Stripe Session ID:</p>
          <code className="text-xs font-mono text-gray-400 break-all">{sessionId}</code>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800/50 shadow-2xl">
        <Content />
        <Link 
          href="/" 
          className="mt-8 inline-block px-6 py-3 bg-amber-900/20 hover:bg-amber-900/30 text-amber-300 rounded-full transition-all duration-300 border border-amber-700/50"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}