"use client";

import React from 'react';

export default function TestStylePage() {
  return (
    <div style={{
      backgroundColor: 'red',
      padding: '20px',
      margin: '20px',
      border: '5px solid blue'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '24px'
      }}>Test Style Page</h1>
      <p style={{
        color: 'yellow',
        marginTop: '10px'
      }}>This is a test paragraph</p>
    </div>
  );
} 