// src/app/payment-success/page.tsx
"use client";

import React, { useEffect, useState, Suspense, CSSProperties } from "react";
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

const containerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '32rem',
  margin: '0 auto',
  padding: '1rem',
} as const;

const headingStyle: CSSProperties = {
  fontSize: '2.25rem',
  lineHeight: '2.5rem',
  color: 'white',
  marginBottom: '1rem',
  fontFamily: 'serif',
} as const;

const textStyle: CSSProperties = {
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  color: '#D1D5DB',
  marginBottom: '0.5rem',
} as const;

const sessionIdContainerStyle: CSSProperties = {
  marginTop: '1.5rem',
  backgroundColor: 'rgba(31, 41, 55, 0.5)',
  padding: '1rem',
  borderRadius: '0.5rem',
  width: '100%',
} as const;

const sessionIdLabelStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#9CA3AF',
  marginBottom: '0.5rem',
} as const;

const sessionIdStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '0.75rem',
  color: '#6B7280',
  backgroundColor: 'rgba(17, 24, 39, 0.5)',
  padding: '0.5rem',
  borderRadius: '0.25rem',
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
  width: '100%',
  overflowWrap: 'break-word',
  WebkitUserSelect: 'all',
  userSelect: 'all',
} as const;

const linkStyle: CSSProperties = {
  display: 'inline-block',
  marginTop: '2rem',
  fontSize: '1.125rem',
  color: '#B48A6F',
  textDecoration: 'none',
} as const;

const mainContainerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: 'linear-gradient(to bottom, #000000, #1a1a1a, #333333)',
  color: 'white',
  padding: '2rem 1rem',
} as const;

const PaymentSuccessContent: React.FC = () => {
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

  return (
    <div style={containerStyle}>
      {isLoading ? (
        <p style={textStyle}>Verifying your payment...</p>
      ) : error ? (
        <>
          <h1 style={{...headingStyle, color: '#EF4444 !important'}}>Payment Verification Failed</h1>
          <p style={textStyle}>{error}</p>
          <Link href="/" style={linkStyle}>
            Return to Homepage
          </Link>
        </>
      ) : orderDetails && (
        <div>
          <h1 style={headingStyle}>Pre-Order Confirmed!</h1>
          <div>
            <p style={textStyle}>
              Thank you! Order confirmation sent to {orderDetails.email}
            </p>
            <p style={textStyle}>
              Product: {orderDetails.product}
            </p>
            <p style={textStyle}>
              Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
            </p>
          </div>
          
          <div style={sessionIdContainerStyle}>
            <p style={sessionIdLabelStyle}>Your Stripe Session ID:</p>
            <div>
              <p style={sessionIdStyle}>
                {sessionId}
              </p>
            </div>
          </div>

          <Link href="/" style={linkStyle}>
            Return to Homepage
          </Link>
        </div>
      )}
    </div>
  );
};

const PaymentSuccessPage: React.FC = () => {
  return (
    <main style={mainContainerStyle}>
      <Suspense fallback={<p style={textStyle}>Loading payment details...</p>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;