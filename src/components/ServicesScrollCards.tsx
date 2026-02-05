// src/components/ServicesScrollCards.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

type ServiceItem = {
  title: string;
  image: string;
  href?: string;
  subtitle?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  items: ServiceItem[];
  className?: string;
};

export default function ServicesScrollCards({
  title = "השירותים שלנו",
  subtitle = "גלול למטה ותראה את הקלפים נכנסים בצורה חלקה",
  items,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-svc-card]"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("svc-in");
            io.unobserve(el); // פעם אחת וזהו (לא ייצא/ייכנס שוב)
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // סטאגר דיליי אוטומטי לכל קלף
  const delays = useMemo(() => items.map((_, i) => Math.min(0.08 * i, 0.5)), [items]);

  return (
    <section className={cn("py-16 md:py-24", className)} dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">{title}</h2>
          <p className="mt-4 text-white/70 text-base md:text-lg">{subtitle}</p>
        </div>

        <div
          ref={rootRef}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {items.map((s, i) => (
            <a
              key={s.title + i}
              href={s.href || "#"}
              data-svc-card
              className={cn(
                "svc-card group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f14]/70",
                "backdrop-blur-md shadow-[0_25px_80px_rgba(0,0,0,0.35)]",
                "focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/35"
              )}
              style={{ ["--svc-delay" as any]: `${delays[i]}s` }}
            >
              {/* תמונה */}
              <div className="relative h-[220px] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  loading="lazy"
                />
                {/* שכבת כהות עדינה + גולד */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.22),transparent_55%)]" />
              </div>

              {/* טקסט */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-white leading-tight">{s.title}</h3>
                  <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white">
                    →
                  </span>
                </div>

                {s.subtitle ? (
                  <p className="mt-3 text-white/70 leading-relaxed">{s.subtitle}</p>
                ) : (
                  <p className="mt-3 text-white/60 leading-relaxed">
                    לפרטים נוספים לחץ כאן
                  </p>
                )}
              </div>

              {/* קו גולד תחתון */}
              <div className="pointer-events-none absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/45 to-transparent opacity-70" />
            </a>
          ))}
        </div>
      </div>

      {/* CSS מקומי לאפקט */}
      <style>{`
        .svc-card{
          opacity: 0;
          transform: translate3d(56px, 10px, 0) rotate(0.8deg);
          filter: blur(1px);
          transition:
            opacity 700ms ease,
            transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms ease;
          transition-delay: var(--svc-delay, 0s);
          will-change: transform, opacity, filter;
        }

        /* כשהקלף נכנס */
        .svc-card.svc-in{
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(0deg);
          filter: blur(0px);
          animation: svc-bounce 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--svc-delay, 0s);
        }

        /* bounce עדין מאוד */
        @keyframes svc-bounce{
          0%   { transform: translate3d(56px, 10px, 0) rotate(0.8deg); }
          70%  { transform: translate3d(-6px, -2px, 0) rotate(-0.2deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }

        @media (prefers-reduced-motion: reduce){
          .svc-card, .svc-card.svc-in{
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
