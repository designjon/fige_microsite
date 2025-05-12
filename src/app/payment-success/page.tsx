// src/app/payment-success/page.tsx
"use client";

import React, { Suspense } from 'react';
import PaymentContent from './PaymentContent';

export default function PaymentSuccessPage() {
  return (
    <div className="payment-success-page">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading...</p>
      </div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}