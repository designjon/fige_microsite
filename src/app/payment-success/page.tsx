// src/app/payment-success/page.tsx
"use client";

import React, { Suspense } from 'react';
import PaymentContent from './PaymentContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}