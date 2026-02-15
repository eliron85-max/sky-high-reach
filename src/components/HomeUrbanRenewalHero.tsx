// src/components/HomeUrbanRenewalHero.tsx
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
type Props = {
  images: string[]; // מערך תמונות לקרוסלה
  titleTop: string;
  titleGold: string;
  subtitle: string;
  autoplayDelay?: number; // זמן בין החלפות במילישניות (ברירת מחדל: 4000)

  // אופציונלי
  logoSrc?: string;
  logoAlt?: string;
};
export default function HomeUrbanRenewalHero({
  images,
  titleTop,
  titleGold,
  subtitle,
  autoplayDelay = 4000,
  logoSrc,
  logoAlt = "logo"
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Intersection observer for reveal animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShow(true);
        io.disconnect();
      }
    }, {
      threshold: 0.2
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay carousel
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [images.length, autoplayDelay]);

  // Get indices for multiple images (offset for variety)
  const secondaryIndex = (currentIndex + 1) % images.length;
  const tertiaryIndex = (currentIndex + 2) % images.length;
  const quaternaryIndex = (currentIndex + 3) % images.length;
  return (
    <section
      ref={sectionRef}
      dir="ltr"
      className={cn(
      "relative w-full overflow-hidden bg-white",
        "py-12 sm:py-16 lg:py-24"
      )}
    >
      {/* רקע גריד עדין - קווים */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-[1600px] pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-6">
          {/* ===== LEFT: IMAGES ===== */}
          <div className="order-2 lg:order-1 lg:w-[85%] lg:-ml-4">
            <div className="grid grid-cols-2 gap-1 h-[500px] sm:h-[650px] lg:h-[800px]">
              {/* תמונה 1 - שמאל */}
              <div
                className={cn(
                  "relative overflow-hidden bg-neutral-200",
                  show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                  "transition-all duration-700"
                )}
              >
                {images.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              {/* תמונה 2 - ימין */}
              <div
                className={cn(
                  "relative overflow-hidden bg-neutral-200",
                  show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                  "transition-all duration-700 delay-100"
                )}
              >
                {images.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
                      index === secondaryIndex ? "opacity-100" : "opacity-0"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: TEXT ===== */}
          <div className="order-1 lg:order-2 lg:w-[15%] flex items-center" dir="rtl">
            <div className="w-full lg:pr-8">
              <div className="relative">
                <span className="absolute -right-4 top-0 hidden h-20 w-[6px] bg-[#d7b46a] sm:block" />
                <h2 className="text-right text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.15] tracking-tight text-black">
                  <span className="block font-light">{titleTop}</span>
                  <span className="block text-[#d7b46a] font-light mt-1">
                    {titleGold}
                  </span>
                </h2>
              </div>

              <p className="mt-6 sm:mt-8 text-right text-sm sm:text-[15px] lg:text-base leading-relaxed text-black/70 max-w-md mr-auto">
                {subtitle}
              </p>

              {/* לוגו */}
              {logoSrc && (
                <div className="mt-8 sm:mt-10 flex justify-end">
                  <img src={logoSrc} alt={logoAlt} className="h-10 sm:h-12 w-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}