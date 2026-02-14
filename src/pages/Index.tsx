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
import BouncingTextSection from "@/components/BouncingTextSection";
import HomeInstagramSection from "@/components/HomeInstagramSection";
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />

      {/* Right side */}
      <RappellingFigure />

      {/* Left side */}
      <RappellingFigureLeft />

      <main>
        {/* HERO VIDEO SECTION — sticky so content scrolls over it like a curtain */}
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

            {/* Scroll icon */}
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

        {/* CURTAIN CONTENT — scrolls up over the hero with rounded top corners */}
        <div className="relative z-10 -mt-[100vh]">
          {/* Rounded curtain edge */}
          <div className="h-screen pointer-events-none" aria-hidden="true" />

          <div className="relative bg-background rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)]">
            {/* BOUNCING TEXT */}
            <BouncingTextSection lines={["ברוכים הבאים לאתר", "א.א פרויקטים וגובה"]} />

            {/* TRUST STRIP */}
            <div className="relative z-[5]">
              <TrustStrip />
            </div>

            {/* SERVICES SCROLL CARDS */}
            <section id="next-section" className="relative z-0">
              <ServicesScrollCards title={t("home.servicesTitle")} items={services} />
            </section>

            {/* everything after services should be above the pinned cards */}
            <div className="relative z-10">
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

              <HomeUrbanRenewalHero
                images={urbanImages}
                titleTop={t("home.urbanTitleTop")}
                titleGold={t("home.urbanTitleGold")}
                subtitle={t("home.urbanSubtitle")}
              />

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

              <HomeInstagramSection />

              <HomeTestimonials />
              <Contact />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
