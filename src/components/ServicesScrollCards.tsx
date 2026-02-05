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
            e.target.classList.add("svc-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items]);

  return (
    <section className={cn("py-12 sm:py-16 lg:py-24", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>

        {subtitle && <p className="text-center text-white/55 mt-3 mb-12">{subtitle}</p>}

        {/* GRID */}
        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((s, i) => (
            <a
              key={i}
              href={s.href || "#"}
              className="svc-card group relative overflow-hidden rounded-3xl bg-[#0b0f14] border border-white/10"
              style={{ ["--d" as any]: `${i * 0.12}s` }}
            >
              {/* IMAGE */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* TEXT */}
              <div className="px-6 py-5 bg-[#0d1218]">
                <h3 className="text-[16px] font-semibold text-white text-right">{s.title}</h3>
                <p className="text-[13px] text-white/50 mt-1 text-right">עבודות גובה וסנפלינג</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ================= ANIMATION ================= */}
      <style>{`

/* מצב התחלתי – מחוץ למסך מימין בקשת */
.svc-card{
  opacity:0;
  transform:
    translateX(120px)
    translateY(40px)
    rotate(10deg)
    scale(0.92);
  filter: blur(2px);
  transition:
    opacity .6s ease,
    filter .6s ease;
}

/* נכנס */
.svc-card.svc-in{
  opacity:1;
  filter:blur(0);
  animation:
    card-arc-in
    1s
    cubic-bezier(.16,1,.3,1)
    both;
  animation-delay:var(--d);
}

/* מסלול קשת */
@keyframes card-arc-in{
  0%{
    transform:
      translateX(120px)
      translateY(40px)
      rotate(10deg)
      scale(.92);
  }
  60%{
    transform:
      translateX(-12px)
      translateY(-6px)
      rotate(-1deg)
      scale(1.02);
  }
  100%{
    transform:
      translateX(0)
      translateY(0)
      rotate(0)
      scale(1);
  }
}

/* נגישות */
@media (prefers-reduced-motion: reduce){
  .svc-card,
  .svc-card.svc-in{
    animation:none!important;
    transition:none!important;
    transform:none!important;
    opacity:1!important;
    filter:none!important;
  }
}

      `}</style>
    </section>
  );
}
