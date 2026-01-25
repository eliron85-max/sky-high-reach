import React, { useRef, useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroWithCards from "@/components/HeroWithCards";
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

interface ScatterConfig {
  closedX: string;
  closedY: string;
  closedRotate: number;
  openX: string;
  openY: string;
  openRotate: number;
  scale: number;
  zIndex: number;
  width: string;
  parallaxZ: number; // translateZ for CSS parallax depth
}

// Desktop: 8 cards with CSS parallax depths
// parallaxZ: negative values = moves slower (further back), 0 = normal speed
const scatterConfigs: ScatterConfig[] = [
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "75%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 8,
    width: "22%",
    parallaxZ: -2, // Front layer - moves faster
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "51%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 7,
    width: "22%",
    parallaxZ: -4, // Mid layer
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "27%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 6,
    width: "22%",
    parallaxZ: -6, // Back layer - moves slower
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "3%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 5,
    width: "22%",
    parallaxZ: -3,
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "75%",
    openY: "58%",
    openRotate: 0,
    scale: 1,
    zIndex: 4,
    width: "22%",
    parallaxZ: -5,
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "51%",
    openY: "58%",
    openRotate: 0,
    scale: 1,
    zIndex: 3,
    width: "22%",
    parallaxZ: -2,
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "27%",
    openY: "58%",
    openRotate: 0,
    scale: 1,
    zIndex: 2,
    width: "22%",
    parallaxZ: -7, // Deepest layer
  },
  {
    closedX: "38%",
    closedY: "30%",
    closedRotate: 0,
    openX: "3%",
    openY: "58%",
    openRotate: 0,
    scale: 1,
    zIndex: 1,
    width: "22%",
    parallaxZ: -4,
  },
];

// Mobile: 8 cards with parallax (subtle on mobile)
const mobileScatterConfigs: ScatterConfig[] = [
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "2%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 8,
    width: "47%",
    parallaxZ: -1,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "51%",
    openY: "0%",
    openRotate: 0,
    scale: 1,
    zIndex: 7,
    width: "47%",
    parallaxZ: -2,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "2%",
    openY: "25%",
    openRotate: 0,
    scale: 1,
    zIndex: 6,
    width: "47%",
    parallaxZ: -1,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "51%",
    openY: "25%",
    openRotate: 0,
    scale: 1,
    zIndex: 5,
    width: "47%",
    parallaxZ: -2,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "2%",
    openY: "50%",
    openRotate: 0,
    scale: 1,
    zIndex: 4,
    width: "47%",
    parallaxZ: -1,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "51%",
    openY: "50%",
    openRotate: 0,
    scale: 1,
    zIndex: 3,
    width: "47%",
    parallaxZ: -2,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "2%",
    openY: "75%",
    openRotate: 0,
    scale: 1,
    zIndex: 2,
    width: "47%",
    parallaxZ: -1,
  },
  {
    closedX: "25%",
    closedY: "40%",
    closedRotate: 0,
    openX: "51%",
    openY: "75%",
    openRotate: 0,
    scale: 1,
    zIndex: 1,
    width: "47%",
    parallaxZ: -2,
  },
];

// Hook: device pixel ratio
const useDeviceScale = () => {
  const [scale, setScale] = useState(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1));
  useEffect(() => {
    const handleChange = () => setScale(window.devicePixelRatio || 1);
    const mediaQuery = window.matchMedia(`(resolution: ${scale}dppx)`);
    mediaQuery.addEventListener("change", handleChange);
    window.addEventListener("resize", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, [scale]);
  return scale;
};

// Hook: scroll progress for section
const useScrollProgress = (ref: React.RefObject<HTMLElement>, startOffset: number, endOffset: number) => {
  const [progress, setProgress] = useState(0);
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenterY = rect.top + rect.height / 2;

    const startTrigger = windowHeight * startOffset;
    const endTrigger = windowHeight * endOffset;

    if (sectionCenterY > startTrigger) {
      setProgress(0);
      return;
    }
    if (sectionCenterY < endTrigger) {
      setProgress(1);
      return;
    }

    const range = startTrigger - endTrigger;
    const current = startTrigger - sectionCenterY;
    setProgress(Math.min(1, Math.max(0, current / range)));
  }, [ref, startOffset, endOffset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return progress;
};

// Dev calibration (kept as-is)
const DEFAULT_START = 0.95;
const DEFAULT_END = 0.2;
const STORAGE_KEY = "card-animation-calibration";

const useDevCalibration = (deviceScale: number) => {
  const getInitialValues = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { start: parsed.start ?? DEFAULT_START, end: parsed.end ?? DEFAULT_END };
      }
    } catch {}
    return { start: DEFAULT_START, end: DEFAULT_END };
  };

  const initial = getInitialValues();
  const [baseStartOffset, setBaseStartOffset] = useState(initial.start);
  const [baseEndOffset, setBaseEndOffset] = useState(initial.end);
  const [isVisible, setIsVisible] = useState(false);

  const isDev = import.meta.env.DEV;

  const scaleFactor = 0.3;
  const adjustedStartOffset = Math.max(0.2, Math.min(1.5, baseStartOffset + (deviceScale - 1) * scaleFactor));
  const adjustedEndOffset = baseEndOffset;

  const resetToDefaults = () => {
    setBaseStartOffset(DEFAULT_START);
    setBaseEndOffset(DEFAULT_END);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ start: baseStartOffset, end: baseEndOffset }));
  }, [baseStartOffset, baseEndOffset]);

  return {
    startOffset: adjustedStartOffset,
    endOffset: adjustedEndOffset,
    baseStartOffset,
    baseEndOffset,
    setStartOffset: setBaseStartOffset,
    setEndOffset: setBaseEndOffset,
    isVisible,
    setIsVisible,
    isDev,
    deviceScale,
    resetToDefaults,
  };
};

const DevCalibrationPanel = ({
  baseStartOffset,
  adjustedStartOffset,
  setStartOffset,
  endOffset,
  setEndOffset,
  isVisible,
  setIsVisible,
  progress,
  deviceScale,
  onReset,
}: {
  baseStartOffset: number;
  adjustedStartOffset: number;
  setStartOffset: (v: number) => void;
  endOffset: number;
  setEndOffset: (v: number) => void;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
  progress: number;
  deviceScale: number;
  onReset: () => void;
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-yellow-400 transition-colors"
      >
        {isVisible ? "✕ סגור" : "⚙️ כיול"}
      </button>

      {isVisible && (
        <div className="mt-2 bg-black/90 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4 text-white text-sm min-w-[300px]">
          <h4 className="text-yellow-400 font-bold mb-3 text-center">כיול אנימציית כרטיסים</h4>

          <div className="mb-4 p-2 bg-blue-900/30 rounded border border-blue-500/30">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-xs">קנה מידה:</span>
              <span className="text-blue-400 font-mono font-bold">
                {deviceScale.toFixed(2)}x ({(deviceScale * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="mb-4 text-center">
            <span className="text-muted-foreground">Progress: </span>
            <span className="text-yellow-400 font-mono">{(progress * 100).toFixed(0)}%</span>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1">
              נקודת התחלה (בסיס): <span className="text-yellow-400">{(baseStartOffset * 100).toFixed(0)}%</span>
              <span className="text-green-400 mr-2"> → מותאם: {(adjustedStartOffset * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="1.3"
              step="0.05"
              value={baseStartOffset}
              onChange={(e) => setStartOffset(parseFloat(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-muted-foreground mb-1">
              נקודת סיום: <span className="text-yellow-400">{(endOffset * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="-0.5"
              max="0.2"
              step="0.05"
              value={endOffset}
              onChange={(e) => setEndOffset(parseFloat(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>

          <div className="text-xs text-muted-foreground bg-black/50 rounded p-2 font-mono mb-3">
            <div>base: {baseStartOffset.toFixed(2)}</div>
            <div>adjusted: {adjustedStartOffset.toFixed(2)}</div>
            <div>scale: {deviceScale.toFixed(2)}</div>
            <div>end: {endOffset.toFixed(2)}</div>
          </div>

          <button
            onClick={onReset}
            className="w-full bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded text-xs font-bold transition-colors"
          >
            🔄 איפוס לברירת מחדל
          </button>
        </div>
      )}
    </div>
  );
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const Index = () => {
  const { ref, isVisible } = useScrollReveal();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  const deviceScale = useDeviceScale();
  const calibration = useDevCalibration(deviceScale);
  const scrollProgress = useScrollProgress(sectionRef, calibration.startOffset, calibration.endOffset);

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

  const featuredServices = [
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
              <section
                id="services"
                ref={(el) => {
                  (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                  (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
                }}
                className={`scroll-reveal ${isVisible ? "visible" : ""} py-12 lg:py-20 bg-background`}
              >
                <div className={`${isMobile ? "px-2" : "container mx-auto px-4"}`}>
                  {/* CSS Parallax Container with perspective */}
                  <div
                    className="relative w-full max-w-6xl mx-auto"
                    style={{
                      height: isMobile ? "clamp(600px, 150vh, 900px)" : "clamp(800px, 120vh, 1000px)",
                      perspective: isMobile ? "none" : "1000px",
                      perspectiveOrigin: "center center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center w-full"
                      style={{
                        top: isMobile ? "14%" : "38%",
                        transform: `translateX(-50%) scale(${0.92 + scrollProgress * 0.08})`,
                        opacity: 0.95,
                      }}
                    >
                      <h2
                        className={`${
                          isMobile ? "text-2xl" : "text-4xl lg:text-6xl xl:text-7xl"
                        } font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8c777] via-[#d8b15a] to-[#8a6b2e] text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] drop-shadow-[0_2px_18px_rgba(216,177,90,0.22)]`}
                      >
                        השירותים שלנו
                      </h2>
                    </div>

                    {featuredServices.map((service, index) => (
                      <UnfoldingServiceCard
                        key={index}
                        service={service}
                        config={isMobile ? mobileScatterConfigs[index] : scatterConfigs[index]}
                        index={index}
                        isVisible={isVisible}
                        scrollProgress={scrollProgress}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </>
          }
        >
          <HeroWithCards />
        </HeroStickyCollapse>

        {/* LOCK Testimonials to transparent so background image never disappears */}
        <style>{`
          #testimonials { background: transparent !important; background-color: transparent !important; }
          #testimonials.bg-background { background: transparent !important; background-color: transparent !important; }
          #testimonials[class*="bg-"] { background-color: transparent !important; }
        `}</style>

        {/* Testimonials with fixed background */}
        <div className="relative z-30 overflow-hidden">
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

      {calibration.isDev && (
        <DevCalibrationPanel
          baseStartOffset={calibration.baseStartOffset}
          adjustedStartOffset={calibration.startOffset}
          setStartOffset={calibration.setStartOffset}
          endOffset={calibration.endOffset}
          setEndOffset={calibration.setEndOffset}
          isVisible={calibration.isVisible}
          setIsVisible={calibration.setIsVisible}
          progress={scrollProgress}
          deviceScale={calibration.deviceScale}
          onReset={calibration.resetToDefaults}
        />
      )}
    </div>
  );
};

interface UnfoldingServiceCardProps {
  service: { title: string; image: string; link: string };
  config: ScatterConfig;
  index: number;
  isVisible: boolean;
  scrollProgress: number;
  isMobile?: boolean;
}

const UnfoldingServiceCard = ({ service, config, isVisible, scrollProgress, isMobile }: UnfoldingServiceCardProps) => {
  const easedProgress = easeOutCubic(scrollProgress);

  const parsePercent = (str: string) => parseFloat(str.replace("%", ""));

  // JavaScript Parallax: כל כרטיס נע במהירות שונה לפי parallaxZ
  // parallaxZ שלילי יותר = נע לאט יותר = נראה רחוק יותר
  const parallaxOffset = isMobile ? 0 : config.parallaxZ * easedProgress * 25;

  const currentX =
    parsePercent(config.closedX) + (parsePercent(config.openX) - parsePercent(config.closedX)) * easedProgress;
  const baseY =
 const closedY = parsePercent(config.closedY);
const openY = parsePercent(config.openY);

// ✅ לא מאפשרים תזוזה למעלה: אם openY קטן מ-closedY → ננעלים על closedY
const safeOpenY = Math.max(openY, closedY);

const baseY = closedY + (safeOpenY - closedY) * easedProgress;
const currentY = baseY + parallaxOffset;
  const currentRotate = config.closedRotate + (config.openRotate - config.closedRotate) * easedProgress;

  const shadowIntensity = config.zIndex * 3;

  return (
    <Link
      to={service.link}
      className="block absolute group"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        width: config.width,
        zIndex: config.zIndex,
      }}
    >
      <div
        className="relative overflow-hidden rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:z-50 transform-gpu will-change-transform"
        style={{
          aspectRatio: "4/3",
          transform: `rotate(${currentRotate}deg) scale(${config.scale})`,
          boxShadow: `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0,0,0,0.25)`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 border-secondary-foreground border-dotted border-0 rounded-2xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent transition-opacity duration-300" />
        <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? "p-3" : "p-5 md:p-6"}`}>
          <h3
            className={`text-white ${isMobile ? "text-sm" : "text-lg md:text-xl lg:text-2xl"} font-bold drop-shadow-lg`}
          >
            {service.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default Index;
