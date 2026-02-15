import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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

const CARD_W = 420;
const GAP = 48;
const SCROLL_VH = 3;

export default function HorizontalTimeline({ title, subtitle, items }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalScroll = vh * SCROLL_VH;
      const scrolled = -rect.top;
      const raw = scrolled / totalScroll;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  const trackWidth = items.length * CARD_W + (items.length - 1) * GAP;
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const maxTranslate = Math.max(0, trackWidth - viewportWidth + 120);
  const translateX = -progress * maxTranslate;
  const lineProgress = progress;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${(SCROLL_VH + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center bg-background">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-10 px-4"
          dir="rtl"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">
            {subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mt-4">
            <span className="bg-gradient-to-l from-[#e8d5a3] via-[#c9a84c] to-[#9a7530] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        </motion.div>

        {/* Track line */}
        <div className="relative mx-8 md:mx-16 mb-6">
          <div className="h-px bg-border w-full" />
          <div
            className="absolute top-0 right-0 h-px bg-[#c9a84c] transition-none"
            style={{ width: `${lineProgress * 100}%` }}
          />
          {/* Step markers on the line */}
          <div className="flex justify-between absolute inset-x-0 -top-3">
            {items.map((item, i) => {
              const pos = i / (items.length - 1);
              const isActive = progress >= pos - 0.05;
              return (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center",
                    isActive
                      ? "bg-[#c9a84c] border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.5)] scale-110"
                      : "bg-background border-border"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isActive ? "bg-background" : "bg-border"
                  )} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="overflow-hidden px-8 md:px-16">
          <div
            className="flex will-change-transform"
            style={{
              gap: `${GAP}px`,
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: "transform 60ms linear",
            }}
          >
            {items.map((item, i) => {
              const cardPos = i / (items.length - 1);
              const isVisible = progress >= cardPos - 0.15;
              return (
                <motion.div
                  key={i}
                  className="flex-shrink-0 group"
                  style={{ width: `${CARD_W}px` }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  dir="rtl"
                >
                  {/* Icon card */}
                  <div className={cn(
                    "rounded-2xl border p-8 mb-5 transition-all duration-300",
                    "bg-card/50 backdrop-blur-md",
                    isVisible
                      ? "border-[#c9a84c]/40 shadow-[0_0_30px_rgba(201,168,76,0.12)]"
                      : "border-border/20"
                  )}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-[#c9a84c] text-sm font-bold tracking-wider">
                          שלב {item.step}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-medium text-foreground">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-8">
          <motion.div
            className="inline-flex items-center gap-2 text-muted-foreground text-xs"
            animate={{ opacity: progress > 0.9 ? 0 : 0.6 }}
          >
            <span>גלול למטה</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
