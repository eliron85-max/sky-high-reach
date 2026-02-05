import React, { useEffect, useMemo, useRef } from "react";
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
  backgroundClassName?: string; // למשל: "bg-[#bfe7d6]" או גרדיאנט
  className?: string;
};

export default function ArcCardsSection({
  items,
  title = "השירותים שלנו",
  subtitle = "קלפים ענקיים שנכנסים במסלול קשת מימין לשמאל",
  backgroundClassName = "bg-[#bfe7d6]",
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const safeItems = useMemo(() => items?.slice(0, 6) ?? [], [items]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".arc-card"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("arc-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [safeItems]);

  return (
    <section
      className={cn("relative overflow-hidden py-16 sm:py-20 lg:py-28", backgroundClassName, className)}
      dir="rtl"
    >
      {/* Soft grain / vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#121212]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 text-base sm:text-lg text-black/70">{subtitle}</p>
          ) : null}
        </div>

        {/* Stage */}
        <div
          ref={rootRef}
          className={cn(
            "relative mt-12 sm:mt-14",
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          )}
          style={{ perspective: "1200px" }}
        >
          {safeItems.map((it, i) => (
            <a
              key={`${it.title}-${i}`}
              href={it.href || "#"}
              className="arc-card group relative block"
              style={{
                ["--delay" as any]: `${Math.min(i * 0.12, 0.75)}s`,
                ["--spin" as any]: `${i % 2 === 0 ? 1 : -1}`,
              }}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-[34px] sm:rounded-[40px]",
                  "shadow-[0_40px_110px_rgba(0,0,0,0.35)]",
                  "ring-1 ring-black/10"
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
                  {/* soft overlay */}
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Footer */}
                <div className="relative bg-black/90 px-6 sm:px-7 py-5 sm:py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-right">
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-white/95 leading-tight">
                        {it.title}
                      </h3>
                      <p className="mt-1 text-[12px] sm:text-[13px] text-white/60">
                        לפרטים נוספים לחץ כאן
                      </p>
                    </div>

                    <span className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
                      <span className="text-white/90 text-lg">→</span>
                    </span>
                  </div>

                  {/* gold hairline */}
                  <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/45 to-transparent" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* ===== Initial state: outside right, arc up, tilted 3D ===== */
        .arc-card{
          opacity: 0;
          transform:
            translate3d(140%, -120px, 0)
            rotateY(55deg)
            rotateZ(calc(16deg * var(--spin)))
            scale(0.62);
          filter: blur(2px);
          transform-origin: 80% 50%;
          will-change: transform, opacity, filter;
        }

        /* ===== Play when in viewport ===== */
        .arc-card.arc-in{
          opacity: 1;
          filter: blur(0);
          animation: arc-fly-in 1100ms cubic-bezier(.16,1,.3,1) both;
          animation-delay: var(--delay, 0s);
        }

        /* ===== Arc path keyframes ===== */
        @keyframes arc-fly-in{
          0%{
            transform:
              translate3d(140%, -120px, 0)
              rotateY(55deg)
              rotateZ(calc(16deg * var(--spin)))
              scale(0.62);
            opacity: 0;
          }
          28%{
            transform:
              translate3d(65%, -190px, 0)
              rotateY(38deg)
              rotateZ(calc(11deg * var(--spin)))
              scale(0.82);
            opacity: 1;
          }
          68%{
            transform:
              translate3d(-14%, -55px, 0)
              rotateY(-12deg)
              rotateZ(calc(-4deg * var(--spin)))
              scale(1.06);
          }
          84%{
            transform:
              translate3d(4%, 12px, 0)
              rotateY(4deg)
              rotateZ(calc(1.2deg * var(--spin)))
              scale(0.985);
          }
          100%{
            transform:
              translate3d(0, 0, 0)
              rotateY(0deg)
              rotateZ(0deg)
              scale(1);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce){
          .arc-card, .arc-card.arc-in{
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
