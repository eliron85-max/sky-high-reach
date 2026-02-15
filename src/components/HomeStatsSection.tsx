// src/components/HomeStatsSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, target, duration]);

  return value;
}

function AnimatedStat({ value, show }: { value: string; show: boolean }) {
  const match = value.match(/(\d+)/);
  const numeric = match ? parseInt(match[1], 10) : 0;

  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice(match.index! + match[1].length) : "";

  const animated = useCountUp(numeric, 2000, show);

  return (
    <>
      {prefix}
      {animated}
      {suffix}
    </>
  );
}

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
      className="relative z-0 w-full overflow-hidden bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 dark:bg-black"
    >
      {/* מסך אחד בלבד — בלי רווח מעל */}
      <div className="relative min-h-[100svh]">
        {/* sticky layer */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-16">
              {/* LEFT */}
              <div className="lg:w-[45%] flex flex-col">
                <div className="relative mb-10 sm:mb-14">
                  <span className="absolute -right-4 top-0 hidden h-24 w-[6px] bg-[#d7b46a] sm:block" />

                  <h2 className="text-right text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] tracking-tight">
                    <span className="block text-[#d7b46a] font-medium">{titleGold}</span>
                    <span className="block text-gray-800 dark:text-white font-light">{titleBlack}</span>
                  </h2>
                </div>

                <div className="space-y-8 sm:space-y-10">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-center sm:text-right transition-all duration-700 ease-out",
                        show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                        index === 0 && "delay-[0ms]",
                        index === 1 && "delay-[200ms]",
                        index === 2 && "delay-[400ms]",
                      )}
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#d7b46a]">
                        <AnimatedStat value={stat.value} show={show} />
                      </div>

                      <div className="mt-1 text-sm sm:text-base text-gray-500 dark:text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT IMAGES */}
              <div className="lg:w-[55%] w-full">
                <div className="relative h-[500px] sm:h-[600px] lg:h-[650px]">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute overflow-hidden shadow-lg transition-all duration-700 ease-out",
                        show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                        i === 0 && "left-[5%] top-0 w-[45%] h-[38%] delay-[100ms]",
                        i === 1 && "right-0 top-[25%] w-[48%] h-[35%] delay-[300ms]",
                        i === 2 && "left-0 top-[30%] w-[48%] h-[35%] delay-[500ms]",
                        i === 3 && "right-[10%] bottom-0 w-[50%] h-[32%] delay-[700ms]",
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
