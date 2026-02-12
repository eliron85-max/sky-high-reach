import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, dir } = useTranslation();

  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { style: contentStyle } = useParallax(contentRef, { speed: 0.1 });

  const slides = [
    { id: 1, title: t("hero.slide1Title"), subtitle: t("hero.slide1Subtitle") },
    { id: 2, title: t("hero.slide2Title"), subtitle: t("hero.slide2Subtitle") },
    { id: 3, title: t("hero.slide3Title"), subtitle: t("hero.slide3Subtitle") },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section ref={heroRef} dir={dir} className="relative h-screen flex items-center overflow-hidden">
      {/* Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero.webm" type="video/webm" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 via-transparent to-[#c9a84c]/5" />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 pt-header-offset lg:pt-header-offset-lg mx-auto">
        <div
          ref={contentRef}
          style={contentStyle}
          className={`max-w-xl mx-auto text-center md:mx-0 ${
            dir === "rtl" ? "md:mr-8 lg:mr-16 md:text-right" : "md:ml-8 lg:ml-16 md:text-left"
          }`}
        >
          <div key={currentSlide} className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]">
                {slides[currentSlide].title}
              </span>
            </h1>
            <p className="text-base md:text-4xl text-[#e8d5a3]/80 mb-6 leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c] text-black font-bold hover:from-[#f0ddb0] hover:to-[#d4af37] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {t("hero.ctaPrimary")}
            </Button>

            <Button
              onClick={() => scrollToSection("projects")}
              size="lg"
              variant="outline"
              className="border-[#c9a84c]/50 text-[#e8d5a3] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all"
            >
              {t("hero.ctaSecondary")}
            </Button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center md:justify-start gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]" : "w-4 bg-[#c9a84c]/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue covering green strip */}
      <button
        type="button"
        onClick={() => scrollToSection("next-section")}
        className="absolute left-1/2 -translate-x-1/2 z-30
                   bottom-[-20px]
                   h-14 w-14 rounded-full
                   bg-black/40 backdrop-blur-md
                   border border-[#c9a84c]/60
                   shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                   grid place-items-center"
        aria-label="Scroll down"
      >
        <span className="relative h-8 w-5 rounded-full border-2 border-[#e8d5a3]">
          <span className="absolute left-1/2 -translate-x-1/2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e8d5a3] animate-bounce" />
        </span>
        <ChevronDown size={14} className="absolute bottom-2 text-[#e8d5a3] opacity-70" />
      </button>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute ${
          dir === "rtl" ? "left-4" : "right-4"
        } top-1/2 -translate-y-1/2 z-20 text-[#c9a84c]/60 hover:text-[#e8d5a3] transition-colors p-2 hover:bg-[#c9a84c]/10 rounded-full`}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute ${
          dir === "rtl" ? "right-4" : "left-4"
        } top-1/2 -translate-y-1/2 z-20 text-[#c9a84c]/60 hover:text-[#e8d5a3] transition-colors p-2 hover:bg-[#c9a84c]/10 rounded-full`}
      >
        <ChevronRight size={32} />
      </button>
    </section>
  );
};

export default Hero;
