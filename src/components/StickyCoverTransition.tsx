// ═══════════════════════════════════════════════════════════════════════
// 🎬 אפקט: STICKY COVER TRANSITION (כיסוי מלמטה + גרירה)
// ═══════════════════════════════════════════════════════════════════════
//
// 📌 מה האפקט עושה:
//    השכבה הראשונה (first, למשל Hero) נשארת קבועה ברקע.
//    השכבה השנייה (second) עולה מלמטה ומכסה אותה בהדרגה.
//    אחרי שהכיסוי מלא, התוכן בפנים זז ימינה (drift) לאפקט נוסף.
//
// 📐 איך זה עובד:
//    שלב 1 - כיסוי (coverScreens):
//      - ה-Hero מתכווץ מעט (scale) ומתכהה (dim)
//      - השכבה השנייה עולה מלמטה (translateY: 100% → 0%)
//      - פינות עליונות מעוגלות
//
//    שלב 2 - גרירה (postScreens):
//      - אחרי שהכיסוי מלא, התוכן בפנים זז ימינה בהדרגה
//      - אפקט easeOutCubic לתנועה חלקה
//
// 🔧 פרמטרים:
//    - first: הקומפוננטה ברקע (למשל: HeroSection)
//    - second: הקומפוננטה שעולה ומכסה (למשל: תוכן הסיפור)
//    - coverScreens: כמה מסכי גלילה לכיסוי (ברירת מחדל: 2)
//    - postScreens: כמה מסכים לגרירה ימינה (ברירת מחדל: 1)
//    - driftMaxPx: מקסימום פיקסלים של גרירה ימינה (ברירת מחדל: 160)
//    - secondRadiusPx: רדיוס הפינות של השכבה המכסה (ברירת מחדל: 28)
//
// 💡 שימוש:
//    <StickyCoverTransition
//      coverScreens={2}
//      postScreens={1}
//      driftMaxPx={140}
//      first={<HeroSection />}
//      second={<YourContent />}
//    />
// ═══════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  first: ReactNode;
  second: ReactNode;
  coverScreens?: number;
  postScreens?: number;
  driftMaxPx?: number;
  secondRadiusPx?: number;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function StickyCoverTransition({
  first,
  second,
  coverScreens = 2,
  postScreens = 1,
  driftMaxPx = 160,
  secondRadiusPx = 28,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const dimRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastCRef = useRef<number>(-1);
  const lastPRef = useRef<number>(-1);
  const lastDriftRef = useRef<number>(-1);

  useEffect(() => {
    const apply = () => {
      rafRef.current = null;

      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const coverTotal = vh * coverScreens;
      const postTotal = vh * postScreens;

      const scrolled = Math.min(Math.max(-rect.top, 0), coverTotal + postTotal);

      const c = coverTotal === 0 ? 1 : clamp01(scrolled / coverTotal);
      const p = postTotal === 0 ? 0 : clamp01((scrolled - coverTotal) / postTotal);

      const w = window.innerWidth || 1200;
      const balanced = Math.min(driftMaxPx, Math.round(w * 0.08));
      const driftInner = easeOutCubic(p) * balanced;

      if (
        Math.abs(c - lastCRef.current) < 0.001 &&
        Math.abs(p - lastPRef.current) < 0.001 &&
        Math.abs(driftInner - lastDriftRef.current) < 0.25
      ) {
        return;
      }
      lastCRef.current = c;
      lastPRef.current = p;
      lastDriftRef.current = driftInner;

      // HERO
      const heroY = -20 * c;
      const heroScale = 1 - 0.06 * c;
      const heroDim = 0.18 * c;

      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(0, ${heroY}px, 0) scale(${heroScale})`;
      }
      if (dimRef.current) {
        dimRef.current.style.background = `rgba(0,0,0,${heroDim})`;
      }

      // COVER
      const secondY = (1 - c) * 100;
      if (coverRef.current) {
        coverRef.current.style.transform = `translate3d(0, ${secondY}%, 0)`;
      }

      // INNER DRIFT
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${driftInner}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [coverScreens, postScreens, driftMaxPx]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${(coverScreens + postScreens + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* HERO */}
        <div ref={heroRef} className="absolute inset-0 will-change-transform transform-gpu">
          {first}
          <div ref={dimRef} className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0)" }} />
        </div>

        {/* COVER */}
        <div
          ref={coverRef}
          className="absolute inset-0 will-change-transform transform-gpu"
          style={{ transform: "translate3d(0, 100%, 0)" }}
        >
          <div
            className="h-full w-full bg-background overflow-hidden contain-paint"
            style={{
              borderTopLeftRadius: secondRadiusPx,
              borderTopRightRadius: secondRadiusPx,
            }}
          >
            <div ref={innerRef} className="h-full w-full will-change-transform transform-gpu">
              {second}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
