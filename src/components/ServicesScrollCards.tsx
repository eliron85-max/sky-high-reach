// src/components/ServicesScrollCards.tsx
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Item = {
  title: string;
  image: string;
  href?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  items: Item[];
  className?: string;
};

export default function ServicesScrollCards({ title, subtitle, items, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".svc-card"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("svc-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -18% 0px" },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items]);

  return (
    <section className={cn("py-10 sm:py-14 lg:py-20", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>

        {subtitle ? (
          <p className="text-center text-white/55 mt-3 mb-10 sm:mb-12">{subtitle}</p>
        ) : (
          <div className="mb-10 sm:mb-12" />
        )}

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <a
              key={`${s.title}-${i}`}
              href={s.href || "#"}
              className={cn(
                "svc-card group relative overflow-hidden rounded-3xl bg-[#0b0f14] border border-white/10",
                "shadow-[0_25px_80px_rgba(0,0,0,0.35)]",
              )}
              // סטאגר קצת יותר מורגש
              style={{ ["--d" as any]: `${Math.min(i * 0.12, 0.8)}s` }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              <div className="px-6 py-5 bg-[#0d1218]">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-white/90 text-right">{s.title}</h3>
                <p className="mt-1 text-[12px] sm:text-[13px] text-white/45 text-right">עבודות גובה וסנפלינג</p>
              </div>

              <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/35 to-transparent" />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* ===== Arc Motion (ימין -> שמאל בצורה "קמורה") ===== */

        .svc-card{
          opacity: 0;
          filter: blur(0.6px);

          /* התחלה בקשת: ימינה + גובה משתנה + סיבוב עדין */
          transform:
            perspective(900px)
            translate3d(90px, var(--arc, 18px), 0)
            rotate(6deg)
            scale(0.985);

          transition: opacity 550ms ease, filter 550ms ease;
          will-change: transform, opacity, filter;
        }

        .svc-card.svc-in{
          opacity: 1;
          filter: blur(0px);
          animation: svc-arc 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--d, 0s);
        }

        @keyframes svc-arc{
          0%{
            transform:
              perspective(900px)
              translate3d(90px, var(--arc, 18px), 0)
              rotate(6deg)
              scale(0.985);
          }

          /* עובר דרך "ראש הקשת" — נותן תחושה מעגלית */
          60%{
            transform:
              perspective(900px)
              translate3d(18px, calc(var(--arc, 18px) * -0.7), 0)
              rotate(-2deg)
              scale(1.005);
          }

          100%{
            transform:
              perspective(900px)
              translate3d(0, 0, 0)
              rotate(0deg)
              scale(1);
          }
        }

        /* לכל קלף גובה קשת שונה -> זה מה שיוצר "מסלול" ולא תנועה זהה */
        .svc-card:nth-child(1){ --arc: 26px; }
        .svc-card:nth-child(2){ --arc: 18px; }
        .svc-card:nth-child(3){ --arc: 30px; }
        .svc-card:nth-child(4){ --arc: 14px; }
        .svc-card:nth-child(5){ --arc: 22px; }
        .svc-card:nth-child(6){ --arc: 16px; }
        .svc-card:nth-child(7){ --arc: 28px; }
        .svc-card:nth-child(8){ --arc: 12px; }
        .svc-card:nth-child(9){ --arc: 20px; }

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
