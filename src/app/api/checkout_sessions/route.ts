import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout_sessions/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setCustomerEmail(data.customer_email);
        });
    }
  }, [sessionId]);

  return new Response("OK");
}