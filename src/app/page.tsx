"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PreOrderSection from "@/components/PreOrderSection";
import InteractiveLink from "@/components/InteractiveLink";
import { RevealWrapper } from "next-reveal";

const HeroSection: React.FC = () => {
  const brassColor = "#AB9768";
  const whiteColor = "#FFFFFF";
  const transparentColor = "transparent";

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white p-8 relative overflow-hidden w-full">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ objectPosition: "50% 40%" }}
      >
        <source src="/videos/hero_background_spin_dark_02_new.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div> 
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10"></div>
      <RevealWrapper 
        origin="bottom" 
        delay={200} 
        duration={1000} 
        distance="50px" 
        reset={true} 
        className="relative z-20 w-full"
      >
        <Image 
          src="/images/hero_logo_coin.png" 
          alt="Figé Brass Coin Logo" 
          width={180} 
          height={180} 
          className="mx-auto mb-4 rounded-full"
        /> 
        <h1 className="text-4xl md:text-6xl font-serif mb-4" style={{ color: brassColor }}>Figé</h1>
        <p className="text-xl md:text-3xl font-sans mb-8 text-gray-300">Elevate Your Focus. Command Your Presence.</p>
        <InteractiveLink
          href="#preorder" 
          className="mt-8 inline-block font-semibold py-2 px-6 border rounded-full transition duration-300 ease-in-out"
          style={{ borderColor: brassColor, color: brassColor }}
          hoverBackgroundColor={brassColor}
          hoverTextColor={whiteColor}
          hoverBorderColor={brassColor}
          initialBackgroundColor={transparentColor}
          initialTextColor={brassColor}
          initialBorderColor={brassColor}
        >
          Exclusive Access
        </InteractiveLink>
      </RevealWrapper>
    </section>
  );
};

const CraftsmanshipSection: React.FC = () => (
  <section id="craftsmanship" className="py-16 px-4 md:px-8 bg-gray-900 text-gray-300 w-full overflow-hidden">
    <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 text-center">The Art of Precision</h2>
      <p className="text-lg md:text-xl mb-8 font-sans text-center">
        Born from years of relentless refinement, Figé is the pinnacle of focus tool design. Its fidgetability knows no bounds—the crisp snap of brass ball bearings clicking into place, the play between asymmetric spins and balanced whirls, the satisfying feel of a perfect flick beneath your fingers. This is more than a spinner. It is a meditation on motion and a testament to craft.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <RevealWrapper origin="bottom" delay={300} duration={1000} distance="50px" reset={true} className="bg-gray-800 h-64 rounded-lg shadow-lg overflow-hidden relative group">
          <Image 
            src="/images/art_precision_new_center.jpg" 
            alt="Figé Spinner Standalone" 
            fill
            className="object-cover filter sepia-[.3] saturate-150 hue-rotate-[-10deg] brightness-105 contrast-105 transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
        </RevealWrapper>
        <RevealWrapper origin="bottom" delay={400} duration={1000} distance="50px" reset={true} className="bg-gray-800 h-64 rounded-lg shadow-lg overflow-hidden relative group">
          <Image 
            src="/images/art_precision_spinning.jpg" 
            alt="Figé Spinner in Motion" 
            fill
            className="object-cover filter sepia-[.3] saturate-150 hue-rotate-[-10deg] brightness-105 contrast-105 transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
        </RevealWrapper>
        <RevealWrapper origin="bottom" delay={500} duration={1000} distance="50px" reset={true} className="bg-gray-800 h-64 rounded-lg shadow-lg overflow-hidden relative group">
          <Image 
            src="/images/art_precision_green_spinner.jpg" 
            alt="Green Figé Spinner Detail" 
            fill
            className="object-cover filter sepia-[.3] saturate-150 hue-rotate-[-10deg] brightness-105 contrast-105 transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
        </RevealWrapper>
      </div>
    </RevealWrapper>
  </section>
);

const AboutTheCreatorSection: React.FC = () => (
  <section id="about-creator" className="py-16 px-4 md:px-8 bg-black text-gray-300 w-full overflow-hidden">
    <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-10 text-center">About the Creator</h2>
      <div className="md:flex md:items-start md:space-x-10">
        <div className="md:w-1/3 mb-8 md:mb-0">
          <RevealWrapper origin="left" delay={300} duration={1000} distance="50px" reset={true} className="rounded-lg shadow-lg overflow-hidden aspect-square relative">
            <Image 
              src="/images/creator_photo.jpg" 
              alt="Photo of the Creator" 
              fill
              className="object-cover" 
            />
          </RevealWrapper>
        </div>
        <div className="md:w-2/3">
          <RevealWrapper origin="right" delay={400} duration={1000} distance="50px" reset={true}>
            <h3 className="text-2xl font-semibold text-white mb-4">Crafted by a Design Executive</h3>
            <p className="text-lg font-sans mb-4">
              Handmade by Jon Friedman, a seasoned product design executive.
            </p>
            <p className="text-lg font-sans mb-4">
              Years in the making and refined through thousands of iterations, each Figé spinner is hand-assembled in Jon's home studio—where design, engineering, and elegance converge. Limited to just five numbered pieces, each one is individually etched and comes with a signed certificate of authenticity.
            </p>
            <p className="text-lg font-sans mb-4">
              <a href="https://www.linkedin.com/in/designjon/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                Learn more about Jon
              </a>
            </p>
          </RevealWrapper>
        </div>
      </div>
    </RevealWrapper>
  </section>
);

const MaterialsAndCraftsmanshipSection: React.FC = () => (
  <section id="materials-craftsmanship" className="py-16 px-4 md:px-8 bg-gray-900 text-gray-300 w-full overflow-hidden">
    <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-10 text-center">Materials & Craftsmanship</h2>
      <div className="md:flex md:items-start md:space-x-10"> {/* Flex container for two columns */}
        {/* Left Column: Text and Bullet List */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <RevealWrapper origin="left" delay={300} duration={1000} distance="50px" reset={true}>
            <p className="text-lg md:text-xl mb-4 font-sans">
              Every detail matters:
            </p>
            <p className="text-lg md:text-xl font-sans mb-2">
              <strong>Carbon fiber filled PETG:</strong> strong, subtly glossy, beautifully grained
            </p>
            <p className="text-lg md:text-xl font-sans mb-2">
              <strong>Brass inlays & ball bearings:</strong> a nostalgic, weighty balance
            </p>
            <p className="text-lg md:text-xl font-sans mb-6">
              <strong>Premium R188 bearings:</strong> smooth, quiet, long-lasting performance
            </p>
            <p className="text-lg md:text-xl font-sans">
              This is functional sculpture for your desk.
            </p>
          </RevealWrapper>
        </div>
        {/* Right Column: Image */}
        <div className="md:w-1/2">
          <RevealWrapper origin="right" delay={400} duration={1000} distance="50px" reset={true} className="w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-lg overflow-hidden relative group"> {/* Responsive height */}
            <Image
              src="/images/materials_craftsmanship_new.jpg"
              alt="Figé Spinners with Crafting Tools and Materials"
              fill
              className="object-cover filter sepia-[.3] saturate-150 hue-rotate-[-10deg] brightness-105 contrast-105 transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </RevealWrapper>
        </div>
      </div>
    </RevealWrapper>
  </section>
);

const ExperienceSection: React.FC = () => (
  <section id="experience" className="py-16 px-4 md:px-8 bg-black text-gray-300 w-full overflow-hidden">
    <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">A Tactile Anchor for Executive Presence</h2>
      <p className="text-lg md:text-xl mb-8 font-sans">
        In high-pressure moments, Figé becomes your discreet tool for clarity.It calms nerves, sharpens focus, and anchors attention. Precision you can feel. Presence you can command.
      </p>
      <div className="my-8 rounded-lg shadow-lg overflow-hidden relative aspect-video max-w-3xl mx-auto"> 
        <Image 
          src="/images/executive_presence_new.png" 
          alt="Executive Presence" 
          fill
          className="object-cover" 
        />
      </div>
    </RevealWrapper>
  </section>
);

const GuaranteeSection: React.FC = () => (
  <section id="guarantee" className="py-16 px-4 md:px-8 bg-gray-900 text-gray-300 w-full overflow-hidden">
    <RevealWrapper origin="bottom" delay={200} duration={1000} distance="50px" reset={true} className="max-w-4xl mx-auto text-center border-t border-b border-gray-700 py-10">
      <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Lifetime Assurance</h2>
      <p className="text-lg md:text-xl mb-4 font-sans">
        Figé is built to last. If it ever breaks, we'll replace it—no questions asked. This is our lifetime guarantee.
      </p>
    </RevealWrapper>
  </section>
);

// Wrapper component to use useSearchParams
const HomePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [showCancellationMessage, setShowCancellationMessage] = useState(false);

  useEffect(() => {
    if (searchParams?.get("payment-cancelled") === "true") {
      setShowCancellationMessage(true);
    }
  }, [searchParams]);

  return (
    // Applied w-screen and overflow-x-hidden to the main container
    <main className="bg-black font-sans w-screen overflow-x-hidden">
      {showCancellationMessage && (
        <div className="bg-yellow-900 text-center p-4 text-white w-full">
          Your pre-order was cancelled. You can try again below.
        </div>
      )}
      <HeroSection />
      <CraftsmanshipSection />
      <AboutTheCreatorSection />
      <MaterialsAndCraftsmanshipSection />
      <ExperienceSection />
      <GuaranteeSection />
      <PreOrderSection /> 
      <footer className="text-center py-6 bg-black text-gray-600 text-sm w-full overflow-hidden">
        <RevealWrapper origin="bottom" delay={200} duration={1000} distance="20px" reset={true}>
          © {new Date().getFullYear()} Figé. All rights reserved.
        </RevealWrapper>
      </footer>
    </main>
  );
};

// Main export needs to wrap content in Suspense for useSearchParams
export default function Home() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}> 
      <HomePageContent />
    </React.Suspense>
  );
}

