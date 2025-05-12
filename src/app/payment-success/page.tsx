// src/app/payment-success/page.tsx
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

export default function PaymentSuccessPage() {
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

  const containerStyle = {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'serif'
  };

  const headingStyle = {
    fontSize: '36px',
    marginBottom: '24px',
    textAlign: 'center' as const,
    color: '#ffffff'
  };

  const textStyle = {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#cccccc'
  };

  const sessionIdStyle = {
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    marginTop: '24px',
    marginBottom: '24px',
    fontFamily: 'monospace',
    fontSize: '14px',
    wordBreak: 'break-all' as const,
    color: '#888888'
  };

  const linkStyle = {
    display: 'block',
    marginTop: '24px',
    color: '#B48A6F',
    textAlign: 'center' as const,
    textDecoration: 'none'
  };

  if (isLoading) {
    return <div style={containerStyle}><p style={textStyle}>Loading...</p></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={{...headingStyle, color: '#ff4444'}}>Payment Verification Failed</h1>
        <p style={textStyle}>{error}</p>
        <Link href="/" style={linkStyle}>Return to Homepage</Link>
      </div>
    );
  }

  if (!orderDetails) {
    return <div style={containerStyle}><p style={textStyle}>No order details found.</p></div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Pre-Order Confirmed!</h1>
      
      <p style={textStyle}>
        Thank you! Order confirmation sent to {orderDetails.email}
      </p>
      
      <p style={textStyle}>
        Product: {orderDetails.product}
      </p>
      
      <p style={textStyle}>
        Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
      </p>

      <div style={sessionIdStyle}>
        <p style={{marginBottom: '8px', color: '#666666'}}>Your Stripe Session ID:</p>
        <code>{sessionId}</code>
      </div>

      <Link href="/" style={linkStyle}>
        Return to Homepage
      </Link>
    </div>
  );
}