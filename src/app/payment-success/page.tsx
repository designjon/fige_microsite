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
  const ref = searchParams?.get("ref");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!ref) {
        setError("Missing order reference.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkout_sessions/verify?ref=${ref}`);
        const data = await res.json() as ApiResponse;

        if (!res.ok) throw new Error("Could not verify payment.");
        if (!data.success || !data.order) throw new Error(data.message || "Verification failed.");

        setOrderDetails(data.order);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Unexpected error.");
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [ref]);

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
      ) : orderDetails && (
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">Pre-Order Confirmed!</h1>
          <p className="text-lg text-gray-300">
            Thank you {orderDetails.email} for your order.
          </p>
          <p className="text-lg text-gray-300">
            Product: {orderDetails.product}
          </p>
          <p className="text-lg text-gray-300">
            Total Paid: ${(orderDetails.amount / 100).toFixed(2)}
          </p>
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
    <main className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white p-8">
      <Suspense fallback={<p className="text-xl text-gray-400">Loading payment details...</p>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;