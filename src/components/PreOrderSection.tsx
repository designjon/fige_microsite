// src/components/PreOrderSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { RevealWrapper, RevealList } from 'next-reveal'; // Added import

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PreOrderItemProps {
  unitNumber: number;
  status: "Sold" | "Pre-Order";
  imageUrl: string;
}

const PreOrderItem: React.FC<PreOrderItemProps> = ({ unitNumber, status, imageUrl }) => {
  const brassColor = "#AB9768"; // Updated brand color
  const whiteColor = "#FFFFFF";
  const isSold = status === "Sold";

  const handlePreOrderClick = async () => {
    if (isSold) return;

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unitId: `#${String(unitNumber).padStart(2, "0")}` }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = (await response.json()) as { sessionId: string };
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe checkout error:", error);
        // Handle error display to user if needed
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      // Handle error display to user if needed
    }
  };

  return (
    // RevealWrapper will be applied by RevealList in the parent component
    <div className={`border p-6 rounded-lg shadow-lg text-center ${isSold ? "border-gray-700 bg-gray-800 opacity-60" : "border-gray-600 bg-gray-800"}`}>
      <Image 
        src={imageUrl} 
        alt={`Figé Spinner Unit ${unitNumber}`} 
        width={150} 
        height={150} 
        className="mx-auto mb-4 rounded-full" 
      />
      {/* Updated to Figé #0X */}
      <h3 className="text-xl font-semibold mb-2" style={{ color: brassColor }}>Figé #{String(unitNumber).padStart(2, "0")}</h3> 
      {/* Removed Pre-Order status text, price moved above button */}
      {isSold ? (
         <p className={`text-lg mb-1 ${isSold ? "text-gray-500" : "text-white"}`}>{status}</p>
      ) : (
        <p className="text-lg font-semibold mb-1 text-white">$500</p> // Price made larger and moved
      )}
      {!isSold && (
        <button
          onClick={handlePreOrderClick}
          className="font-semibold py-2 px-6 border rounded-full transition duration-300 ease-in-out w-full mt-3"
          style={{ borderColor: brassColor, color: brassColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = brassColor;
            e.currentTarget.style.color = whiteColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = brassColor;
          }}
        >
          Pre-Order {/* Button text updated */}
        </button>
      )}
    </div>
  );
};

const PreOrderSection: React.FC = () => {
  const preOrderItems: PreOrderItemProps[] = [
    { unitNumber: 1, status: "Sold", imageUrl: "/images/01.png" },
    { unitNumber: 2, status: "Sold", imageUrl: "/images/02.png" },
    { unitNumber: 3, status: "Pre-Order", imageUrl: "/images/03.png" },
    { unitNumber: 4, status: "Pre-Order", imageUrl: "/images/04.png" },
    { unitNumber: 5, status: "Pre-Order", imageUrl: "/images/05.png" },
  ];

  return (
    <section id="preorder" className="py-16 px-4 md:px-8 bg-black text-gray-300">
      <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-10 text-center">Secure Your Exclusive Unit</h2>
        <RevealList 
          interval={100} 
          delay={500} 
          origin="bottom" 
          duration={1000} 
          distance="50px" 
          reset={true} 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {preOrderItems.map((item) => (
            <PreOrderItem key={item.unitNumber} {...item} />
          ))}
        </RevealList>
        <RevealWrapper origin="bottom" delay={800} duration={1000} distance="50px" reset={true}>
          <p className="text-center mt-10 text-gray-400">
            Units are strictly limited. Pre-order now to guarantee your place in this exclusive release.
          </p>
        </RevealWrapper>
      </RevealWrapper>
    </section>
  );
};

export default PreOrderSection;
