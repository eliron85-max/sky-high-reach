// src/components/HomeStatsSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type StatItem = {
  value: string;
  label: string;
};

type Props = {
  titleBlack: string;
  titleGold: string;
  stats: StatItem[];
  images: string[];
};

export default function HomeStatsSection({
  titleBlack,
  titleGold,
  stats,
  images,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-black py-16 sm:py-20 lg:py-28"
    >

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* ===== LEFT: TEXT & STATS ===== */}
          <div className="lg:w-[45%] flex flex-col">
            {/* כותרת */}
            <div className="relative mb-10 sm:mb-14">
              <span className="absolute -right-4 top-0 hidden h-24 w-[6px] bg-[#d7b46a] sm:block" />
              <h2 className="text-right text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] tracking-tight">
                <span className="block text-[#d7b46a] font-medium">{titleGold}</span>
                <span className="block text-white font-light">{titleBlack}</span>
              </h2>
            </div>

            {/* סטטיסטיקות */}
            <div className="space-y-8 sm:space-y-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-center sm:text-right",
                    show
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0",
                    "transition-all duration-700",
                    index === 1 && "delay-100",
                    index === 2 && "delay-200"
                  )}
                >
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#d7b46a]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm sm:text-base text-white/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: IMAGES GRID ===== */}
          <div className="lg:w-[58%] w-full">
            <div className="relative h-[550px] sm:h-[680px] lg:h-[750px]">
              {/* תמונה 1 - למעלה ימין */}
              {images[0] && (
                <div
                  className={cn(
                    "absolute left-[3%] top-0 w-[52%] h-[42%] overflow-hidden shadow-2xl rounded-sm",
                    show
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                    "transition-all duration-700"
                  )}
                >
                  <img
                    src={images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* תמונה 2 - אמצע שמאל */}
              {images[1] && (
                <div
                  className={cn(
                    "absolute right-0 top-[22%] w-[52%] h-[38%] overflow-hidden shadow-2xl rounded-sm",
                    show
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                    "transition-all duration-700 delay-100"
                  )}
                >
                  <img
                    src={images[1]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* תמונה 3 - אמצע ימין */}
              {images[2] && (
                <div
                  className={cn(
                    "absolute left-0 top-[28%] w-[52%] h-[38%] overflow-hidden shadow-2xl rounded-sm",
                    show
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                    "transition-all duration-700 delay-150"
                  )}
                >
                  <img
                    src={images[2]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* תמונה 4 - למטה */}
              {images[3] && (
                <div
                  className={cn(
                    "absolute right-[5%] bottom-0 w-[55%] h-[36%] overflow-hidden shadow-2xl rounded-sm",
                    show
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                    "transition-all duration-700 delay-200"
                  )}
                >
                  <img
                    src={images[3]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
