// src/pages/Index.tsx
import React from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import HomeTestimonials from "@/components/HomeTestimonials";
import TrustStrip from "@/components/TrustStrip";
import Contact from "@/components/Contact";

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

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                className={`relative z-20 bg-black ${
                  isVisible ? "opacity-100" : "opacity-0"
                } transition-opacity duration-700`}
              >
                {/* FULL BLACK WRAPPER (prevents hero bleed) */}
                <div className="relative w-full bg-black overflow-hidden">
                  {/* TOP STRIP (full width) */}
                  <div className="w-full h-[70px] bg-black" />

                  {/* TITLE BAR (opaque, no bleed) */}
                  <div className="w-full h-[90px] bg-black flex items-center justify-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#f5d58a] text-center">השירותים שלנו</h2>
                  </div>

                  {/* BOTTOM STRIP (full width) */}
                  <div className="w-full h-[70px] bg-black" />

                  {/* OUTER BORDER */}
                  <div className="bg-[#dfc798] p-[1px]">
                    {/* GRID (inner grid lines) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black">
                      {services.map((s) => (
                        <div
                          key={s.title}
                          className="group relative overflow-hidden h-[270px] md:h-[320px] xl:h-[360px]"
                        >
                          {/* IMAGE (zoom on hover) */}
                          <img
                            src={s.image}
                            alt={s.title}
                            className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.18]"
                            loading="lazy"
                          />

                          {/* OVERLAY (fade) */}
                          <div className="absolute inset-0 bg-black/65 transition-opacity duration-500 ease-out group-hover:opacity-40" />

                          {/* INNER BORDER */}
                          <div className="absolute inset-0 border border-[#a79471] pointer-events-none" />

                          {/* TEXT */}
                          <div className="absolute bottom-6 w-full text-center px-3">
                            <span
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontStyle: "normal",
                                fontWeight: 500,
                                fontSize: "45px",
                                lineHeight: "54px",
                                color: "rgb(255, 228, 174)",
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

                  {/* SPACE BEFORE TRUST STRIP */}
                  <div className="h-10 bg-black" />
                </div>
              </section>

              <TrustStrip />
              <HomeTestimonials />

              {/* CTA */}
              <section className="py-16 text-center bg-black">
                <Button
                  onClick={scrollToContact}
                  className="bg-gradient-to-b from-[#f6e7b2] to-[#c9a84c] text-black font-bold px-10 py-6 text-lg"
                >
                  צור קשר
                </Button>
              </section>

              {/* CONTACT (anchor) */}
              <div id="contact">
                <Contact />
              </div>
            </>
          }
        >
          {/* HERO */}
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

              {/* overlay */}
              <div className="absolute inset-0 bg-black/55" />

              {/* HERO TEXT */}
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-white font-extrabold tracking-tight leading-[0.95] text-[44px] sm:text-[74px] lg:text-[92px] drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]">
                    א.א פרויקטים וגובה
                  </h1>

                  <p className="mt-4 text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
                    עבודות סנפלינג • שיקום מעטפת • איטום • חיפוי אבן • צנרת ומרזבים
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={scrollToContact}
                      className="rounded-full px-8 py-3 font-bold text-black bg-gradient-to-b from-[#f6e7b2] to-[#c9a84c] hover:brightness-105 transition"
                    >
                      צור קשר
                    </button>

                    <a
                      href="tel:055-6616326"
                      className="rounded-full px-8 py-3 font-bold text-white border border-white/35 hover:border-white/60 hover:bg-white/5 transition"
                    >
                      חייג עכשיו
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </HeroStickyCollapse>
      </main>

      <Footer />
    </div>
  );
}
