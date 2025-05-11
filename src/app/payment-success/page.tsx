// src/app/payment-success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react"; // Import Suspense
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Component that uses useSearchParams
const PaymentSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified version without backend verification for now
  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session information.");
    }
    setIsLoading(false);
  }, [sessionId]);

  const brassColor = "#B48A6F";

  return (
    <div className="max-w-2xl mx-auto">
      {isLoading ? (
        <p className="text-xl text-gray-400">Verifying payment...</p>
      ) : error ? (
        <>
          <h1 className="text-3xl md:text-4xl font-serif text-red-500 mb-4">Payment Verification Failed</h1>
          <p className="text-lg text-gray-300 mb-6">{error}</p>
          <Link href="/" className="text-lg" style={{ color: brassColor }}>
            Return to Homepage
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">Pre-Order Confirmed!</h1>
          <p className="text-lg text-gray-300 mb-6">
            Thank you for securing your exclusive Figé spinner. You will receive further updates regarding manufacturing and shipping.
          </p>
          <p className="text-sm text-gray-400 mb-8">Your Stripe Session ID: {sessionId}</p>
          <Link href="/" className="text-lg" style={{ color: brassColor }}>
            Return to Homepage
          </Link>
        </>
      )}
    </div>
  );
};

// Main page component wraps the content in Suspense
const PaymentSuccessPage: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white p-8">
      <Suspense fallback={<p className="text-xl text-gray-400">Loading payment details...</p>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;

