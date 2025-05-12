"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from './styles.module.css';

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
      return <p className={styles.text}>Loading...</p>;
    }

    if (error) {
      return (
        <>
          <h1 className={styles.heading} style={{ color: '#EF4444' }}>Payment Verification Failed</h1>
          <p className={styles.text}>{error}</p>
        </>
      );
    }

    if (!orderDetails) {
      return <p className={styles.text}>No order details found.</p>;
    }

    return (
      <>
        <h1 className={styles.heading}>
          Pre-Order Confirmed!
        </h1>
        
        <p className={styles.text}>
          Thank you! Order confirmation sent to {orderDetails.email}
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
      </>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Content />
        <Link 
          href="/" 
          className={styles.link}
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}