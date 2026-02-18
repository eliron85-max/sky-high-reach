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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop: horizontal scroll-jacking
  const trackWidth = items.length * CARD_W + (items.length - 1) * GAP;
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const maxTranslate = Math.max(0, trackWidth - viewportWidth + 120);
  const translateX = progress * maxTranslate;
  const lineProgress = progress;

  useEffect(() => {
    if (isMobile) return;
    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalScroll = vh * SCROLL_VH;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);

      const trackEl = document.querySelector('[data-timeline-track]') as HTMLElement;
      const lineEl = document.querySelector('[data-timeline-line]') as HTMLElement;
      if (trackEl) trackEl.style.transform = `translate3d(${p * maxTranslate}px, 0, 0)`;
      if (lineEl) lineEl.style.width = `${p * 100}%`;
    };

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [isMobile, maxTranslate]);

  // ─── MOBILE: simple vertical cards ───
  if (isMobile) {
    return (
      <section className="py-16 px-4 bg-background" dir="rtl">
        <motion.div
          ref={headerRef}
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#c9a84c] text-sm tracking-[0.3em]">{subtitle}</span>
          <h2 className="text-3xl font-light mt-4">
            <span className="bg-gradient-to-l from-[#e8d5a3] via-[#c9a84c] to-[#9a7530] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative max-w-sm mx-auto">
          {/* Central line */}
          <div className="absolute right-6 top-0 bottom-0 w-px bg-border" />

          {items.map((item, i) => (
            <motion.div
              key={i}
              className="relative pr-16 pb-8 last:pb-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Step dot on line */}
              <div className="absolute right-[14px] top-0 w-6 h-6 rounded-full bg-[#c9a84c] border-2 border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-background" />
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-[#c9a84c]/30 bg-card/50 backdrop-blur-md p-5 shadow-[0_0_20px_rgba(201,168,76,0.08)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[#c9a84c] text-xs font-bold">שלב {item.step}</span>
                    <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // ─── DESKTOP: horizontal scroll-jacking ───
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
        <div className="relative mx-16 mb-6">
          <div className="h-px bg-border w-full" />
          <div
            data-timeline-line
            className="absolute top-0 right-0 h-px bg-[#c9a84c] transition-none"
            style={{ width: `${lineProgress * 100}%` }}
          />
          {/* Step markers */}
          <div className="flex justify-between absolute inset-x-0 -top-3">
            {items.map((_, i) => {
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
        <div className="overflow-hidden px-16">
          <div
            data-timeline-track
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
