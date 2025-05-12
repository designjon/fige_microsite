"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from './payment-success.module.css';

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

  if (isLoading) {
    return <div className={styles.paymentSuccessContainer}><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.paymentSuccessContainer}>
        <h1>Payment Verification Failed</h1>
        <p>{error}</p>
        <Link href="/">Return to Homepage</Link>
      </div>
    );
  }

  if (!orderDetails) {
    return <div className={styles.paymentSuccessContainer}><p>No order details found.</p></div>;
  }

  return (
    <div className={styles.paymentSuccessContainer}>
      <h1>Pre-Order Confirmed!</h1>
      
      <p>
        Thank you! Order confirmation sent to {orderDetails.email}
      </p>
      
      <p>
        Product: {orderDetails.product}
      </p>
      
      <p>
        Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
      </p>

      <div>
        <p>Your Stripe Session ID:</p>
        <code>{sessionId}</code>
      </div>

      <Link href="/">
        Return to Homepage
      </Link>
    </div>
  );
}