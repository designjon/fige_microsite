// src/app/payment-success/page.tsx
"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from './styles.module.css';

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
    return <p className={styles.text}>Loading...</p>;
  }

  if (error) {
    return (
      <>
        <h1 className={styles.heading} style={{ color: '#EF4444' }}>
          Payment Verification Failed
        </h1>
        <p className={styles.text}>{error}</p>
      </>
    );
  }

  if (!orderDetails) {
    return <p className={styles.text}>No order details found.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Pre-Order Confirmed!
      </h1>
      
      <p className={styles.text}>
        Thank you ({orderDetails.email}) for your order.
      </p>
      
      <p className={styles.text}>
        Product: {orderDetails.product}
      </p>
      
      <p className={styles.text}>
        Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
      </p>

      <div className={styles.sessionIdContainer}>
        <p className={styles.sessionIdLabel}>Your Stripe Session ID:</p>
        <code className={styles.sessionId}>{sessionId}</code>
      </div>

      <Link href="/" className={styles.link}>
        Return to Homepage
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  console.log('Payment Success Page rendering');
  
  return (
    <div className={styles.mainContainer}>
      <Suspense fallback={
        <div className={styles.mainContainer}>
          <p className={styles.text}>Loading...</p>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}