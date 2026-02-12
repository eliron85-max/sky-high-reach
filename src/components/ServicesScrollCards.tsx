// src/components/ServicesScrollCards.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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

type CardPose = { x: number; y: number; r: number; z: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ===== הערכים המדויקים מה-DevTools אצלך (translate3d + rotate + z-index) =====
const POSES_END_RAW: CardPose[] = [
  { x: -899.646, y: 99.701, r: -15.974, z: 4 }, // card-1
  { x: 863.126, y: -9.518, r: 14.026, z: 3 }, // card-2
  { x: 1500, y: 800, r: 30, z: 2 }, // card-3
  { x: 1500, y: 800, r: 30, z: 1 }, // card-4
];

// הבסיס למסך שממנו נמדדו הערכים אצלך (מה-DevTools)
const BASE_VIEWPORT_W = 2279; // px
const BASE_VIEWPORT_H = 842.333; // px

export default function ServicesScrollCards({ title, subtitle, items, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  const deck = useMemo(() => items.slice(0, 4), [items]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // ===== MOBILE/SMALL: כמו שהיה =====
  useEffect(() => {
    if (isDesktop) return;

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
  }, [deck, isDesktop]);

  // ===== DESKTOP/LAPTOP: pinned scroll + scaling =====
  useEffect(() => {
    if (!isDesktop) return;

    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!pin || !stage) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];
    if (cards.length < 2) return;

    const getScrollLen = () => {
      const vh = window.innerHeight || 900;
      return Math.max(4.5 * vh, 3200);
    };

    let scrollLen = getScrollLen();

    const setHeights = () => {
      scrollLen = getScrollLen();
      pin.style.height = `${scrollLen}px`;
    };

    // סקייל לפי המסך שלך לעומת מסך הבסיס שממנו נמדדו הערכים
    const getScale = () => {
      const vw = window.innerWidth || 1200;
      const vh = window.innerHeight || 800;
      return { sx: vw / BASE_VIEWPORT_W, sy: vh / BASE_VIEWPORT_H };
    };

    const applyPose = (el: HTMLElement, pose: CardPose) => {
      el.style.zIndex = String(pose.z);
      el.style.transform = `translate(-50%, -50%) translate3d(${pose.x}px, ${pose.y}px, 0px) rotate(${pose.r}deg)`;
    };

    const initCards = () => {
      cards.forEach((el) => {
        el.style.position = "absolute";
        el.style.top = "55%";
        el.style.left = "50%";
        el.style.width = "38vw";
        el.style.minHeight = "45vh";
        el.style.borderRadius = "2vw";
        el.style.willChange = "transform";
      });
    };

    initCards();
    setHeights();

    const tick = () => {
      const rect = pin.getBoundingClientRect();
      const raw = -rect.top / (scrollLen - (window.innerHeight || 1));
      const p = clamp01(raw);

      const t = easeInOutCubic(p);
      const { sx, sy } = getScale();

      cards.forEach((el, i) => {
        const end = POSES_END_RAW[i] ?? POSES_END_RAW[POSES_END_RAW.length - 1];

        // התחלה: stack במרכז
        const start: CardPose = { x: 0, y: 0, r: 0, z: 10 - i };

        // יעד: אותם ערכים אבל מסוקיילים למסך שלך
        const target: CardPose = {
          x: end.x * sx,
          y: end.y * sy,
          r: end.r,
          z: end.z,
        };

        const x = lerp(start.x, target.x, t);
        const y = lerp(start.y, target.y, t);
        const r = lerp(start.r, target.r, t);

        applyPose(el, { x, y, r, z: target.z });
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", setHeights, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", setHeights);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isDesktop, deck]);

  return (
    <section className={cn("py-12 sm:py-16 lg:py-24", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>
        {subtitle && <p className="text-center text-white/55 mt-3 mb-12">{subtitle}</p>}
      </div>

      {/* ===== MOBILE GRID ===== */}
      {!isDesktop && (
        <div className="max-w-7xl mx-auto px-4">
          <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((s, i) => (
              <a
                key={i}
                href={s.href || "#"}
                className="svc-card group relative overflow-hidden rounded-3xl bg-[#0b0f14] border border-white/10"
                style={{ ["--d" as any]: `${i * 0.12}s` }}
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
      )}

      {/* ===== DESKTOP PINNED (Full-bleed) ===== */}
      {isDesktop && (
        <div ref={pinRef} className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" style={{ height: 0 }}>
          <div
            ref={stageRef}
            className="sticky top-[var(--header-height,0px)] h-[calc(100vh-var(--header-height,0px))] overflow-hidden"
          >
            <div className="relative w-full h-full">
              {deck.map((s, i) => (
                <a
                  key={i}
                  ref={(el) => (cardsRef.current[i] = el)}
                  href={s.href || "#"}
                  className="group relative overflow-hidden shadow-2xl bg-[#0b0f14] border border-white/10"
                  aria-label={s.title}
                >
                  {/* תמונה גדולה כמו בסנפלינג */}
                  <div className="relative w-full h-[70%] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* פס תחתון */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0d1218] px-[2.2vw] py-[1.6vw]">
                    <h3 className="text-right font-semibold text-white" style={{ fontSize: "1.9vw", lineHeight: 1.1 }}>
                      {s.title}
                    </h3>
                    <p className="text-right text-white/60 mt-[.4vw]" style={{ fontSize: "1.05vw" }}>
                      עבודות גובה וסנפלינג
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE ANIMATION CSS ===== */}
      <style>{`
        .svc-card{
          opacity:0;
          transform: translateX(120px) translateY(40px) rotate(10deg) scale(0.92);
          filter: blur(2px);
          transition: opacity .6s ease, filter .6s ease;
        }
        .svc-card.svc-in{
          opacity:1;
          filter:blur(0);
          animation: card-arc-in 1s cubic-bezier(.16,1,.3,1) both;
          animation-delay:var(--d);
        }
        @keyframes card-arc-in{
          0%{ transform: translateX(120px) translateY(40px) rotate(10deg) scale(.92); }
          60%{ transform: translateX(-12px) translateY(-6px) rotate(-1deg) scale(1.02); }
          100%{ transform: translateX(0) translateY(0) rotate(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce){
          .svc-card, .svc-card.svc-in{
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
