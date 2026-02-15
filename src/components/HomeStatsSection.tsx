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

export default function HomeStatsSection({ titleBlack, titleGold, stats, images }: Props) {
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
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative z-0 w-full overflow-hidden bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 dark:bg-none dark:bg-black"
    >
      {/* נותן “מסלול גלילה” כדי שהסטטיסטיקות ישארו sticky */}
      <div className="relative min-h-[200vh]">
        {/* השכבה שנדבקת למסך */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-16">
              {/* ===== LEFT: TEXT & STATS ===== */}
              <div className="lg:w-[45%] flex flex-col">
                {/* כותרת */}
                <div className="relative mb-10 sm:mb-14">
                  <span className="absolute -right-4 top-0 hidden h-24 w-[6px] bg-[#d7b46a] sm:block" />
                  <h2 className="text-right text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] tracking-tight">
                    <span className="block text-[#d7b46a] font-medium">{titleGold}</span>
                    <span className="block text-gray-800 dark:text-white font-light">{titleBlack}</span>
                  </h2>
                </div>

                {/* סטטיסטיקות */}
                <div className="space-y-8 sm:space-y-10">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-center sm:text-right",
                        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                        "transition-all duration-700",
                        index === 1 && "delay-100",
                        index === 2 && "delay-200",
                      )}
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#d7b46a]">{stat.value}</div>
                      <div className="mt-1 text-sm sm:text-base text-gray-500 dark:text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== RIGHT: IMAGES GRID ===== */}
              <div className="lg:w-[55%] w-full">
                <div className="relative h-[500px] sm:h-[600px] lg:h-[650px]">
                  {/* תמונה 1 - למעלה ימין */}
                  {images[0] && (
                    <div
                      className={cn(
                        "absolute left-[5%] top-0 w-[45%] h-[38%] overflow-hidden shadow-lg",
                        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                        "transition-all duration-700",
                      )}
                    >
                      <img src={images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}

                  {/* תמונה 2 - אמצע שמאל */}
                  {images[1] && (
                    <div
                      className={cn(
                        "absolute right-0 top-[25%] w-[48%] h-[35%] overflow-hidden shadow-lg",
                        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                        "transition-all duration-700 delay-100",
                      )}
                    >
                      <img src={images[1]} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}

                  {/* תמונה 3 - אמצע ימין */}
                  {images[2] && (
                    <div
                      className={cn(
                        "absolute left-0 top-[30%] w-[48%] h-[35%] overflow-hidden shadow-lg",
                        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                        "transition-all duration-700 delay-150",
                      )}
                    >
                      <img src={images[2]} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}

                  {/* תמונה 4 - למטה */}
                  {images[3] && (
                    <div
                      className={cn(
                        "absolute right-[10%] bottom-0 w-[50%] h-[32%] overflow-hidden shadow-lg",
                        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                        "transition-all duration-700 delay-200",
                      )}
                    >
                      <img src={images[3]} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* spacer קטן כדי שלא יחתך בסוף ה-sticky */}
        <div className="h-[1px]" />
      </div>
    </section>
  );
}
