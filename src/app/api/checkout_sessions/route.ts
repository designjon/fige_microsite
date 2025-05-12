import { useSearchParams } from "next/navigation";
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

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Payment Success</h1>
      <p className="text-lg mb-4">
        Thank you {customerEmail ? <strong>{customerEmail}</strong> : ""} for your order.
      </p>
    </main>
  );
}