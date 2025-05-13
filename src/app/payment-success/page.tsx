// src/app/payment-success/page.tsx
"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import Link from "next/link";

console.log('Payment Success Page loading');

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

function PaymentContent() {
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

  if (isLoading) {
    return <p className="text-gray-300 text-lg">Loading...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-red-500 text-4xl font-serif mb-4">
          Payment Verification Failed
        </h1>
        <p className="text-gray-300 text-lg">{error}</p>
      </div>
    );
  }

  if (!orderDetails) {
    return <p className="text-gray-300 text-lg">No order details found.</p>;
  }

  return (
    <div 
      style={{
        background: 'rgba(17, 24, 39, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      className="w-full max-w-2xl mx-auto p-8 rounded-2xl border border-gray-700/30 shadow-2xl"
    >
      <h1 
        style={{
          background: 'linear-gradient(to right, #fcd34d, #f59e0b, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        className="text-4xl font-serif mb-8 text-center"
      >
        Pre-Order Confirmed!
      </h1>
      
      <div className="space-y-4 text-center">
        <p className="text-gray-300 text-lg">
          Thank you <span className="font-bold">{orderDetails.email}</span> for your order.
        </p>
        
        <p className="text-gray-300 text-lg">
          Product: {orderDetails.product}
        </p>
        
        <p className="text-gray-300 text-lg">
          Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <Link 
          href="/" 
          style={{
            background: 'rgba(146, 64, 14, 0.2)',
            borderColor: 'rgba(217, 119, 6, 0.3)',
          }}
          className="inline-block text-lg text-amber-300 px-6 py-3 rounded-full border transition-colors hover:bg-amber-900/30 hover:text-amber-200"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  console.log('Payment Success Page rendering');
  
  return (
    <div 
      style={{
        background: 'linear-gradient(to bottom, #000000, #111827)',
      }}
      className="min-h-screen flex flex-col justify-center items-center p-4"
    >
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}