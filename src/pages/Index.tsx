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
              className={`scroll-reveal ${isVisible ? "visible" : ""} bg-background overflow-x-hidden py-10 lg:py-16`}
            >
              {/* FULL BLEED */}
              <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
                <div className="text-center mb-6 px-4">
                  <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8c777] via-[#d8b15a] to-[#8a6b2e]">
                    השירותים שלנו
                  </h2>
                </div>

                {/* ✅ גריד לבן (קווים לבנים בין הכרטיסים) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] bg-white p-[3px]">
                  {featuredServices.map((s) => (
                    <Link key={s.title} to={s.link} className="group relative block overflow-hidden bg-black">
                      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[260px] lg:h-[300px] xl:h-[340px] overflow-hidden">
                        <img
                          src={s.image}
                          alt={s.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                        />

                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                        {/* ✅ טקסט למטה + ממורכז באמצע */}
                        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center">
                          <div className="text-white font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)] text-center">
                            {s.title}
                          </div>
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

        {/* Testimonials */}
        <HomeTestimonials />

        {/* CTA Section */}
        <section
          id="cta"
          ref={ctaRef}
          className="py-16 lg:py-24 bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden z-30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 via-transparent to-[#c9a84c]/5" />
          <div
            ref={ctaLine1Ref}
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent"
            style={ctaLine1Style}
          />

          <div ref={ctaContentRef} className="container mx-auto px-4 text-center relative z-10" style={ctaContentStyle}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]">
              מוכנים להתחיל את הפרויקט הבא?
            </h2>
            <p className="text-lg text-[#e8d5a3]/70 max-w-2xl mx-auto mb-8">
              צרו קשר לקבלת ייעוץ חינם והצעת מחיר מותאמת
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300"
              >
                <Link to="/contact" className="text-inherit no-underline">
                  בקשת הצעת מחיר
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all"
              >
                <Link to="/projects" className="text-inherit no-underline">
                  צפו בפרויקטים שלנו
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
