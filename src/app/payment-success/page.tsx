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

  const brassColor = "#B48A6F";

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
      {isLoading ? (
        <p className="text-xl text-gray-400">Verifying your payment...</p>
      ) : error ? (
        <>
          <h1 className="text-3xl md:text-4xl font-serif text-red-500 mb-4">Payment Verification Failed</h1>
          <p className="text-lg text-gray-300 mb-6">{error}</p>
          <Link href="/" className="text-lg" style={{ color: brassColor }}>
            Return to Homepage
          </Link>
        </>
      ) : orderDetails && (
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">Pre-Order Confirmed!</h1>
          <div className="space-y-3">
            <p className="text-lg text-gray-300 break-words">
              Thank you! Order confirmation sent to {orderDetails.email}
            </p>
            <p className="text-lg text-gray-300">
              Product: {orderDetails.product}
            </p>
            <p className="text-lg text-gray-300">
              Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
            </p>
          </div>
          
          <div className="mt-6 bg-gray-800/50 p-4 rounded-lg max-w-full">
            <p className="text-sm text-gray-400 mb-2">Your Stripe Session ID:</p>
            <div className="w-full overflow-hidden">
              <p className="text-xs text-gray-500 font-mono break-all whitespace-pre-wrap bg-gray-900/50 p-2 rounded select-all">
                {sessionId}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-lg" style={{ color: brassColor }}>
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentSuccessPage: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white py-8">
      <Suspense fallback={<p className="text-xl text-gray-400">Loading payment details...</p>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;