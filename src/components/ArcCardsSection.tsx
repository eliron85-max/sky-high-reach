import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ArcCardItem = {
  title: string;
  image: string;
  href?: string;
};

type Props = {
  items: ArcCardItem[];
  title?: string;
  subtitle?: string;
  backgroundClassName?: string; // לדוגמה: "bg-[#bfe7d6]" או "bg-gradient-to-br ..."
  className?: string;
};

export default function ArcCardsSection({
  items,
  title = "השירותים שלנו",
  subtitle = "קלפים ענקיים שנכנסים אחד-אחד במסלול קשת ונוחתים לשורה אחת",
  backgroundClassName = "bg-[#bfe7d6]",
  className,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const safeItems = useMemo(() => items?.slice(0, 6) ?? [], [items]);

  // כמה קלפים “הופעלו” כבר (כל 250ms עוד אחד)
  const [activeCount, setActiveCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion => בלי אנימציה
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
      { threshold: 0.25, rootMargin: "0px 0px -18% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [safeItems.length]);

  useEffect(() => {
    if (!started) return;
    if (activeCount >= safeItems.length) return;

    // מפעיל קלף אחד כל 250ms
    const t = window.setInterval(() => {
      setActiveCount((c) => {
        if (c + 1 >= safeItems.length) {
          window.clearInterval(t);
          return safeItems.length;
        }
        return c + 1;
      });
    }, 250);

    return () => window.clearInterval(t);
  }, [started, activeCount, safeItems.length]);

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden py-16 sm:py-20 lg:py-28", backgroundClassName, className)}
      dir="rtl"
    >
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.60), transparent 55%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#121212]">{title}</h2>
          {subtitle ? <p className="mt-4 text-base sm:text-lg text-black/70">{subtitle}</p> : null}
        </div>

        {/* Horizontal row */}
        <div
          className={cn(
            "relative mt-12 sm:mt-14",
            "overflow-x-auto overflow-y-visible",
            "[-webkit-overflow-scrolling:touch]",
          )}
          style={{ perspective: "1400px" }}
        >
          <div className="flex gap-8 lg:gap-10 pr-2 sm:pr-6 lg:pr-10 pl-2 sm:pl-6 lg:pl-10 pb-10 snap-x snap-mandatory">
            {safeItems.map((it, i) => {
              const isActive = i < activeCount;
              return (
                <a
                  key={`${it.title}-${i}`}
                  href={it.href || "#"}
                  className={cn(
                    "arc-card snap-start group relative shrink-0",
                    "w-[420px] sm:w-[460px] lg:w-[560px]",
                    isActive ? "arc-in" : "",
                  )}
                  style={{
                    // קצת גיוון בין קלפים כדי שירגיש “חי”
                    ["--spin" as any]: `${i % 2 === 0 ? 1 : -1}`,
                    ["--dur" as any]: `1800ms`,
                  }}
                  aria-label={it.title}
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
                    {/* Image */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                      <img
                        src={it.image}
                        alt={it.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Bottom bar */}
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

      <style>{`
        .arc-card{
          opacity: 0;
          transform:
            translate3d(220%, 40px, 0)
            rotateY(60deg)
            rotateZ(calc(var(--spin, 1) * 18deg))
            scale(0.52);
          filter: blur(5px);
          will-change: transform, opacity, filter;
        }

        .arc-card.arc-in{
          opacity: 1;
          filter: blur(0px);
          animation: arc-parabola var(--dur, 1800ms) cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes arc-parabola {
          0% {
            transform:
              translate3d(220%, 40px, 0)
              rotateY(60deg)
              rotateZ(calc(var(--spin, 1) * 18deg))
              scale(0.52);
            opacity: 0;
            filter: blur(5px);
          }
          12% {
            opacity: 1;
            filter: blur(3px);
          }
          35% {
            /* שיא הקשת */
            transform:
              translate3d(85%, -240px, 0)
              rotateY(38deg)
              rotateZ(calc(var(--spin, 1) * 12deg))
              scale(0.78);
          }
          65% {
            transform:
              translate3d(10%, -90px, 0)
              rotateY(-10deg)
              rotateZ(calc(var(--spin, 1) * -3deg))
              scale(1.04);
            filter: blur(1px);
          }
          85% {
            /* bounce קטן */
            transform:
              translate3d(-6%, 16px, 0)
              rotateY(4deg)
              rotateZ(calc(var(--spin, 1) * 1deg))
              scale(0.985);
            filter: blur(0px);
          }
          100% {
            transform:
              translate3d(0, 0, 0)
              rotateY(0deg)
              rotateZ(0deg)
              scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce){
          .arc-card{
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
