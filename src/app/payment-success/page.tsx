// src/app/payment-success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
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

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
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
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1 style={{ color: 'red' }}>Payment Verification Failed</h1>
        <p>{error}</p>
        <Link href="/">Return to Homepage</Link>
      </div>
    );
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <h1>Pre-Order Confirmed!</h1>
      <p>Thank you! Order confirmation sent to {orderDetails.email}</p>
      <p>Product: {orderDetails.product}</p>
      <p>Total Paid: ${(orderDetails.amount / 100).toFixed(2)}</p>
      
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#333',
        wordBreak: 'break-all'
      }}>
        <p>Your Stripe Session ID:</p>
        <code style={{
          display: 'block',
          padding: '10px',
          backgroundColor: '#222',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap'
        }}>{sessionId}</code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/" style={{ color: '#B48A6F' }}>Return to Homepage</Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}