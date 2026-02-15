import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TimelineItem = {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Props = {
  title: string;
  subtitle?: string;
  items: TimelineItem[];
};

export default function HorizontalTimeline({ title, subtitle, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = el.offsetHeight - vh;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalCards = items.length;
  const translateX = -(scrollProgress * (totalCards - 1) * 100) / totalCards;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(totalCards + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-gradient-to-b from-background via-background to-background/95">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        {/* Title */}
        <div className="text-center px-4 mb-8 sm:mb-12" dir="rtl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
            <span className="bg-gradient-to-l from-[#e8d5a3] via-[#c9a84c] to-[#9a7530] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          {subtitle && (
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mx-auto w-[80%] max-w-3xl h-[2px] bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] rounded-full transition-none"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Cards track */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-none gap-6 px-[10vw]"
            style={{
              transform: `translateX(${translateX}%)`,
              width: `${totalCards * 100}%`,
            }}
          >
            {items.map((item, i) => {
              const cardProgress = scrollProgress * (totalCards - 1);
              const distFromActive = Math.abs(cardProgress - i);
              const isActive = distFromActive < 0.5;
              const scale = isActive ? 1 : 0.9;
              const opacity = isActive ? 1 : 0.4;

              return (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: `${100 / totalCards}%` }}
                >
                  <div
                    className={cn(
                      "relative w-full max-w-[500px] p-8 sm:p-10 rounded-2xl border transition-all duration-300",
                      "bg-card/50 backdrop-blur-md",
                      isActive
                        ? "border-[#c9a84c]/40 shadow-[0_0_40px_rgba(201,168,76,0.15)]"
                        : "border-border/20"
                    )}
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                      transition: "transform 0.3s ease, opacity 0.3s ease",
                    }}
                    dir="rtl"
                  >
                    {/* Step badge */}
                    <div className="absolute -top-4 right-6 px-4 py-1 rounded-full bg-[#c9a84c] text-black text-xs font-bold tracking-wider">
                      שלב {item.step}
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                        {item.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-medium text-foreground">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>

                    {/* Connecting line */}
                    {i < totalCards - 1 && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-6 h-[2px] bg-gradient-to-l from-[#c9a84c]/40 to-transparent hidden lg:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, i) => {
            const cardProgress = scrollProgress * (totalCards - 1);
            const isActive = Math.abs(cardProgress - i) < 0.5;
            return (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isActive ? "bg-[#c9a84c] w-6" : "bg-white/20"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
