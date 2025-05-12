// src/app/payment-success/page.tsx
"use client";

import React, { Suspense } from 'react';
import PaymentContent from './PaymentContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '30px',
          backgroundColor: '#000000',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}