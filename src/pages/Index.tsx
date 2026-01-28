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

/* images */
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
      <SectionNavigator
        sections={[
          { id: "hero", label: "ראשי" },
          { id: "services", label: "שירותים" },
        ]}
      />

      <main className="pt-[var(--header-height)]">
        {/* HERO */}
        <HeroStickyCollapse collapseDistance={650} mobileCollapseDistance={450}>
          <section id="hero" className="relative w-full h-[75vh] overflow-hidden">
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
              <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 h-full flex items-center px-6">
              <h1 className="text-white text-4xl md:text-6xl font-bold">מומחים בעבודות גובה</h1>
            </div>
          </section>
        </HeroStickyCollapse>

        {/* SERVICES GRID */}
        <section
          id="services"
          ref={(el) => {
            (ref as React.MutableRefObject<HTMLElement | null>).current = el;
          }}
          className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700 py-12`}
        >
          {/* FRAME */}
          <div className="bg-[#c9a84c] p-[3px]">
            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] bg-black">
              {services.map((s) => (
                <div key={s.title} className="relative group overflow-hidden h-[240px] md:h-[300px] xl:h-[360px]">
                  {/* IMAGE */}
                  <img
                    src={s.image}
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* TEXT */}
                  <div className="absolute bottom-6 w-full text-center">
                    <span
                      className="
                        text-2xl
                        md:text-3xl
                        font-extrabold
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-b
                        from-[#f6e7b2]
                        to-[#c9a84c]
                        drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]
                      "
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
