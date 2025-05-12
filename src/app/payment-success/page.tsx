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
  console.log('PaymentContent rendering - inline version');

  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    console.log('PaymentContent mounted - inline version');
    
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
    return <p style={{ color: '#D1D5DB' }}>Loading...</p>;
  }

  if (error) {
    return (
      <>
        <h1 style={{ color: '#EF4444', fontSize: '2.25rem', marginBottom: '1rem' }}>
          Payment Verification Failed
        </h1>
        <p style={{ color: '#D1D5DB' }}>{error}</p>
      </>
    );
  }

  if (!orderDetails) {
    return <p style={{ color: '#D1D5DB' }}>No order details found.</p>;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '32rem',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'rgba(17, 24, 39, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1rem',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}>
      <h1 style={{
        fontSize: '2.25rem',
        lineHeight: '2.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(to right, #FCD34D, #F59E0B, #D97706)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Pre-Order Confirmed!
      </h1>
      
      <p style={{ color: '#D1D5DB', marginBottom: '1rem', textAlign: 'center' }}>
        Thank you! Order confirmation sent to {orderDetails.email}
      </p>
      
      <p style={{ color: '#D1D5DB', marginBottom: '1rem', textAlign: 'center' }}>
        Product: {orderDetails.product}
      </p>
      
      <p style={{ color: '#D1D5DB', marginBottom: '1rem', textAlign: 'center' }}>
        Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
      </p>

      <div style={{
        marginTop: '2rem',
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(75, 85, 99, 0.2)'
      }}>
        <p style={{ color: '#9CA3AF', marginBottom: '0.75rem' }}>Your Stripe Session ID:</p>
        <code style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.75rem',
          color: '#D1D5DB',
          backgroundColor: 'rgba(17, 24, 39, 0.5)',
          padding: '1rem',
          borderRadius: '0.5rem',
          display: 'block',
          wordBreak: 'break-all',
          border: '1px solid rgba(75, 85, 99, 0.2)'
        }}>{sessionId}</code>
      </div>

      <Link 
        href="/" 
        style={{
          display: 'inline-block',
          marginTop: '2rem',
          fontSize: '1.125rem',
          color: '#FCD34D',
          textDecoration: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(146, 64, 14, 0.2)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        Return to Homepage
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  console.log('Payment Success Page rendering');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #000000, #111827)',
      padding: '2rem 1rem'
    }}>
      <Suspense fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #000000, #111827)',
          color: '#D1D5DB'
        }}>
          <p>Loading...</p>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}