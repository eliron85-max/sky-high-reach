// Index.tsx

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

// Service Images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import stoneVeneerImage from "@/assets/stone-cladding.jpg";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

type FeaturedService = { title: string; image: string; link: string };

const Index = () => {
  const { ref, isVisible } = useScrollReveal();
  const isMobile = useIsMobile();

  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaLine1Ref = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);

  const { style: ctaLine1Style } = useParallax(ctaLine1Ref, { speed: 0.3 });
  const { style: ctaContentStyle } = useParallax(ctaContentRef, { speed: 0.15 });

  const sections = [
    { id: "hero", label: "ראשי" },
    { id: "services", label: "שירותים" },
    { id: "testimonials", label: "המלצות" },
    { id: "cta", label: "צור קשר" },
  ];

  const featuredServices: FeaturedService[] = [
    { title: "שיקום מעטפת", image: facadeRestorationImage, link: "/facade-restoration" },
    { title: "איטום בגובה", image: waterproofingImage, link: "/waterproofing" },
    { title: "הרחקת מעופפים", image: birdControlImage, link: "/bird-control" },
    { title: "עבודות מיוחדות", image: specialProjectsImage, link: "/special-projects" },
    { title: "חיפוי אבן", image: stoneVeneerImage, link: "/stone-veneer" },
    { title: "ביטול צווי הריסה", image: demolitionOrdersImage, link: "/demolition-orders" },
    { title: "התקנת צנרת ומרזבים", image: pipingGuttersImage, link: "/special-projects" },
    { title: "פתרונות בגובה", image: heightSolutionsImage, link: "/special-projects" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />
      <SectionNavigator sections={sections} />

      <main className="pt-[var(--header-height)]">
        <HeroStickyCollapse
          collapseDistance={650}
          mobileCollapseDistance={450}
          after={
            /* SERVICES */
            <section
              id="services"
              ref={(el) => {
                (ref as React.MutableRefObject<HTMLElement | null>).current = el;
              }}
              className={`scroll-reveal ${isVisible ? "visible" : ""} bg-background overflow-x-hidden`}
            >
              <div className="w-screen">
                <div className="text-center py-10">
                  <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8c777] via-[#d8b15a] to-[#8a6b2e]">
                    השירותים שלנו
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                  {featuredServices.map((s) => (
                    <Link key={s.title} to={s.link} className="block">
                      <div className="relative w-full aspect-[4/5] overflow-hidden">
                        <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/35" />

                        <div className="absolute bottom-0 right-0 left-0 p-4">
                          <div className="text-white text-lg font-bold text-right">{s.title}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          }
        >
          {/* HERO */}
          <section id="hero" className="relative w-full overflow-hidden">
            <div
              className="relative w-full"
              style={{
                height: isMobile ? "clamp(420px,72vh,560px)" : "clamp(520px,78vh,720px)",
              }}
            >
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
                <source src="/hero.webm" type="video/webm" />
              </video>

              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 h-full flex items-center">
                <div className={`${isMobile ? "px-4" : "container mx-auto px-4"}`}>
                  <h1 className="text-3xl lg:text-6xl font-bold text-white">מומחים בעבודות גובה ברמת גימור פרימיום</h1>
                </div>
              </div>
            </div>
          </section>
        </HeroStickyCollapse>

        <HomeTestimonials />

        <section id="cta" ref={ctaRef} className="py-20 text-center">
          CTA
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
