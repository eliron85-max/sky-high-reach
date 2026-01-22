import { useRef, useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HeroStickyCollapse from "@/components/HeroStickyCollapse";
import SectionNavigator from "@/components/SectionNavigator";
import HomeTestimonials from "@/components/HomeTestimonials";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
  // Closed (stacked) position
  closedX: string;
  closedY: string;
  closedRotate: number;
  // Open (scattered) position
  openX: string;
  openY: string;
  openRotate: number;
  // Common
  scale: number;
  zIndex: number;
  width: string;
}

// Desktop: 8 cards - closed (stacked center) → open (4x2 grid spread with title gap)
// All rotations removed for clean look
const scatterConfigs: ScatterConfig[] = [
  // Row 1 - 4 cards across top (right to left for RTL)
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
  },
  // Row 2 - 4 cards across bottom (right to left for RTL) - more space for title
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
  },
];

// Mobile: 8 cards - closed (stacked center) → open (2x4 grid spread)
const mobileScatterConfigs: ScatterConfig[] = [
  // Column 1 (left) + Column 2 (right) alternating rows
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
  },
];

// Hook to detect device pixel ratio (display scaling)
const useDeviceScale = () => {
  const [scale, setScale] = useState(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1));
  useEffect(() => {
    const handleChange = () => setScale(window.devicePixelRatio || 1);

    // Listen for resolution changes (e.g., moving window between monitors)
    const mediaQuery = window.matchMedia(`(resolution: ${scale}dppx)`);
    mediaQuery.addEventListener("change", handleChange);

    // Also listen for resize which can indicate scale changes
    window.addEventListener("resize", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, [scale]);
  return scale;
};

// Hook to track scroll progress within a section
const useScrollProgress = (ref: React.RefObject<HTMLElement>, startOffset: number, endOffset: number) => {
  const [progress, setProgress] = useState(0);
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Keep cards stacked until the SECTION CENTER hits the calibrated point
    const sectionCenterY = rect.top + rect.height / 2;

    // startOffset: 0.5 = viewport center, 0.3 = higher, 0.7 = lower
    const startTrigger = windowHeight * startOffset;
    // endOffset: negative means section center above viewport
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
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return progress;
};
// Dev mode calibration state (only visible in development)
// Dev mode calibration state (only visible in development)
const DEFAULT_START = 0.95;
const DEFAULT_END = 0.2;
const STORAGE_KEY = "card-animation-calibration";

const useDevCalibration = (deviceScale: number) => {
  const getInitialValues = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          start: parsed.start ?? DEFAULT_START,
          end: parsed.end ?? DEFAULT_END,
        };
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

// Dev Calibration Panel Component
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
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-yellow-400 transition-colors"
      >
        {isVisible ? "✕ סגור" : "⚙️ כיול"}
      </button>

      {/* Panel */}
      {isVisible && (
        <div className="mt-2 bg-black/90 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4 text-white text-sm min-w-[300px]">
          <h4 className="text-yellow-400 font-bold mb-3 text-center">כיול אנימציית כרטיסים</h4>

          {/* Device Scale Info */}
          <div className="mb-4 p-2 bg-blue-900/30 rounded border border-blue-500/30">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-xs">קנה מידה:</span>
              <span className="text-blue-400 font-mono font-bold">
                {deviceScale.toFixed(2)}x ({(deviceScale * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Current Progress */}
          <div className="mb-4 text-center">
            <span className="text-muted-foreground">Progress: </span>
            <span className="text-yellow-400 font-mono">{(progress * 100).toFixed(0)}%</span>
          </div>

          {/* Start Trigger */}
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

          {/* End Trigger */}
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

          {/* Values Display */}
          <div className="text-xs text-muted-foreground bg-black/50 rounded p-2 font-mono mb-3">
            <div>base: {baseStartOffset.toFixed(2)}</div>
            <div>adjusted: {adjustedStartOffset.toFixed(2)}</div>
            <div>scale: {deviceScale.toFixed(2)}</div>
            <div>end: {endOffset.toFixed(2)}</div>
          </div>

          {/* Reset Button */}
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

// Easing function for smoother animation
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const Index = () => {
  const { ref, isVisible } = useScrollReveal();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  // Device scale detection and calibration
  const deviceScale = useDeviceScale();
  const calibration = useDevCalibration(deviceScale);
  const scrollProgress = useScrollProgress(sectionRef, calibration.startOffset, calibration.endOffset);

  // Parallax refs for CTA section
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaLine1Ref = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const { style: ctaLine1Style } = useParallax(ctaLine1Ref, {
    speed: 0.3,
  });
  const { style: ctaContentStyle } = useParallax(ctaContentRef, {
    speed: 0.15,
  });
  const sections = [
    {
      id: "hero",
      label: "ראשי",
    },
    {
      id: "services",
      label: "שירותים",
    },
    {
      id: "testimonials",
      label: "המלצות",
    },
    {
      id: "cta",
      label: "צור קשר",
    },
  ];
  const featuredServices = [
    {
      title: "שיקום מעטפת",
      image: facadeRestorationImage,
      link: "/facade-restoration",
    },
    {
      title: "איטום בגובה",
      image: waterproofingImage,
      link: "/waterproofing",
    },
    {
      title: "הרחקת מעופפים",
      image: birdControlImage,
      link: "/bird-control",
    },
    {
      title: "עבודות מיוחדות",
      image: specialProjectsImage,
      link: "/special-projects",
    },
    {
      title: "חיפוי אבן",
      image: stoneVeneerImage,
      link: "/stone-veneer",
    },
    {
      title: "ביטול צווי הריסה",
      image: demolitionOrdersImage,
      link: "/demolition-orders",
    },
    {
      title: "התקנת צנרת ומרזבים",
      image: pipingGuttersImage,
      link: "/special-projects",
    },
    {
      title: "פתרונות בגובה",
      image: heightSolutionsImage,
      link: "/special-projects",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingLanguageSwitcher />
      <ScrollToTopButton />
      <SectionNavigator sections={sections} />
      <main>
        <HeroStickyCollapse
          collapseDistance={650}
          mobileCollapseDistance={450}
          after={
            <>
              {/* Featured Services Section - Scattered Gallery with Unfold Animation */}
              <section
                id="services"
                ref={(el) => {
                  (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                  (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
                }}
                className={`scroll-reveal ${isVisible ? "visible" : ""} py-12 lg:py-20 bg-background`}
              >
                <div className={`${isMobile ? "px-2" : "container mx-auto px-4"}`}>
                  <div
                    className="relative w-full max-w-6xl mx-auto"
                    style={{
                      height: isMobile ? "clamp(600px, 150vh, 900px)" : "clamp(800px, 120vh, 1000px)",
                    }}
                  >
                    {/* Title - centered between rows */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center w-full"
                      style={{
                        top: isMobile ? "14%" : "38%",
                        transform: `translateX(-50%) scale(${0.92 + scrollProgress * 0.08})`,
                        opacity: 0.95,
                      }}
                    >
                      <h2
                        className={`${isMobile ? "text-2xl" : "text-4xl lg:text-6xl xl:text-7xl"} font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8c777] via-[#d8b15a] to-[#8a6b2e] text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] drop-shadow-[0_2px_18px_rgba(216,177,90,0.22)]`}
                      >
                        השירותים שלנו
                      </h2>
                    </div>

                    {/* Cards */}
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

              {/* Testimonials Section */}
              <HomeTestimonials />

              {/* CTA Section with Parallax */}
              <section
                id="cta"
                ref={ctaRef}
                className="py-16 lg:py-24 bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden"
              >
                {/* Decorative elements */}
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
            </>
          }
        >
          <Hero />
        </HeroStickyCollapse>
      </main>
      <Footer />

      {/* Dev Calibration Panel - only in development */}
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

// Unfolding Service Card - Animates from stacked to scattered based on scroll
interface UnfoldingServiceCardProps {
  service: {
    title: string;
    image: string;
    link: string;
  };
  config: ScatterConfig;
  index: number;
  isVisible: boolean;
  scrollProgress: number;
  isMobile?: boolean;
}
const UnfoldingServiceCard = ({
  service,
  config,
  index,
  isVisible,
  scrollProgress,
  isMobile,
}: UnfoldingServiceCardProps) => {
  // Apply easing to scroll progress
  const easedProgress = easeOutCubic(scrollProgress);

  // Interpolate between closed and open positions
  const parsePercent = (str: string) => parseFloat(str.replace("%", ""));
  const currentX =
    parsePercent(config.closedX) + (parsePercent(config.openX) - parsePercent(config.closedX)) * easedProgress;
  const currentY =
    parsePercent(config.closedY) + (parsePercent(config.openY) - parsePercent(config.closedY)) * easedProgress;
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
        className={`
          relative overflow-hidden rounded-xl
          transition-shadow duration-300 ease-out
          hover:scale-105 hover:z-50
          transform-gpu will-change-transform
        `}
        style={{
          aspectRatio: isMobile ? "4/3" : "4/3",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 my-[178px] mb-[28px] mr-0 ml-[46px] py-0 px-0 pb-[36px] opacity-100" />
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
