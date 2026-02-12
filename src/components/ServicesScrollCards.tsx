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

// easeInOutCubic
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ServicesScrollCards({ title, subtitle, items, className }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // ===== STACK "DEPTH" PRESETS (תכוונן פה אם צריך) =====
  const presets = useMemo(
    () => [
      // depth 0 = קדמי
      { x: 0, y: 0, r: -8, s: 1.0 },
      // depth 1
      { x: 90, y: 30, r: 10, s: 0.98 },
      // depth 2
      { x: 175, y: 60, r: 22, s: 0.96 },
      // depth 3 = הכי אחורי (נשאר)
      { x: 260, y: 90, r: 34, s: 0.94 },
    ],
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!section || !stack) return;

    const cards = Array.from(stack.querySelectorAll<HTMLElement>(".svc-card"));
    const n = cards.length;
    if (!n) return;

    const apply = () => {
      const vh = window.innerHeight || 1;
      const rect = section.getBoundingClientRect();

      // progress של כל הסקשן בזמן שהוא "עובר" את ה־viewport
      const start = 0; // כשקצה עליון מגיע לראש
      const end = rect.height - vh; // סוף גלילה בתוך הסקשן
      const scrolled = -rect.top; // כמה נכנסנו לתוך הסקשן

      const p = end <= 1 ? 0 : clamp01((scrolled - start) / end);

      // כמה "החלפות" יש (כרטיסים)
      const total = n;
      const scaled = p * total;

      // אינדקס החלפה + פרוגרס בתוך ההחלפה
      const k = Math.floor(scaled); // 0..n-1
      const tRaw = scaled - k; // 0..1
      const t = ease(tRaw);

      // כל כרטיס מקבל position יחסי בסטאק לפי k + t (עם wrap)
      for (let i = 0; i < n; i++) {
        const pos = (i - k + n) % n; // 0 קדמי, 1 מאחוריו...
        let eff = pos - t; // גורם לקדמי "לרדת" אחורה
        if (eff < 0) eff += n;

        // ממפים eff ל-depth (0..3) עם אינטרפולציה
        const d0 = Math.min(3, Math.floor(eff));
        const frac = clamp01(eff - Math.floor(eff));

        const a = presets[d0];
        const b = presets[Math.min(3, d0 + 1)];

        const x = lerp(a.x, b.x, frac);
        const y = lerp(a.y, b.y, frac);
        const r = lerp(a.r, b.r, frac);
        const s = lerp(a.s, b.s, frac);

        // zIndex: מי שיותר קדמי -> יותר גבוה
        // eff קטן = קדמי, eff גדול = אחורי
        const z = 1000 - Math.round(eff * 10);

        cards[i].style.zIndex = String(z);
        cards[i].style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        apply();
      });
    };

    const onResize = () => apply();

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [items, presets]);

  // נותן מספיק "מרחק גלילה" כדי שהסטאק יעבוד (כמו בסנפלינג)
  const scrollSpace = Math.max(2, items.length + 1);

  return (
    <section
      ref={sectionRef}
      className={cn("relative", className)}
      style={{ height: `calc(${scrollSpace} * 100vh)` }}
      dir="rtl"
    >
      {/* HEADER רגיל בתחילת הסקשן */}
      <div className="absolute top-0 left-0 right-0 pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>
          {subtitle && <p className="text-center text-white/55 mt-3">{subtitle}</p>}
        </div>
      </div>

      {/* STACK STICKY (נשאר באמצע בזמן הגלילה) */}
      <div className="sticky top-[120px] sm:top-[140px] lg:top-[160px]">
        <div className="max-w-7xl mx-auto px-4">
          <div
            ref={stackRef}
            className="relative mx-auto"
            style={{
              height: "72vh",
              maxHeight: "720px",
            }}
          >
            {items.map((s, i) => (
              <a
                key={i}
                href={s.href || "#"}
                className="svc-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block will-change-transform"
                style={{
                  width: "min(820px, 92vw)",
                  transformOrigin: "20% 60%", // הציר כמו בתמונות (מרכז-שמאל)
                }}
              >
                <div className="overflow-hidden rounded-[42px] bg-[#0b0f14] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>

                  <div className="px-7 py-6 bg-[#0d1218]">
                    <h3 className="text-[18px] font-semibold text-white text-right">{s.title}</h3>
                    <p className="text-[13px] text-white/50 mt-1 text-right">עבודות גובה וסנפלינג</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
@media (prefers-reduced-motion: reduce){
  .svc-card{ transform: none !important; }
}
      `}</style>
    </section>
  );
}
