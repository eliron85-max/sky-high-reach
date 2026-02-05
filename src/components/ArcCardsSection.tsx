// src/components/ArcCardsSection.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  subtitle = "קלפים נכנסים אחד-אחד במסלול מעגלי ונוחתים למקום",
  backgroundClassName = "arc-demo-bg",
  className,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const safeItems = useMemo(() => (items ?? []).filter(Boolean), [items]);

  // כמה קלפים “מופעלים” כבר (נכנסים אחד-אחד)
  const [activeCount, setActiveCount] = useState(0);
  const [started, setStarted] = useState(false);

  // ✅ עיכוב דינמי לפי גודל מסך
  const getStaggerDelay = () => {
    if (typeof window === "undefined") return 320;
    if (window.innerWidth <= 480) return 180;
    if (window.innerWidth <= 768) return 220;
    return 320;
  };

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setActiveCount(safeItems.length);
      setStarted(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -25% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [safeItems.length]);

  useEffect(() => {
    if (!started) return;
    if (activeCount >= safeItems.length) return;

    // ✅ delay בין קלפים: 320ms
    const staggerDelay = getStaggerDelay();
    const t = window.setInterval(() => {
      setActiveCount((c) => {
        const next = c + 1;
        if (next >= safeItems.length) {
          window.clearInterval(t);
          return safeItems.length;
        }
        return next;
      });
    }, staggerDelay);

    return () => window.clearInterval(t);
  }, [started, activeCount, safeItems.length]);

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden py-16 sm:py-20 lg:py-28", backgroundClassName, className)}
      dir="rtl"
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .arc-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        /* Reference-like pastel background (HSL only) */
        .arc-demo-bg {
          background: hsl(160 44% 83%);
        }

        .arc-stage {
          position: relative;
          height: clamp(420px, 60vh, 720px);
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .arc-card {
          position: absolute;
          top: var(--top);
          left: var(--left);
          width: clamp(320px, 46vw, 720px);
          max-width: 92vw;
          opacity: 0;
          transform-style: preserve-3d;
          will-change: transform, opacity;

          --dur: 900ms;
          --delay: 0ms;
          --r: 0deg;
          --sx: 0px;
          --sy: 0px;
          --sr: 0deg;

          transform:
            translate(-50%, -50%)
            translate3d(var(--sx), var(--sy), 0)
            rotate(var(--sr))
            scale(1.04);

          animation: arc-ref-in var(--dur) cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--delay);
        }

        @keyframes arc-ref-in {
          0% {
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              translate3d(0px, 0px, 0)
              rotate(var(--r))
              scale(1);
          }
        }

        /* Slots that match the screenshots */
        .arc-card[data-slot="center"] {
          --top: 52%;
          --left: 50%;
          --r: 0deg;
          --sx: 40vw;
          --sy: -22vh;
          --sr: 18deg;
        }
        .arc-card[data-slot="right"] {
          --top: 44%;
          --left: 78%;
          --r: 12deg;
          --sx: 55vw;
          --sy: 10vh;
          --sr: 32deg;
        }
        .arc-card[data-slot="left"] {
          --top: 62%;
          --left: 16%;
          --r: -12deg;
          --sx: -55vw;
          --sy: 18vh;
          --sr: -32deg;
        }

        @media (max-width: 768px) {
          .arc-stage {
            height: clamp(360px, 52vh, 560px);
          }
          .arc-card {
            width: min(86vw, 520px);
          }
          .arc-card[data-slot="right"] {
            --left: 85%;
          }
          .arc-card[data-slot="left"] {
            --left: 10%;
          }
        }
      `}</style>

      {/* Glow עדין */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, hsl(0 0% 100% / 0.60), transparent 55%), radial-gradient(circle at 80% 25%, hsl(0 0% 100% / 0.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">{title}</h2>
          {subtitle ? <p className="mt-4 text-base sm:text-lg text-foreground/70">{subtitle}</p> : null}
        </div>

        {/* Reference layout: 3 tilted oversized cards */}
        <div className="arc-stage mt-12 sm:mt-14">
          {safeItems.slice(0, 3).map((it, i) => {
            const isActive = i < activeCount;
            const slot = i === 0 ? "center" : i === 1 ? "right" : "left";

            return (
              <a
                key={`${it.title}-${i}`}
                href={it.href || "#"}
                aria-label={it.title}
                data-slot={slot}
                className={cn("arc-card group", !isActive ? "pointer-events-none" : "")}
                style={
                  {
                    ["--delay" as any]: `${i * getStaggerDelay()}ms`,
                    animationPlayState: isActive ? "running" : "paused",
                  } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    "relative overflow-hidden",
                    "rounded-[44px] sm:rounded-[50px]",
                    "bg-card text-card-foreground",
                    "shadow-[0_60px_140px_hsl(220_13%_9%_/0.30)]",
                    "ring-1 ring-border",
                  )}
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                    <img
                      src={it.image}
                      alt={it.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="relative px-7 sm:px-8 py-6 sm:py-7">
                    <div className="text-right">
                      <h3 className="text-[18px] sm:text-[20px] font-extrabold leading-tight">{it.title}</h3>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-muted-foreground">עבודות גובה וסנפלינג</p>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
