// src/pages/Index.tsx
import React from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import HomeTestimonials from "@/components/HomeTestimonials";
import TrustStrip from "@/components/TrustStrip";

import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { FloatingLanguageSwitcher } from "@/components/FloatingLanguageSwitcher";
import { useIsMobile } from "@/hooks/use-mobile";

// Images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import stoneVeneerImage from "@/assets/stone-cladding.jpg";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

const services = [
  { title: "עבודות מיוחדות", image: specialProjectsImage },
  { title: "הרחקת מעופפים", image: birdControlImage },
  { title: "איטום בגובה", image: waterproofingImage },
  { title: "שיקום מעטפת", image: facadeRestorationImage },
  { title: "חיפוי אבן", image: stoneVeneerImage },
  { title: "ביטול צווי הריסה", image: demolitionOrdersImage },
  { title: "צנרת ומרזבים", image: pipingGuttersImage },
  { title: "פתרונות בגובה", image: heightSolutionsImage },
];

export default function Index() {
  const { ref, isVisible } = useScrollReveal();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />

      <main className="pt-[var(--header-height)]">
        <HeroStickyCollapse
          collapseDistance={650}
          mobileCollapseDistance={450}
          after={
            <>
              {/* SERVICES */}
              <section
                ref={(el) => {
                  (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                }}
                className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
              >
                {/* FULL BLACK WRAPPER (prevents hero bleed) */}
                <div className="w-full bg-black">
                  {/* TOP STRIP */}
                  <div className="w-full h-[70px] bg-black" />

                  {/* TITLE BAR */}
                  <div className="w-full h-[90px] bg-black flex items-center justify-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#f5d58a] text-center">
                      השירותים שלנו
                    </h2>
                  </div>

                  {/* BOTTOM STRIP */}
                  <div className="w-full h-[70px] bg-black" />

                  {/* OUTER BORDER */}
                  <div className="bg-[#dfc798] p-[1px]">
                    {/* GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black">
                      {services.map((s) => (
                        <div
                          key={s.title}
                          className="group relative overflow-hidden h-[270px] md:h-[320px] xl:h-[360px]"
                        >
                          {/* IMAGE */}
                          <img
                            src={s.image}
                            alt={s.title}
                            className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.22]"
                          />

                          {/* OVERLAY */}
                          <div className="absolute inset-0 bg-black/65" />

                          {/* INNER BORDER */}
