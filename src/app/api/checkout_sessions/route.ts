// src/app/payment-success/page.tsx
"use client";

import { useEffect, useState } from "react";

interface SessionData {
  amount_total: number;
  metadata?: {
    unitId?: string;
  };
}

export default function PaymentSuccessPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${sessionId}`);
        const data = await res.json();
        setSessionData(data);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!sessionData) {
    return <p>Session not found.</p>;
  }

  const amountTotal = sessionData?.amount_total;
  const unitId = sessionData?.metadata?.unitId;

  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p className="text-lg text-gray-300 mb-2">
        Reserved Unit: Figé {unitId}
      </p>
      <p>Total Paid: ${(amountTotal ?? 0) / 100}</p>
    </div>
  );
}
