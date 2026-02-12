// src/pages/Index.tsx
import React from "react";
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
];

export default function Index() {
  const { t } = useTranslation();

  const services = [
    { title: t("home.serviceCards.specialProjects"), image: specialProjectsImage },
    { title: t("home.serviceCards.birdControl"), image: birdControlImage },
    { title: t("home.serviceCards.waterproofing"), image: waterproofingImage },
    { title: t("home.serviceCards.facadeRestoration"), image: facadeRestorationImage },
    { title: t("home.serviceCards.stoneVeneer"), image: stoneCladdingImage },
    { title: t("home.serviceCards.demolitionOrders"), image: demolitionOrdersImage },
    { title: t("home.serviceCards.pipingGutters"), image: pipingGuttersImage },
    { title: t("home.serviceCards.heightSolutions"), image: heightSolutionsImage },
  ];

  const scrollToNext = () => {
    const el = document.getElementById("next-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />

      {/* Right side (workerRight.png) */}
      <RappellingFigure />

      {/* Left side (Worker.png) */}
      <RappellingFigureLeft />

      <main className="pt-[var(--header-height)]">
        {/* HERO VIDEO SECTION */}
        <section className="relative z-50 w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-visible">
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

          {/* Scroll icon */}
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="גלול למטה"
            className="absolute left-1/2 -translate-x-1/2
                       z-[99999]
                       bottom-[-18px] sm:bottom-[-20px]
                       flex flex-col items-center"
          >
            {/* Mouse shape */}
            <div
              className="relative w-[28px] h-[56px] rounded-full
                         border-2 border-[#e8d5a3]
                         bg-black/40 backdrop-blur-sm"
            >
              {/* Moving dot – perfectly centered */}
              <div
                className="absolute left-1/2 top-[10px]
                           -translate-x-1/2
                           w-[6px] h-[10px]
                           rounded-full
                           bg-[#e8d5a3]
                           heroScrollDot"
              />
            </div>

            {/* Small arrow */}
            <div
              className="mt-2 w-[10px] h-[10px]
                         border-b-2 border-r-2
                         border-[#e8d5a3]
                         rotate-45 opacity-80"
            />
          </button>
        </section>

        {/* SERVICES SCROLL CARDS (Pinned on desktop) */}
        <section id="next-section" className="relative z-0 pt-[30px] sm:pt-[34px]">
          <ServicesScrollCards title={t("home.servicesTitle")} className="bg-[#bfe7d6]" items={services} />
        </section>

        {/* STATS SECTION */}
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

        {/* URBAN RENEWAL SECTION */}
        <HomeUrbanRenewalHero
          images={urbanImages}
          titleTop={t("home.urbanTitleTop")}
          titleGold={t("home.urbanTitleGold")}
          subtitle={t("home.urbanSubtitle")}
        />

        {/* EMPTY GRID SECTION */}
        <section className="relative w-full bg-white h-[200px] sm:h-[280px] lg:h-[350px] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </section>

        <TrustStrip />
        <HomeTestimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
