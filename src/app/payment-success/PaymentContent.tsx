"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from './styles.module.css';

console.log('PaymentContent module loaded', { styles });

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
  console.log('PaymentContent rendering', { styles });

  // Log the actual class names being used
  useEffect(() => {
    console.log('Styles being applied:', {
      container: styles.container,
      heading: styles.heading,
      text: styles.text,
      mainContainer: styles.mainContainer
    });
    
    // Check if styles are actually in the DOM
    const styleSheets = Array.from(document.styleSheets);
    console.log('All stylesheets:', styleSheets.map(sheet => ({
      href: sheet.href,
      rules: Array.from(sheet.cssRules || []).map(rule => rule.cssText)
    })));
  }, []);

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

  // Test with both CSS Modules and inline styles
  const containerStyle = {
    width: '100%',
    maxWidth: '32rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const Content = () => {
    if (isLoading) {
      return <p className={styles.text} style={{ color: '#D1D5DB' }}>Loading...</p>;
    }

    if (error) {
      return (
        <>
          <h1 className={styles.heading} style={{ color: '#EF4444' }}>Payment Verification Failed</h1>
          <p className={styles.text} style={{ color: '#D1D5DB' }}>{error}</p>
        </>
      );
    }

    if (!orderDetails) {
      return <p className={styles.text} style={{ color: '#D1D5DB' }}>No order details found.</p>;
    }

    return (
      <>
        <h1 className={styles.heading} style={{
          background: 'linear-gradient(to right, #FCD34D, #F59E0B, #D97706)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Pre-Order Confirmed!
        </h1>
        
        <p className={styles.text} style={{ color: '#D1D5DB' }}>
          Thank you! Order confirmation sent to {orderDetails.email}
        </p>
        
        <p className={styles.text} style={{ color: '#D1D5DB' }}>
          Product: {orderDetails.product}
        </p>
        
        <p className={styles.text} style={{ color: '#D1D5DB' }}>
          Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
        </p>

        <div className={styles.sessionIdContainer} style={{
          marginTop: '2rem',
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(75, 85, 99, 0.2)'
        }}>
          <p className={styles.sessionIdLabel} style={{ color: '#9CA3AF' }}>Your Stripe Session ID:</p>
          <code className={styles.sessionId} style={{ color: '#D1D5DB' }}>{sessionId}</code>
        </div>
      </>
    );
  };

  return (
    <div className={styles.mainContainer} style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #000000, #111827)',
      padding: '2rem 1rem'
    }}>
      <div className={styles.container} style={containerStyle}>
        <Content />
        <Link 
          href="/" 
          className={styles.link}
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
    </div>
  );
}