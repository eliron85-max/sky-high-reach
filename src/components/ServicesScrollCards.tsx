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

    // חשוב: אנחנו מחפשים לפי class (לא data-attr), כדי שלא יהיה חוסר התאמה
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".svc-card"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("svc-in");
            io.unobserve(e.target);
          }
        }
      },
      // גורם לזה לקרות "כשהקלף כבר נכנס" ולא מוקדם מדי
      { threshold: 0.22, rootMargin: "0px 0px -18% 0px" }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items]);

  return (
    <section className={cn("py-10 sm:py-14 lg:py-20", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5d58a] text-center">
          {title}
        </h2>

        {subtitle ? (
          <p className="text-center text-white/55 mt-3 mb-10 sm:mb-12">
            {subtitle}
          </p>
        ) : (
          <div className="mb-10 sm:mb-12" />
        )}

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <a
              key={`${s.title}-${i}`}
              href={s.href || "#"}
              className={cn(
                // ⚠️ זה הקריטי: svc-card חייב להיות כאן
                "svc-card group relative overflow-hidden rounded-3xl bg-[#0b0f14] border border-white/10",
                "shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
              )}
              style={{ ["--d" as any]: `${Math.min(i * 0.09, 0.55)}s` }}
            >
              {/* image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* bottom bar */}
              <div className="px-6 py-5 bg-[#0d1218]">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-white/90 text-right">
                  {s.title}
                </h3>
                <p className="mt-1 text-[12px] sm:text-[13px] text-white/45 text-right">
                  עבודות גובה וסנפלינג
                </p>
              </div>

              {/* subtle gold line */}
              <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/35 to-transparent" />
            </a>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .svc-card{
          opacity: 0;
          transform: translate3d(64px, 10px, 0) rotate(0.6deg) scale(0.985);
          filter: blur(1px);
          transition:
            opacity 700ms ease,
            transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms ease;
          transition-delay: var(--d, 0s);
          will-change: transform, opacity, filter;
        }

        .svc-card.svc-in{
          opacity: 1;
          filter: blur(0px);
          transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          animation: svc-bounce 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--d, 0s);
        }

        @keyframes svc-bounce{
          0%   { transform: translate3d(64px, 10px, 0) rotate(0.6deg) scale(0.985); }
          70%  { transform: translate3d(-6px, -2px, 0) rotate(-0.15deg) scale(1.004); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        }

        @media (prefers-reduced-motion: reduce){
          .svc-card, .svc-card.svc-in{
            transition: none !important;
            anim
