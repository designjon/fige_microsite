// src/app/payment-success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PaymentSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError("Missing session ID.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkout_sessions/verify?session_id=${sessionId}`);
        const data: { session: any } = await res.json();

        if (!res.ok) throw new Error("Could not verify payment.");

        setSessionData(data.session);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Unexpected error.");
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const customerEmail = sessionData?.customer_details?.email;
  const productName = sessionData?.line_items?.data?.[0]?.price?.product?.name;
  const amountTotal = sessionData?.amount_total;
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
          <p className="text-lg text-gray-300 mb-2">
            Thank you <strong>{customerEmail}</strong> for your order.
          </p>
          <p className="text-lg text-gray-300 mb-2">
            Product: {productName?.replace("##", "#") || "Spinner"}
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Total Paid: {amountTotal ? `$${(amountTotal / 100).toFixed(2)}` : "—"}
          </p>
          <Link href="/" className="text-lg" style={{ color: brassColor }}>
            Return to Homepage
          </Link>
        </>
      )}
    </div>
  );
};

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