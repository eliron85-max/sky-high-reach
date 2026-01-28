import TrustStrip from "@/components/TrustStrip";
// src/pages/Index.tsx
import React, { useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import HomeTestimonials from "@/components/HomeTestimonials";

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
        {/* HERO */}
        <HeroStickyCollapse collapseDistance={650} mobileCollapseDistance={450}>
          <section className="relative w-full overflow-hidden">
            <div
              className="relative w-full"
              style={{
                height: isMobile ? "clamp(420px,72vh,560px)" : "clamp(520px,78vh,720px)",
              }}
            >
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
                <source src="/hero.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-black/45" />
            </div>
          </section>
        </HeroStickyCollapse>

        {/* SERVICES */}
        <section
          ref={(el) => {
            (ref as React.MutableRefObject<HTMLElement | null>).current = el;
          }}
          className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700 py-8 md:py-10`}
        >
          {/* OUTER BORDER */}
          <div className="bg-[#dfc798] p-[1px]">
            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black">
              {services.map((s) => (
                <div key={s.title} className="group relative overflow-hidden h-[270px] md:h-[320px] xl:h-[360px]">
                  {/* IMAGE */}
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.22]"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/65" />

                  {/* INNER BORDER */}
                  <div className="absolute inset-0 border border-[#a79471] pointer-events-none" />

                  {/* TEXT */}
                  <div className="absolute bottom-6 w-full text-center px-3">
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "36px",
                        lineHeight: "44px",
                        color: "rgb(255,228,174)",
                        textShadow: "0 10px 18px rgba(0,0,0,0.85)",
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
        <TrustStrip />
        <HomeTestimonials />

        {/* CTA */}
        <section className="py-16 text-center">
          <Button className="bg-gradient-to-b from-[#f6e7b2] to-[#c9a84c] text-black font-bold px-10 py-6 text-lg">
            צור קשר
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
