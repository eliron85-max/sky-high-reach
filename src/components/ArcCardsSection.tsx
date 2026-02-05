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
  backgroundClassName = "bg-[#bfe7d6]",
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

        .arc-row {
          perspective: 1400px;
          transform-style: preserve-3d;
        }

        .arc-card {
          opacity: 0;
          transform-style: preserve-3d;
          will-change: transform, filter, opacity;

          --dur: 2600ms;          /* ✅ משך ארוך יותר */
          --delay: 0ms;
          --stagger: 320ms;       /* עיכוב בין קלפים */
          --dir: 1;               /* זוגי/אי-זוגי */
          --zBoost: 1;
          --shadowA: 0.22;
          --shadowB: 0.40;
          --entryX: 350%;         /* כניסה רחוקה יותר */
          --entryY: -200px;       /* כניסה מגובה */
          --peakY: -480px;        /* שיא הקשת גבוה יותר */
          --peakX: 180%;

          animation: arc-circular var(--dur) cubic-bezier(.18,.9,.18,1) both;
          animation-delay: var(--delay);
        }

        /* ✅ מהיר יותר במובייל */
        @media (max-width: 768px) {
          .arc-card {
            --dur: 1800ms;
            --stagger: 220ms;
            --entryX: 250%;
            --entryY: -120px;
            --peakY: -280px;
            --peakX: 140%;
          }
        }

        @media (max-width: 480px) {
          .arc-card {
            --dur: 1400ms;
            --stagger: 180ms;
            --entryX: 200%;
            --entryY: -80px;
            --peakY: -200px;
            --peakX: 120%;
          }
        }

        .arc-card:nth-child(even) {
          --dir: -1;
          --zBoost: 1.06;
          --shadowA: 0.26;
          --shadowB: 0.46;
          --entryY: -240px;
          --peakY: -520px;
        }

        @media (max-width: 768px) {
          .arc-card:nth-child(even) {
            --entryY: -140px;
            --peakY: -300px;
          }
        }

        @media (max-width: 480px) {
          .arc-card:nth-child(even) {
            --entryY: -100px;
            --peakY: -220px;
          }
        }

        /* ✅ "מסלול עיגולי/ספיראלי" + rotateY חזק + rotateZ גדול + bounce כפול + blur + צל */
        @keyframes arc-circular {
          0% {
            transform:
              translate3d(var(--entryX), var(--entryY), 0)
              rotateY(95deg)
              rotateZ(calc(45deg * var(--dir) * var(--zBoost)))
              scale(0.30);
            opacity: 0;
            filter:
              blur(12px)
              drop-shadow(0 18px 38px rgba(0,0,0,var(--shadowA)));
          }

          8% {
            opacity: 1;
            filter:
              blur(6px)
              drop-shadow(0 22px 44px rgba(0,0,0,var(--shadowB)));
          }

          20% {
            transform:
              translate3d(var(--peakX), var(--peakY), 0)
              rotateY(75deg)
              rotateZ(calc(38deg * var(--dir)))
              scale(0.50);
            filter:
              blur(4px)
              drop-shadow(0 26px 52px rgba(0,0,0,var(--shadowB)));
          }

          40% {
            transform:
              translate3d(90%, -380px, 0)
              rotateY(45deg)
              rotateZ(calc(20deg * var(--dir)))
              scale(0.72);
            filter:
              blur(2.5px)
              drop-shadow(0 28px 56px rgba(0,0,0,var(--shadowB)));
          }

          60% {
            transform:
              translate3d(25%, -200px, 0)
              rotateY(18deg)
              rotateZ(calc(6deg * var(--dir)))
              scale(0.92);
            filter:
              blur(1px)
              drop-shadow(0 24px 50px rgba(0,0,0,var(--shadowB)));
          }

          75% {
            transform:
              translate3d(5%, -60px, 0)
              rotateY(-8deg)
              rotateZ(calc(-3deg * var(--dir)))
              scale(1.04);
            filter:
              blur(0px)
              drop-shadow(0 22px 46px rgba(0,0,0,var(--shadowB)));
          }

          82% {
            /* ✅ bounce ראשון חזק */
            transform:
              translate3d(-6%, 42px, 0)
              rotateY(10deg)
              rotateZ(calc(4deg * var(--dir)))
              scale(0.88);
            filter:
              blur(0px)
              drop-shadow(0 12px 32px rgba(0,0,0,var(--shadowB)));
          }

          90% {
            /* ✅ bounce שני */
            transform:
              translate3d(4%, -18px, 0)
              rotateY(-4deg)
              rotateZ(calc(-2deg * var(--dir)))
              scale(1.04);
            filter:
              blur(0px)
              drop-shadow(0 18px 40px rgba(0,0,0,var(--shadowB)));
          }

          96% {
            /* ✅ bounce שלישי קטן */
            transform:
              translate3d(-1%, 8px, 0)
              rotateY(2deg)
              rotateZ(calc(1deg * var(--dir)))
              scale(0.98);
            filter:
              blur(0px)
              drop-shadow(0 14px 36px rgba(0,0,0,var(--shadowA)));
          }

          100% {
            transform:
              translate3d(0, 0, 0)
              rotateY(0deg)
              rotateZ(0deg)
              scale(1);
            opacity: 1;
            filter:
              blur(0px)
              drop-shadow(0 16px 36px rgba(0,0,0,var(--shadowA)));
          }
        }
      `}</style>

      {/* Glow עדין */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.60), transparent 55%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#121212]">{title}</h2>
          {subtitle ? <p className="mt-4 text-base sm:text-lg text-black/70">{subtitle}</p> : null}
        </div>

        {/* שורה אופקית כמו בוידאו */}
        <div className="arc-row relative mt-12 sm:mt-14 overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
          <div className="flex gap-8 lg:gap-10 pr-2 sm:pr-6 lg:pr-10 pl-2 sm:pl-6 lg:pl-10 pb-10 snap-x snap-mandatory">
            {safeItems.map((it, i) => {
              const isActive = i < activeCount;

              return (
                <a
                  key={`${it.title}-${i}`}
                  href={it.href || "#"}
                  aria-label={it.title}
                  className={cn(
                    "arc-card snap-start group relative shrink-0",
                    "w-[420px] sm:w-[460px] lg:w-[560px]",
                    !isActive ? "pointer-events-none" : "",
                  )}
                  style={
                    {
                      // רק כשהוא "נכנס" אנחנו נותנים לו delay / אנימציה
                      ["--delay" as any]: `${i * getStaggerDelay()}ms`,
                      animationPlayState: isActive ? "running" : "paused",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      "rounded-[44px] sm:rounded-[50px]",
                      "bg-black/90",
                      "shadow-[0_60px_140px_rgba(0,0,0,0.50)]",
                      "ring-1 ring-black/10",
                      "transition-transform duration-300 group-hover:-translate-y-1",
                    )}
                  >
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                      <img
                        src={it.image}
                        alt={it.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="relative px-7 sm:px-8 py-6 sm:py-7 bg-black/85">
                      <div className="flex items-center justify-between gap-5">
                        <div className="text-right">
                          <h3 className="text-[18px] sm:text-[20px] font-extrabold text-white/95 leading-tight">
                            {it.title}
                          </h3>
                          <p className="mt-1 text-[13px] sm:text-[14px] text-white/60">עבודות גובה וסנפלינג</p>
                        </div>

                        <span className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
                          <span className="text-white/90 text-lg">→</span>
                        </span>
                      </div>

                      <div className="pointer-events-none absolute inset-x-8 bottom-5 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
