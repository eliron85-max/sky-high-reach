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
      className="relative z-0 w-full overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#0a0f1a] to-[#050810] cinematic-grain"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-[-10%] h-[600px] w-[600px] rounded-full blur-[160px] opacity-25"
        style={{ background: "radial-gradient(circle, #c9a84c 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px] opacity-15"
        style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }}
      />

      <div className="relative min-h-[100svh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="flex w-full flex-col items-start gap-12 lg:flex-row lg:gap-20">
              <div className="lg:w-[45%] flex flex-col">
                <div className="relative mb-12 sm:mb-16">
                  <span
                    className="absolute -right-4 top-2 hidden h-28 w-[3px] sm:block"
                    style={{ background: "linear-gradient(to bottom, #c9a84c, transparent)" }}
                  />
                  <span className="block text-[#c9a84c] text-xs md:text-sm tracking-[0.45em] uppercase mb-5">
                    מספרים שמדברים
                  </span>
                  <h2 className="text-right text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight font-light">
                    <span className="block gold-shimmer-text">{titleGold}</span>
                    <span className="block text-white/95 mt-2">{titleBlack}</span>
                  </h2>
                  <div className="mt-8 h-px w-24 gold-divider" />
                </div>

                <div className="space-y-10 sm:space-y-12">
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
                      <div
                        className="text-6xl sm:text-7xl lg:text-8xl font-light text-gold-gradient tracking-tight leading-none"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <AnimatedStat value={stat.value} show={show} />
                      </div>
                      <div className="mt-3 text-sm sm:text-base text-white/60 tracking-wide font-light">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-[55%] w-full">
                <div className="relative h-[500px] sm:h-[600px] lg:h-[650px]">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute overflow-hidden rounded-2xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        show ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                        i === 0 && "left-[5%] top-0 w-[45%] h-[38%] delay-[100ms]",
                        i === 1 && "right-0 top-[25%] w-[48%] h-[35%] delay-[300ms]",
                        i === 2 && "left-0 top-[30%] w-[48%] h-[35%] delay-[500ms]",
                        i === 3 && "right-[10%] bottom-0 w-[50%] h-[32%] delay-[700ms]",
                      )}
                      style={{
                        boxShadow:
                          "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.18)",
                      }}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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

