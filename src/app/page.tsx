'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';
import FloatingNotifications from '@/components/notifications/FloatingNotifications';
import HeroSection from '@/components/hero/HeroSection';
import StatsBar from '@/components/sections/StatsBar';
import FeaturesGrid from '@/components/sections/FeaturesGrid';
import PricingSection from '@/components/sections/PricingSection';
import CheckoutModal from '@/components/sections/CheckoutModal';
import { useConfigStore } from '@/stores/config-store';

export default function Home() {
  const store = useConfigStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    store.fetchConfig();

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
        localStorage.setItem('alexandria_referrer', ref);
        fetch(`/api/affiliates/click?code=${ref}`).catch((err) =>
          console.error('Erro ao registrar click de afiliado:', err)
        );
      }

      // Smooth scroll if landing with hash or after page mount
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  }, []);

  const handleSelectPlan = (planName: string, price: number) => {
    setSelectedPlan(planName);
    setSelectedPrice(price);
    setCheckoutOpen(true);
  };

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />
      <FloatingNotifications />

      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        <HeroSection />
        
        {/* Connection line */}
        <div className="relative w-[1px] h-[70px] bg-gradient-to-b from-accent to-transparent opacity-35 mx-auto z-10 before:content-[''] before:absolute before:top-0 before:-left-[1px] before:w-[3px] before:h-[16px] before:bg-gradient-to-b before:from-transparent before:via-accent before:to-transparent before:shadow-[0_0_8px_#c9a55a] before:rounded-full before:animate-[connection-flow_2.5s_infinite_linear]" />
        
        <StatsBar />
        
        <FeaturesGrid />
        
        {/* Connection line dashed */}
        <div className="relative w-[1px] h-[70px] border-l border-dashed border-white/12 mx-auto z-10" />
        
        <PricingSection onSelectPlan={handleSelectPlan} />
      </main>

      <Footer />
      <CookieBanner />

      <CheckoutModal
        isOpen={checkoutOpen}
        planName={selectedPlan}
        price={selectedPrice}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
