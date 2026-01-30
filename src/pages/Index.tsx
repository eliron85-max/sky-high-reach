// src/pages/Index.tsx
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import HomeTestimonials from "@/components/HomeTestimonials";
import TrustStrip from "@/components/TrustStrip";
import Contact from "@/components/Contact";
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
              {/* SERVICES — YouTube-style grid */}
              <section
                ref={(el) => {
                  (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                }}
                className={`relative z-20 bg-black ${
                  isVisible ? "opacity-100" : "opacity-0"
                } transition-opacity duration-700`}
              >
                <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-[#f5d58a] text-center">השירותים שלנו</h2>

                  {/* 2 mobile / 3 tablet / 4 desktop — compact spacing */}
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
                    {services.map((s) => (
                      <article key={s.title} className="group cursor-pointer">
                        {/* 16:9 thumbnail */}
                        <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
                          <img
                            src={s.image}
                            alt={s.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
                        </div>

                        {/* title under image */}
                        <div className="mt-2">
                          <h3
                            className="text-[16px] md:text-[17px] font-semibold text-[#ffe4ae] leading-snug line-clamp-1"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {s.title}
                          </h3>
                          <p className="text-sm text-white/55">עבודות גובה וסנפלינג</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <TrustStrip />
              <HomeTestimonials />

              <section className="py-6 bg-black" />

              <Contact />
            </>
          }
        >
          {/* HERO */}
          <section className="relative w-full overflow-hidden">
            <div
              className="relative w-full bg-black"
              style={{
                height: isMobile ? "clamp(420px,72vh,560px)" : "clamp(520px,78vh,720px)",
              }}
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/hero-poster.jpg"
              >
                <source src="/hero.webm" type="video/webm" />
              </video>

              <div className="absolute inset-0 bg-black/45" />
            </div>
          </section>
        </HeroStickyCollapse>
      </main>

      <Footer />
    </div>
  );
}
