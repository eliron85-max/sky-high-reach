// src/pages/Index.tsx
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeTestimonials from "@/components/HomeTestimonials";
import StickyCoverTransition from "@/components/StickyCoverTransition";

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



  return (
    <div className="min-h-screen bg-hero-dark">
      <Header />
      <FloatingLanguageSwitcher />
      
      <RappellingFigure />
      <RappellingFigureLeft />

      {/* ========== #1 HERO → CURTAIN (StickyCoverTransition) ========== */}
      <StickyCoverTransition
        coverScreens={1}
        postScreens={0}
        driftMaxPx={0}
        secondRadiusPx={28}
        first={
          <section className="w-full h-full overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted loop playsInline preload="auto"
              poster="/hero-poster.jpg">
              <source src="/hero.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/45" />
          </section>
        }
        second={
          <div className="h-full w-full flex flex-col">
            <TrustStrip />
            <section id="next-section" />
          </div>
        }
      />

      {/* ========== Main content — above sticky hero ========== */}
      <div className="relative z-10 -mt-[100vh]">
        {/* ========== TRUST STRIP DIVIDER ========== */}
        <TrustStrip />

        {/* ========== STATS peels off to reveal TIMELINE ========== */}
        <div className="relative">
          {/* Stats — scrolls naturally (on top) */}
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
          </div>
          {/* Timeline — sticky behind, revealed as stats scrolls away */}
          <div className="sticky top-0 z-0">
            <HorizontalTimeline />
          </div>
        </div>


        {/* ========== #5 URBAN RENEWAL ========== */}
        <HomeUrbanRenewalHero
          images={urbanImages}
          titleTop={t("home.urbanTitleTop")}
          titleGold={t("home.urbanTitleGold")}
          subtitle={t("home.urbanSubtitle")} />


        {/* ========== #6 STICKY REVEAL ========== */}
        <StickyRevealSection
          first={
            <div className="h-full w-full relative">
              <img src={stoneCladding1} alt="חיפוי אבן טבעית" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-[15%] inset-x-0 text-center px-4" dir="rtl">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3">חיפוי אבן טבעית</h3>
                <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">מראה יוקרתי ועמיד לאורך שנים</p>
              </div>
            </div>
          }
          second={
            <div className="h-full w-full relative">
              <img src={facadeRestorationNew} alt="שיקום מבנים" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-[15%] inset-x-0 text-center px-4" dir="rtl">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3">שיקום מבנים</h3>
                <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">החזרת הזוהר למבנים ישנים</p>
              </div>
            </div>
          }
        />


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