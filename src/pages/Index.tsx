// src/pages/Index.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTestimonials from "@/components/HomeTestimonials";
import ServicesScrollCards from "@/components/ServicesScrollCards";
import TrustStrip from "@/components/TrustStrip";
import Contact from "@/components/Contact";
import HomeUrbanRenewalHero from "@/components/HomeUrbanRenewalHero";
import HomeStatsSection from "@/components/HomeStatsSection";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { FloatingLanguageSwitcher } from "@/components/FloatingLanguageSwitcher";
import RappellingFigure from "@/components/RappellingFigure";
import RappellingFigureLeft from "@/components/RappellingFigureLeft";

import LaptopMockup from "@/components/LaptopMockup";
import SectionDivider from "@/components/SectionDivider";
import { useTranslation } from "@/lib/i18n";

// Services images
import facadeRestorationImage from "@/assets/facade-restoration.webp";
import waterproofingImage from "@/assets/waterproofing.webp";
import birdControlImage from "@/assets/bird-control.webp";
import specialProjectsImage from "@/assets/special-projects.webp";
import stoneCladdingImage from "@/assets/stone-cladding.jpg";
import demolitionOrdersImage from "@/assets/demolition-orders.webp";
import pipingGuttersImage from "@/assets/piping-gutters.webp";
import heightSolutionsImage from "@/assets/height-solutions.webp";

// Urban renewal carousel images - Stone Cladding
import stoneCladding1 from "@/assets/stone-cladding-1.webp";
import stoneCladding2 from "@/assets/stone-cladding-2.webp";
import stoneCladding3 from "@/assets/stone-cladding-3.webp";
import stoneCladding4 from "@/assets/stone-cladding-4.webp";
import stoneCladding5 from "@/assets/stone-cladding-5.webp";
import stoneCladding6 from "@/assets/stone-cladding-6.webp";
import stoneCladding7 from "@/assets/stone-cladding-7.webp";
import stoneCladding8 from "@/assets/stone-cladding-8.webp";
import urbanRenewal1 from "@/assets/urban-renewal-1.jpg";
import urbanRenewal2 from "@/assets/urban-renewal-2.jpg";

// Stats section images
import statsImage1 from "@/assets/stats-1.webp";
import statsImage2 from "@/assets/stats-2.webp";
import statsImage3 from "@/assets/stats-3.webp";
import statsImage4 from "@/assets/stats-4.webp";

const urbanImages = [
  stoneCladding1,
  stoneCladding2,
  stoneCladding3,
  stoneCladding4,
  stoneCladding5,
  stoneCladding6,
  stoneCladding7,
  stoneCladding8,
  urbanRenewal1,
  urbanRenewal2,
];

export default function Index() {
  const { t, dir } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: t("hero.slide1Title"), subtitle: t("hero.slide1Subtitle") },
    { title: t("hero.slide2Title"), subtitle: t("hero.slide2Subtitle") },
    { title: t("hero.slide3Title"), subtitle: t("hero.slide3Subtitle") },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const services = [
    { title: t("home.serviceCards.specialProjects"), image: specialProjectsImage, href: "/special-projects" },
    { title: t("home.serviceCards.birdControl"), image: birdControlImage, href: "/bird-control" },
    { title: t("home.serviceCards.waterproofing"), image: waterproofingImage, href: "/waterproofing" },
    { title: t("home.serviceCards.facadeRestoration"), image: facadeRestorationImage, href: "/facade-restoration" },
    { title: t("home.serviceCards.stoneVeneer"), image: stoneCladdingImage, href: "/stone-veneer" },
    { title: t("home.serviceCards.demolitionOrders"), image: demolitionOrdersImage, href: "/demolition-orders" },
    { title: t("home.serviceCards.pipingGutters"), image: pipingGuttersImage, href: "/piping-gutters" },
    { title: t("home.serviceCards.heightSolutions"), image: heightSolutionsImage, href: "/height-solutions" },
  ];

  const scrollToNext = () => {
    const el = document.getElementById("next-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ===== Curtain Reveal over Stats =====
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const [curtainP, setCurtainP] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const setHeights = () => setVh(window.innerHeight || 0);
    setHeights();
    window.addEventListener("resize", setHeights, { passive: true });
    return () => window.removeEventListener("resize", setHeights);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = curtainRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const h = window.innerHeight || 1;

      // 0..1 בתוך מסלול של 200vh
      const raw = 1 - r.top / h;
      const clamped = Math.max(0, Math.min(1, raw));
      setCurtainP(clamped);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />

      <RappellingFigure />
      <RappellingFigureLeft />

      <main>
        {/* HERO VIDEO SECTION */}
        <div className="relative" style={{ height: "200vh" }}>
          <section className="sticky top-0 z-0 w-full h-screen overflow-hidden">
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

            {/* Hero Content */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4" dir={dir}>
              <div className="max-w-3xl mx-auto text-center">
                <div key={currentSlide} className="animate-fade-in-up">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]">
                      {slides[currentSlide].title}
                    </span>
                  </h1>
                  <p className="text-lg md:text-2xl lg:text-3xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => scrollToSection("projects")}
                    size="lg"
                    className="bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 hover:scale-105 active:scale-95 px-8 py-6 text-lg rounded-full"
                  >
                    {t("hero.ctaSecondary")}
                  </Button>

                  <Button
                    onClick={() => scrollToSection("contact")}
                    size="lg"
                    className="bg-black/60 backdrop-blur-sm border border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-black/80 hover:border-[#c9a84c] transition-all px-8 py-6 text-lg rounded-full"
                  >
                    {t("hero.ctaPrimary")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Vertical dot indicators */}
            <div className={`absolute ${dir === "rtl" ? "left-4 md:left-6" : "right-4 md:right-6"} top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3`}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all border ${
                    index === currentSlide
                      ? "bg-white border-white scale-125"
                      : "bg-white/40 border-white/60 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToNext}
              aria-label="גלול למטה"
              className="absolute left-1/2 -translate-x-1/2 z-[99999] bottom-[12px] sm:bottom-[14px] flex flex-col items-center"
            >
              <div className="relative w-[28px] h-[56px] rounded-full border-2 border-[#e8d5a3] bg-black/40 backdrop-blur-sm">
                <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[10px] rounded-full bg-[#e8d5a3] heroScrollDot" />
              </div>
              <div className="mt-2 w-[10px] h-[10px] border-b-2 border-r-2 border-[#e8d5a3] rotate-45 opacity-90" />
            </button>
          </section>
        </div>

        {/* CURTAIN CONTENT over HERO */}
        <div className="relative z-10 -mt-[100vh]">
          <div className="h-screen pointer-events-none" aria-hidden="true" />
          <div className="relative bg-background rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)]">
            

            <div className="relative z-[5]">
              <TrustStrip />
            </div>

            <section id="next-section" className="relative z-0">
              <ServicesScrollCards title={t("home.servicesTitle")} items={services} />
            </section>

            <div className="relative z-10">
              <SectionDivider />

              {/* STATS */}
              <HomeStatsSection
                titleGold={t("home.statsGold")}
                titleBlack={t("home.statsBlack")}
                stats={[
                  { value: "500+", label: t("home.statsProjects") },
                  { value: "15", label: t("home.statsExperience") },
                  { value: "50+", label: t("home.statsCities") },
                ]}
                images={[statsImage1, statsImage2, statsImage3, statsImage4]}
              />

              {/* URBAN "CURTAIN" over STATS */}
              <div ref={curtainRef} className="relative z-20" style={{ height: "200vh" }}>
                <div className="sticky top-0 h-[100svh] overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-[100svh] w-full bg-background rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.28)] overflow-hidden"
                    style={{
                      transform: `translateY(${Math.max(0, (1 - curtainP) * vh)}px)`,
                      willChange: "transform",
                    }}
                  >
                    <HomeUrbanRenewalHero
                      images={urbanImages}
                      titleTop={t("home.urbanTitleTop")}
                      titleGold={t("home.urbanTitleGold")}
                      subtitle={t("home.urbanSubtitle")}
                    />
                  </div>
                </div>
              </div>

              <SectionDivider />
              <HomeTestimonials />
              <SectionDivider />
              <LaptopMockup />
              <SectionDivider />
              <Contact />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
