import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export type ArcCardItem = {
  title: string;
  image: string;
  href?: string;
};

type Props = {
  items: ArcCardItem[];
  title?: string;
  subtitle?: string;
  backgroundClassName?: string;
  className?: string;
};

export default function ArcCardsSection({
  items,
  title = "השירותים שלנו",
  subtitle,
  backgroundClassName = "bg-[#bfe7d6]",
  className,
}: Props) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const safeItems = useMemo(() => (items ?? []).filter(Boolean), [items]);
  const total = safeItems.length;

  // Progress 0-1 based on scroll position within section
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setProgress(1);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = rect.top - vh;
      const end = rect.bottom;
      const range = end - start;
      if (range <= 0) return;
      const raw = -start / range;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getCardState = useCallback(
    (index: number) => {
      const cardProgress = total > 1 ? progress * total : progress;
      const cardStart = index;
      const localProgress = cardProgress - cardStart;

      if (localProgress < 0) return { phase: "waiting" as const, progress: 0 };
      if (localProgress <= 1) return { phase: "active" as const, progress: localProgress };
      return { phase: "exited" as const, progress: 1 };
    },
    [progress, total],
  );

  return (
    <section
      ref={sectionRef}
      className={cn("relative", className)}
      dir="rtl"
      style={{
        height: `${100 + total * 300}vh`,
        backgroundImage: `url('/images/services-cards-bg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .scroll-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
        .scroll-card-track {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scroll-card {
          position: absolute;
          width: clamp(340px, 72vw, 800px);
          max-width: 94vw;
          will-change: transform, opacity;
        }
      `}</style>

      <div ref={trackRef} className="scroll-card-track">
        <div className="absolute top-8 sm:top-12 inset-x-0 text-center z-10 pointer-events-none">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            {title}
          </h2>
          {subtitle ? <p className="mt-3 text-base sm:text-lg text-foreground/70">{subtitle}</p> : null}
        </div>

        {safeItems.map((it, i) => {
          const state = getCardState(i);
          const progressT = state.progress;

          let translateX: number;
          let rotate: number;
          let opacity: number;
          let scale: number;

          if (state.phase === "waiting") {
            translateX = 120;
            rotate = 12;
            opacity = 0;
            scale = 0.92;
          } else if (state.phase === "exited") {
            translateX = -120;
            rotate = -12;
            opacity = 0;
            scale = 0.92;
          } else {
            // Smooth ease with longer center dwell time
            // t: 0→0.3 = entering, 0.3→0.7 = center, 0.7→1 = exiting
            let eased: number;
            if (progressT < 0.25) {
              // Entering phase: ease out
              eased = progressT / 0.25 * 0.5;
            } else if (progressT < 0.75) {
              // Center phase: stay centered
              eased = 0.5;
            } else {
              // Exiting phase: ease in
              eased = 0.5 + ((progressT - 0.75) / 0.25) * 0.5;
            }

            translateX = 80 - eased * 160; // 80 → 0 → -80
            rotate = 10 - eased * 20; // 10 → 0 → -10
            scale = 0.94 + Math.sin(eased * Math.PI) * 0.08; // peaks at ~1.02 in center
            
            // Opacity: quick fade in, hold, quick fade out
            if (progressT < 0.15) {
              opacity = progressT / 0.15;
            } else if (progressT > 0.85) {
              opacity = (1 - progressT) / 0.15;
            } else {
              opacity = 1;
            }
          }

          return (
            <a
              key={`${it.title}-${i}`}
              href={it.href || "#"}
              aria-label={it.title}
              className="scroll-card group"
              style={{
                transform: `translateX(${translateX}vw) rotate(${rotate}deg) scale(${scale})`,
                opacity,
                zIndex: state.phase === "active" ? 10 : 1,
                pointerEvents: state.phase === "active" && progressT > 0.2 && progressT < 0.8 ? "auto" : "none",
              }}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  "rounded-[36px] sm:rounded-[48px]",
                  "bg-card text-card-foreground",
                  "shadow-[0_40px_100px_hsl(220_13%_9%_/0.35)]",
                  "ring-1 ring-border",
                )}
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                  <img
                    src={it.image}
                    alt={it.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="relative px-6 sm:px-8 py-5 sm:py-7">
                  <div className="text-right">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold leading-tight">{it.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t("home.serviceCards.subtitle")}</p>
                  </div>
                </div>
              </div>
            </a>
          );
        })}

        {/* Progress dots */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-10">
          {safeItems.map((_, i) => {
            const state = getCardState(i);
            const isActive = state.phase === "active" && state.progress > 0.15 && state.progress < 0.85;
            return (
              <div
                key={i}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  isActive ? "bg-foreground scale-125" : "bg-foreground/30",
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}