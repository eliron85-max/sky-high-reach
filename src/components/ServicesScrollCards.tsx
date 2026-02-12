import React, { useEffect, useMemo, useRef } from "react";
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

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// easeOutCubic
function ease(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ServicesScrollCards({ title, subtitle, items, className }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const delays = useMemo(() => items.map((_, i) => i * 0.08), [items]);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = cardsWrapRef.current;
    if (!section || !wrap) return;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>(".svc-card"));
    if (!cards.length) return;

    const apply = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // 0 כשהסקשן עוד לא התחיל, 1 כשהוא "עבר" מספיק
      const raw = (vh - rect.top) / (rect.height + vh);
      const progress = clamp01(raw);

      cards.forEach((card, i) => {
        // היסט בין כרטיסים (כמו delay), אבל מבוסס scroll
        const p = clamp01((progress - delays[i]) / (1 - delays[i]));
        const t = ease(p);

        // מסלול קשת כמו שהיה לך
        const x = lerp(120, 0, t);
        const y = lerp(40, 0, t);
        const rot = lerp(10, 0, t);
        const scale = lerp(0.92, 1, t);

        // "באמפ" קטן באמצע (כמו 60% אצלך)
        const bump = Math.sin(t * Math.PI) * 0.06; // 0..0.06..0
        const x2 = x + lerp(0, -12, bump);
        const y2 = y + lerp(0, -6, bump);
        const scale2 = scale + bump * 0.8;

        const opacity = lerp(0, 1, t);
        const blur = lerp(2, 0, t);

        card.style.opacity = String(opacity);
        card.style.filter = `blur(${blur}px)`;
        card.style.transform = `translateX(${x2}px) translateY(${y2}px) rotate(${rot}deg) scale(${scale2})`;
      });
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        apply();
      });
    };

    const onResize = () => apply();

    // init
    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [items, delays]);

  return (
    <section ref={sectionRef} className={cn("py-12 sm:py-16 lg:py-24", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>

        {subtitle && <p className="text-center text-white/55 mt-3 mb-12">{subtitle}</p>}

        <div ref={cardsWrapRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((s, i) => (
            <a
              key={i}
              href={s.href || "#"}
              className="svc-card group relative overflow-hidden rounded-3xl bg-[#0b0f14] border border-white/10 will-change-transform"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="px-6 py-5 bg-[#0d1218]">
                <h3 className="text-[16px] font-semibold text-white text-right">{s.title}</h3>
                <p className="text-[13px] text-white/50 mt-1 text-right">עבודות גובה וסנפלינג</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
.svc-card{
  opacity:0;
  transform: translateX(120px) translateY(40px) rotate(10deg) scale(0.92);
  filter: blur(2px);
}

@media (prefers-reduced-motion: reduce){
  .svc-card{
    transform:none!important;
    opacity:1!important;
    filter:none!important;
  }
}
      `}</style>
    </section>
  );
}
