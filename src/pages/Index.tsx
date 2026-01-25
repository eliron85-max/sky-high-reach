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
            <>
              {/* SERVICES */}
              <section
                id="services"
                ref={(el) => {
                  (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                }}
                className={`scroll-reveal ${isVisible ? "visible" : ""} py-12 lg:py-20 bg-background`}
              >
                <div className={`${isMobile ? "px-3" : "container mx-auto px-4"}`}>
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 lg:mb-12">
                      <h2
                        className={`${
                          isMobile ? "text-2xl" : "text-4xl lg:text-6xl xl:text-7xl"
                        } font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8c777] via-[#d8b15a] to-[#8a6b2e] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
                      >
                        השירותים שלנו
                      </h2>
                      <p className="mt-3 text-sm lg:text-base text-muted-foreground">
                        שיקום מעטפת, חיפוי אבן, איטום, מרזבים וצנרת, פתרונות מיוחדים – ברמת גימור פרימיום.
                      </p>
                    </div>

                    {/* GRID במקום הכרטיסים "המתפזרים" */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                      {featuredServices.map((s) => (
                        <Link
                          key={s.title}
                          to={s.link}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 hover:bg-black/30 transition-colors"
                        >
                          <div className="aspect-[4/3] w-full">
                            <img
                              src={s.image}
                              alt={s.title}
                              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                            <div className="text-white font-bold text-sm md:text-base drop-shadow-lg">{s.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
        >
          {/* HERO (וידאו עובד) - בלי כרטיסים */}
          <section id="hero" className="relative w-full overflow-hidden">
            <div
              className="relative w-full"
              style={{
                height: isMobile ? "clamp(420px, 72vh, 560px)" : "clamp(520px, 78vh, 720px)",
              }}
            >
              {/* Background Video */}
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                {/* נסה קודם את hero.webm, ואם לא קיים/לא נטען, החלף ל hero-stone-veneer.webm */}
                <source src="/hero.webm" type="video/webm" />
                <source src="/hero-stone-veneer.webm" type="video/webm" />
              </video>

              {/* Overlays */}
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/65" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className={`${isMobile ? "px-4" : "container mx-auto px-4"}`}>
                  <div className="max-w-3xl">
                    <h1
                      className={`${
                        isMobile ? "text-3xl" : "text-5xl lg:text-6xl"
                      } font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#f2e0b6] via-[#e8c777] to-[#8a6b2e] drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]`}
                    >
                      מומחים בעבודות גובה ברמת גימור פרימיום
                    </h1>

                    <p className="mt-4 text-base lg:text-lg text-white/80 max-w-2xl">
                      שיקום מעטפת • חיפוי אבן • איטום בגובה • מרזבים וצנרת • פתרונות מיוחדים
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300"
                      >
                        <Link to="/contact">בקשת הצעת מחיר</Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        className="
    h-12 px-6 rounded-full font-semibold
    bg-white/90 border border-white/40
    !text-slate-900 hover:bg-white
    dark:bg-white/10 dark:border-white/20 dark:!text-white dark:hover:bg-white/15
    shadow-lg shadow-black/10 dark:shadow-black/30
  "
                      >
                        <Link to="/projects" className="!text-inherit no-underline">
                          צפו בפרויקטים
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          </section>
        </HeroStickyCollapse>

        {/* LOCK Testimonials to transparent so background image never disappears */}
        <style>{`
          #testimonials { background: transparent !important; background-color: transparent !important; }
          #testimonials.bg-background { background: transparent !important; background-color: transparent !important; }
          #testimonials[class*="bg-"] { background-color: transparent !important; }
        `}</style>

        {/* Testimonials with fixed background */}
        <div className="relative z-30 overflow-hidden" id="testimonials">
          <div
            className="absolute inset-0 -z-10 pointer-events-none bg-no-repeat bg-right bg-contain opacity-[0.22] blur-0"
            style={{ backgroundImage: "url(/images/facade-bg.webp)" }}
          />
          <div className="relative z-10 bg-transparent">
            <HomeTestimonials />
          </div>
        </div>

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
                <Link to="/contact">בקשת הצעת מחיר</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all"
              >
                <Link to="/projects">צפו בפרויקטים שלנו</Link>
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
