// src/pages/Index.tsx
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTestimonials from "@/components/HomeTestimonials";

import TrustStrip from "@/components/TrustStrip";
import Contact from "@/components/Contact";
import HomeUrbanRenewalHero from "@/components/HomeUrbanRenewalHero";
import HomeStatsSection from "@/components/HomeStatsSection";
import { FloatingLanguageSwitcher } from "@/components/FloatingLanguageSwitcher";
import RappellingFigure from "@/components/RappellingFigure";
import RappellingFigureLeft from "@/components/RappellingFigureLeft";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import SiteTourWizard from "@/components/SiteTourWizard";
import StickyRevealSection from "@/components/StickyRevealSection";
import StickySplitSection from "@/components/StickySplitSection";
import { useTranslation } from "@/lib/i18n";
import { ClipboardList, Ruler, HardHat, CheckCircle, Sparkles } from "lucide-react";


import stoneCladding1 from "@/assets/stone-cladding-1.webp";
import stoneCladding2 from "@/assets/stone-cladding-2.webp";
import stoneCladding3 from "@/assets/stone-cladding-3.webp";
import stoneCladding4 from "@/assets/stone-cladding-4.webp";
import stoneCladding5 from "@/assets/stone-cladding-5.webp";
import stoneCladding6 from "@/assets/stone-cladding-6.webp";
import stoneCladding7 from "@/assets/stone-cladding-7.webp";
import stoneCladding8 from "@/assets/stone-cladding-8.webp";

import statsImage1 from "@/assets/stats-1.webp";
import statsImage2 from "@/assets/stats-2.webp";
import statsImage3 from "@/assets/stats-3.webp";
import statsImage4 from "@/assets/stats-4.webp";

import facadeProject1 from "@/assets/facade-project-1.webp";
import stoneVeneerImage from "@/assets/stone-veneer.webp";
import facadeRestorationNew from "@/assets/facade-restoration-new.webp";

const urbanImages = [
stoneCladding1, stoneCladding2, stoneCladding3, stoneCladding4,
stoneCladding5, stoneCladding6, stoneCladding7, stoneCladding8];


export default function Index() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroDrift, setHeroDrift] = useState(0);

  useEffect(() => {
    const DRIFT_MAX = 140;
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = el.offsetHeight - vh;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setHeroDrift(p * DRIFT_MAX);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById("next-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const timelineItems = [
  { step: 1, title: "פגישת ייעוץ", description: "פגישה ראשונית להבנת הצרכים, סקר המבנה ותכנון ראשוני של הפרויקט.", icon: <ClipboardList className="w-7 h-7" /> },
  { step: 2, title: "מדידות ותכנון", description: "ביצוע מדידות מדויקות, הכנת תוכניות עבודה מפורטות והצעת מחיר סופית.", icon: <Ruler className="w-7 h-7" /> },
  { step: 3, title: "ביצוע הפרויקט", description: "צוות מקצועי ומנוסה מבצע את העבודה תוך הקפדה על לוחות זמנים ותקנים.", icon: <HardHat className="w-7 h-7" /> },
  { step: 4, title: "בדיקה ואישור", description: "בקרת איכות מקיפה, תיקונים סופיים ומסירת הפרויקט המושלם.", icon: <CheckCircle className="w-7 h-7" /> },
  { step: 5, title: "אחריות ושירות", description: "ליווי לאחר המסירה, אחריות מלאה ושירות לקוחות זמין בכל עת.", icon: <Sparkles className="w-7 h-7" /> }];


  const revealLayers = [
  { image: stoneCladding1, title: "חיפוי אבן טבעית", subtitle: "מראה יוקרתי ועמיד לאורך שנים" },
  { image: facadeRestorationNew, title: "שיקום מבנים", subtitle: "החזרת הזוהר למבנים ישנים" },
  { image: stoneCladding5, title: "פרויקטים מיוחדים", subtitle: "פתרונות מותאמים לכל אתגר" },
  { image: stoneCladding3, title: "מומחיות בגובה", subtitle: "עבודה מקצועית בכל גובה" }];


  return (
    <div className="min-h-screen bg-black">
      <Header />
      <FloatingLanguageSwitcher />
      
      <RappellingFigure />
      <RappellingFigureLeft />

      {/* ========== #1 HERO VIDEO ========== */}
      <div ref={heroRef} className="relative" style={{ height: "200vh" }}>
        <section className="sticky top-0 z-0 w-full h-screen overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ transform: `translateY(${heroDrift}px)` }}
            autoPlay muted loop playsInline preload="auto"
            poster="/hero-poster.jpg">

            <source src="/hero.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="גלול למטה"
            className="absolute left-1/2 -translate-x-1/2 z-[99999] bottom-[12px] sm:bottom-[14px] flex flex-col items-center">

            <div className="relative w-[28px] h-[56px] rounded-full border-2 border-[#e8d5a3] bg-black/40 backdrop-blur-sm">
              <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[10px] rounded-full bg-[#e8d5a3] heroScrollDot" />
            </div>
            <div className="mt-2 w-[10px] h-[10px] border-b-2 border-r-2 border-[#e8d5a3] rotate-45 opacity-90" />
          </button>
        </section>
      </div>

      {/* ========== CURTAIN rising over Hero ========== */}
      <div className="relative z-10" style={{ marginTop: "-100vh" }}>
        {/* postScreens=1 — one screen of hero still visible before curtain rises */}
        <div className="h-screen pointer-events-none" aria-hidden="true" />
        <div className="bg-background rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)]">
          <TrustStrip />
          <section id="next-section" />
        </div>
      </div>

      {/* ========== Main content — above sticky hero ========== */}
      <div className="relative z-10">
        {/* ========== #3 HORIZONTAL TIMELINE ========== */}
        <HorizontalTimeline
          title="איך זה עובד?"
          subtitle="מהרעיון ועד להשקה - צעד אחר צעד"
          items={timelineItems} />


        {/* ========== #4 STATS COUNTER ========== */}
        <HomeStatsSection
          titleGold={t("home.statsGold")}
          titleBlack={t("home.statsBlack")}
          stats={[
          { value: "500+", label: t("home.statsProjects") },
          { value: "15", label: t("home.statsExperience") },
          { value: "50+", label: t("home.statsCities") }]
          }
          images={[statsImage1, statsImage2, statsImage3, statsImage4]} />


        {/* ========== #5 URBAN RENEWAL ========== */}
        <HomeUrbanRenewalHero
          images={urbanImages}
          titleTop={t("home.urbanTitleTop")}
          titleGold={t("home.urbanTitleGold")}
          subtitle={t("home.urbanSubtitle")} />


        {/* ========== #6 STICKY REVEAL ========== */}
        <StickyRevealSection
          sectionTitle="השראה מהפרויקטים שלנו"
          layers={revealLayers} />


        {/* ========== #7 STICKY SPLIT — ימין ========== */}
        <StickySplitSection
          image={facadeProject1}
          title="שיקום מבנים מקצועי"
          subtitle="שיקום חזיתות"
          description="אנו מתמחים בשיקום ושיפוץ חזיתות מבנים, תוך שימוש בחומרים איכותיים וטכנולוגיות מתקדמות. הצוות המקצועי שלנו מחזיר את הזוהר לכל מבנה."
          features={["שיקום חזיתות בטון ואבן", "עמידות לאורך שנים", "עבודה על פי תקנים מחמירים", "ניסיון של מעל 15 שנה"]}
          imagePosition="right"
          ctaText="לפרטים נוספים"
          ctaHref="/facade-restoration" />


        {/* ========== #8 STICKY SPLIT — שמאל ========== */}
        <StickySplitSection
          image={stoneVeneerImage}
          title="חיפוי אבן טבעית"
          subtitle="חיפוי ועיצוב"
          description="חיפוי אבן טבעית הוא אמנות בפני עצמה. אנו מציעים מגוון רחב של אבנים טבעיות ועיצובים ייחודיים שמשדרגים כל מבנה למראה יוקרתי ובלתי נשכח."
          features={["מגוון אבנים טבעיות", "עיצוב מותאם אישית", "התקנה מקצועית", "אחריות מלאה"]}
          imagePosition="left"
          ctaText="לפרטים נוספים"
          ctaHref="/stone-veneer" />


        <HomeTestimonials />
        <Contact />
        <Footer />
      </div>
    </div>);

}