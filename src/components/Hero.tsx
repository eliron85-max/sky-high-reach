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
    { id: 1, title: t("hero.slide2Title"), subtitle: t("hero.slide2Subtitle") },
    { id: 2, title: t("hero.slide3Title"), subtitle: t("hero.slide3Subtitle") },
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
      <div className="container relative z-10 px-4 md:px-6 mx-auto flex items-center justify-center h-full">
        <div
          ref={contentRef}
          style={contentStyle}
          className="max-w-3xl mx-auto text-center"
        >
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

      {/* Vertical dot indicators on the side */}
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

    </section>
  );
};

export default Hero;
