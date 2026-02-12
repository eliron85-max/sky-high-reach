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

// easing דומה לתחושה של ScrollTrigger scrub
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ====== הערכים המדויקים שמדדת מהאתר השני ======
const POSES_END: CardPose[] = [
  { x: -260.488, y: 170.088, r: -4.74076, z: 4 }, // card-1
  { x: 1342.35, y: 537.945, r: 25.2593, z: 3 }, // card-2
  { x: -609.386, y: -138.402, r: -10.2682, z: 2 }, // card-3
  { x: 1128.92, y: 248.403, r: 19.7318, z: 1 }, // card-4
];

export default function ServicesScrollCards({ title, subtitle, items, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  // מובייל: להשאיר כמו שהיה
  const [isDesktop, setIsDesktop] = useState(false);

  // נשתמש רק ב-4 הראשונים (כמו הדוגמה)
  const deck = useMemo(() => items.slice(0, 4), [items]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // ====== MOBILE/SMALL: אותה אנימציה חד פעמית כמו שהיה ======
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

  // ====== DESKTOP/LAPTOP: pinned scroll כמו האתר השני ======
  useEffect(() => {
    if (!isDesktop) return;

    const pin = pinRef.current;
    if (!pin) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];
    if (!cards.length) return;

    // "pin-spacer" גובה גלילה (ביחס למסך, דומה ל-16825px אצלם רק דינמי)
    const getScrollLen = () => {
      const vh = window.innerHeight || 900;
      // 4 כרטיסים -> מסלול ארוך, דומה לאפקט שלהם
      return Math.max(4.5 * vh, 3200);
    };

    let scrollLen = getScrollLen();

    const setHeights = () => {
      scrollLen = getScrollLen();
      pin.style.height = `${scrollLen}px`;
    };

    // Pose התחלה: stack נקי במרכז (מבוסס רק על זה ששם תמיד center + translate(-50%,-50%))
    const POSES_START: CardPose[] = POSES_END.map((p, idx) => ({
      x: 0,
      y: 0,
      r: 0,
      z: 10 - idx, // שמירה על סדר שכבות בזמן התחלה
    }));

    const applyPose = (el: HTMLElement, pose: CardPose) => {
      el.style.zIndex = String(pose.z);
      el.style.transform = `translate(-50%, -50%) translate3d(${pose.x}px, ${pose.y}px, 0px) rotate(${pose.r}deg)`;
    };

    // init styles
    cards.forEach((el, i) => {
      el.style.position = "absolute";
      el.style.top = "55%";
      el.style.left = "50%";
      el.style.width = "38vw";
      el.style.minHeight = "45vh";
      el.style.borderRadius = "2vw";
      el.style.willChange = "transform";
      applyPose(el, POSES_START[i] ?? POSES_START[POSES_START.length - 1]);
    });

    const tick = () => {
      const rect = pin.getBoundingClientRect();
      // progress: כשה-pin מתחיל להיכנס עד שהוא נגמר
      const raw = -rect.top / (scrollLen - (window.innerHeight || 1));
      const p = clamp01(raw);

      // חלוקה ל-2 שלבים כדי לקבל תחושה "נפתחת" ואז מתייצבת
      // 0..0.7 -> כניסה עיקרית, 0.7..1 -> התייצבות קטנה
      const p1 = clamp01(p / 0.7);
      const p2 = clamp01((p - 0.7) / 0.3);

      const tMain = easeInOutCubic(p1);
      const tSettle = easeOutCubic(p2);

      cards.forEach((el, i) => {
        const a = POSES_START[i] ?? POSES_START[POSES_START.length - 1];
        const b = POSES_END[i] ?? POSES_END[POSES_END.length - 1];

        // קודם מתקרבים לערכי היעד
        let x = lerp(a.x, b.x, tMain);
        let y = lerp(a.y, b.y, tMain);
        let r = lerp(a.r, b.r, tMain);

        // ואז "התייצבות" עדינה (בלי להמציא ערכים חדשים: רק תיקון קטן לכיוון היעד)
        x = lerp(x, b.x, tSettle);
        y = lerp(y, b.y, tSettle);
        r = lerp(r, b.r, tSettle);

        applyPose(el, { x, y, r, z: b.z });
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    setHeights();
    window.addEventListener("resize", setHeights, { passive: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", setHeights);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isDesktop, deck]);

  // ====== UI ======
  return (
    <section className={cn("py-12 sm:py-16 lg:py-24", className)} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5d58a] text-center">{title}</h2>
        {subtitle && <p className="text-center text-white/55 mt-3 mb-12">{subtitle}</p>}

        {/* ===== MOBILE / SMALL GRID ===== */}
        {!isDesktop && (
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
        )}

        {/* ===== DESKTOP / LAPTOP PINNED STACK ===== */}
        {isDesktop && (
          <div
            ref={pinRef}
            className="relative"
            // זה ה"pin-spacer" אצלנו (גובה גלילה)
            style={{ height: 0 }}
          >
            {/* ה-stage המקובע */}
            <div
              className="sticky top-[var(--header-height,0px)] h-[calc(100vh-var(--header-height,0px))] overflow-hidden"
              style={{ background: "transparent" }}
            >
              <div className="relative w-full h-full">
                {deck.map((s, i) => (
                  <a
                    key={i}
                    ref={(el) => (cardsRef.current[i] = el)}
                    href={s.href || "#"}
                    className="group overflow-visible shadow-2xl border border-white/10 bg-white"
                    aria-label={s.title}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{ paddingTop: "3vw", paddingBottom: "1.5vw", marginTop: "-7vw" }}
                    >
                      <img
                        src={s.image}
                        alt={s.title}
                        className="object-contain"
                        style={{ width: "20vw", height: "auto" }}
                        draggable={false}
                      />
                    </div>

                    <div style={{ padding: "0px 3vw 3.5vw" }}>
                      <h3
                        className="text-right font-bold"
                        style={{
                          color: "rgb(225, 116, 68)",
                          fontSize: "3.2vw",
                          marginBottom: "1.2vw",
                          lineHeight: 1.1,
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-right" style={{ color: "rgb(36, 58, 56)", fontSize: "1.4vw" }}>
                        עבודות גובה וסנפלינג
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MOBILE ANIMATION (כמו שהיה) ===== */}
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
