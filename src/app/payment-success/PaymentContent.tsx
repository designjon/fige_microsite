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
  console.log('PaymentContent rendering, styles:', styles);  // Debug log

  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    console.log('PaymentContent mounted');  // Debug log
    
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

  // Debug render state
  useEffect(() => {
    console.log('Current state:', { isLoading, error, orderDetails });
  }, [isLoading, error, orderDetails]);

  const mainContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' as const,
    background: 'linear-gradient(to bottom, #000000, #1a1a1a, #333333)',
    color: 'white',
    padding: '2rem 1rem',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '32rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const headingStyle = {
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    color: 'white',
    marginBottom: '1rem',
    fontFamily: 'serif',
  };

  const textStyle = {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    color: '#D1D5DB',
    marginBottom: '1rem',
  };

  const sessionIdContainerStyle = {
    marginTop: '1.5rem',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    padding: '1rem',
    borderRadius: '0.5rem',
  };

  const linkStyle = {
    display: 'inline-block',
    marginTop: '2rem',
    fontSize: '1.125rem',
    color: '#B48A6F',
    textDecoration: 'none',
  };

  if (isLoading) {
    return (
      <div style={mainContainerStyle}>
        <div style={containerStyle}>
          <p style={textStyle}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={mainContainerStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>Payment Verification Failed</h1>
          <p style={textStyle}>{error}</p>
          <Link href="/" style={linkStyle}>Return to Homepage</Link>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div style={mainContainerStyle}>
        <div style={containerStyle}>
          <p style={textStyle}>No order details found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
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

        <div style={sessionIdContainerStyle}>
          <p style={textStyle}>Your Stripe Session ID:</p>
          <code style={{ ...textStyle, fontFamily: 'monospace', fontSize: '0.875rem' }}>{sessionId}</code>
        </div>

        <Link href="/" style={linkStyle}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}