// src/pages/Index.tsx

import React, { useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import SectionNavigator from "@/components/SectionNavigator";
import HomeTestimonials from "@/components/HomeTestimonials";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { FloatingLanguageSwitcher } from "@/components/FloatingLanguageSwitcher";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";
import { useIsMobile } from "@/hooks/use-mobile";

// images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import stoneVeneerImage from "@/assets/stone-cladding.jpg";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

const services = [
  { title: "שיקום מעטפת", image: facadeRestorationImage },
  { title: "איטום בגובה", image: waterproofingImage },
  { title: "הרחקת מעופפים", image: birdControlImage },
  { title: "עבודות מיוחדות", image: specialProjectsImage },
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
        {/* HERO */}
        <HeroStickyCollapse 
          collapseDistance={650} 
          mobileCollapseDistance={450}
          after={<></>}
        >
          <section id="hero" className="relative w-full h-[75vh] overflow-hidden">
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/45" />
          </section>
        </HeroStickyCollapse>

        {/* SERVICES */}
        <section
          id="services"
          ref={(el) => {
            (ref as React.MutableRefObject<HTMLElement | null>).current = el;
          }}
          className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700 py-12`}
        >
          {/* OUTER GRID BORDER */}
          <div className="bg-[#dfc798] p-[1px]">
            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black">
              {services.map((s) => (
                <div key={s.title} className="relative h-[280px] md:h-[330px] xl:h-[360px] overflow-hidden">
                  {/* IMAGE */}
                  <img
                    src={s.image}
                    className="absolute inset-0 w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-700"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/55" />

                  {/* INNER CARD BORDER */}
                  <div className="absolute inset-0 border border-[#a79471] pointer-events-none" />

                  {/* TEXT */}
                  <div className="absolute bottom-4 w-full text-center">
                    <span
                      style={{
                        fontFamily: "Matador, sans-serif",
                        fontWeight: 500,
                        fontSize: "45px",
                        lineHeight: "54px",
                        color: "rgb(255,228,174)",
                        textShadow: "0 6px 12px rgba(0,0,0,0.9)",
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomeTestimonials />

        {/* CTA */}
        <section className="py-20 text-center">
          <Button className="bg-gradient-to-b from-[#f6e7b2] to-[#c9a84c] text-black font-bold px-10 py-6 text-lg">
            צור קשר
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
