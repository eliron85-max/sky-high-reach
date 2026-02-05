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
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { FloatingLanguageSwitcher } from "@/components/FloatingLanguageSwitcher";

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

const services = [
  { title: "עבודות מיוחדות", image: specialProjectsImage },
  { title: "הרחקת מעופפים", image: birdControlImage },
  { title: "איטום בגובה", image: waterproofingImage },
  { title: "שיקום מעטפת", image: facadeRestorationImage },
  { title: "חיפוי אבן", image: stoneCladdingImage },
  { title: "ביטול צווי הריסה", image: demolitionOrdersImage },
  { title: "צנרת ומרזבים", image: pipingGuttersImage },
  { title: "פתרונות בגובה", image: heightSolutionsImage },
];

export default function Index() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />

      <main className="pt-[var(--header-height)]">
        {/* HERO VIDEO SECTION */}
        <section className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
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
        </section>

        {/* SERVICES SECTION */}
        <section
          ref={ref as React.RefObject<HTMLElement>}
          className={`relative z-20 bg-black py-10 sm:py-14 lg:py-20 ${
            isVisible ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
        >
          {/* במקום הכותרת + הגריד הישן — משתמשים בקומפוננטה עם האנימציה */}
          <ServicesScrollCards
            title="השירותים שלנו"
            subtitle="קלפים שנכנסים בגלילה בצורה חלקה"
            items={services.map((s) => ({
              title: s.title,
              image: s.image,
              href: "/services",
            }))}
          />
        </section>

        {/* STATS SECTION */}
        <HomeStatsSection
          titleGold="המספרים מדברים"
          titleBlack="בעד עצמם!"
          stats={[
            { value: "500+", label: "פרויקטים שהושלמו" },
            { value: "15", label: "שנות ניסיון" },
            { value: "50+", label: "ערים ואזורי פעילות" },
          ]}
          images={[statsImage1, statsImage2, statsImage3, statsImage4]}
        />

        {/* URBAN RENEWAL SECTION */}
        <HomeUrbanRenewalHero
          images={urbanImages}
          titleTop="חיפוי אבן בגובה"
          titleGold="מראה יוקרתי ועמיד"
          subtitle="התקנת חיפוי אבן באיכות גבוהה לבניינים — עבודות גובה מקצועיות בטכנולוגיית סנפלינג, גימור מושלם ועמידות לאורך שנים."
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
