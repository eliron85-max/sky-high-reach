// src/components/ArcCardsSection.tsx
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

type Props = {
  className?: string;
  cards?: Card[];
  /**
   * אם אתה רוצה להפעיל את האנימציה מחדש כשמשנים key
   * לדוגמה: animationKey={locale} או animationKey={route}
   */
  animationKey?: string | number;
};

export default function ArcCardsSection({ className, cards, animationKey }: Props) {
  const data: Card[] = useMemo(
    () =>
      cards ?? [
        { title: "שיקום מעטפת", description: "תיקוני בטון, טיח, ואיטומים בגובה." },
        { title: "איטום מקצועי", description: "פתרונות איטום עם אחריות ובדיקות." },
        { title: "הרחקת יונים", description: "רשתות/דוקרנים/פתרון נקודתי לפי צורך." },
        { title: "עבודות מיוחדות", description: "פתרונות מורכבים בגישה חבלית." },
      ],
    [cards],
  );

  // טריגר להפעלה (כדי ש-delay יעבוד יפה ומדויק)
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // איפוס והפעלה מחדש (גם אם animationKey משתנה)
    setPlay(false);
    const t = window.setTimeout(() => setPlay(true), 30);
    return () => window.clearTimeout(t);
  }, [animationKey]);

  return (
    <section className={cn("relative w-full", className)}>
      {/* ✅ CSS מקומי לקומפוננטה */}
      <style>{`
        /* =========================
           ARC CARDS (CIRCULAR / SPIRAL)
           ========================= */

        @media (prefers-reduced-motion: reduce) {
          .arc-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        .arc-wrap {
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .arc-card {
          will-change: transform, filter, opacity;
          transform-style: preserve-3d;
          opacity: 0;

          /* ברירת מחדל */
          --arcDur: 2200ms;   /* ✅ 2200ms */
          --arcDelay: 0ms;
          --dir: 1;           /* ✅ יהפוך לזוגי/אי-זוגי */
          --zBoost: 1;        /* בוסט קטן לשינוי עדין */
          --shadowA: 0.22;    /* צל דינמי */
          --shadowB: 0.38;

          animation: arc-circular var(--arcDur) cubic-bezier(.18,.9,.18,1) both;
          animation-delay: var(--arcDelay);
        }

        /* ✅ זוגי/אי-זוגי — סיבוב בכיוונים הפוכים + וריאציה קטנה */
        .arc-card:nth-child(even) {
          --dir: -1;
          --zBoost: 1.06;
          --shadowA: 0.26;
          --shadowB: 0.44;
        }

        /* ✅ Keyframes: מסלול "עיגולי" דרמטי + bounce כפול + blur + צל */
        @keyframes arc-circular {
          0% {
            transform:
              translate3d(280%, -120px, 0)
              rotateY(85deg)
              rotateZ(calc(35deg * var(--dir) * var(--zBoost)))
              scale(0.4);
            opacity: 0;
            filter:
              blur(8px)
              drop-shadow(0 18px 38px rgba(0,0,0,var(--shadowA)));
          }

          10% {
            opacity: 1;
            filter:
              blur(4px)
              drop-shadow(0 22px 44px rgba(0,0,0,var(--shadowB)));
          }

          25% {
            /* עליה לשיא הקשת (גבוה יותר) */
            transform:
              translate3d(160%, -380px, 0)
              rotateY(65deg)
              rotateZ(calc(25deg * var(--dir)))
              scale(0.6);
            filter:
              blur(3px)
              drop-shadow(0 26px 52px rgba(0,0,0,var(--shadowB)));
          }

          50% {
            /* אמצע המסלול — סיבוב חזק */
            transform:
              translate3d(60%, -320px, 0)
              rotateY(25deg)
              rotateZ(calc(8deg * var(--dir)))
              scale(0.85);
            filter:
              blur(2px)
              drop-shadow(0 28px 56px rgba(0,0,0,var(--shadowB)));
          }

          70% {
            transform:
              translate3d(5%, -140px, 0)
              rotateY(-12deg)
              rotateZ(calc(-5deg * var(--dir)))
              scale(1.06);
            filter:
              blur(0px)
              drop-shadow(0 24px 50px rgba(0,0,0,var(--shadowB)));
          }

          82% {
            /* ✅ bounce ראשון (חזק ומורגש) */
            transform:
              translate3d(-8%, 28px, 0)
              rotateY(6deg)
              rotateZ(calc(2deg * var(--dir)))
              scale(0.94);
            filter:
              blur(0px)
              drop-shadow(0 18px 40px rgba(0,0,0,var(--shadowB)));
          }

          92% {
            /* ✅ bounce שני */
            transform:
              translate3d(3%, -8px, 0)
              rotateY(-2deg)
              rotateZ(calc(-1deg * var(--dir)))
              scale(1.02);
            filter:
              blur(0px)
              drop-shadow(0 20px 44px rgba(0,0,0,var(--shadowB)));
          }

          100% {
            transform:
              translate3d(0, 0, 0)
              rotateY(0deg)
              rotateZ(0deg)
              scale(1);
            opacity: 1;
            filter:
              blur(0px)
              drop-shadow(0 16px 36px rgba(0,0,0,var(--shadowA)));
          }
        }
      `}</style>

      <div className="arc-wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((c, i) => {
            // ✅ 280ms delay בין קלפים
            const delayMs = i * 280;

            return (
              <article
                key={`${c.title}-${i}-${String(animationKey ?? "")}`}
                className={cn(
                  "arc-card rounded-2xl border border-white/10 bg-[#0b0f14]/80 backdrop-blur-md",
                  "p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                  "transition-transform duration-300 hover:-translate-y-1",
                  play ? "opacity-100" : "", // opacity בפועל נקבע באנימציה, זה רק שלא יבהב
                )}
                style={
                  {
                    // מפעיל/מכבה אנימציה כדי שתמיד יתחיל נקי
                    animationPlayState: play ? "running" : "paused",
                    ["--arcDelay" as any]: `${delayMs}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="flex items-start gap-3">
                  {c.icon ? (
                    <div className="shrink-0">{c.icon}</div>
                  ) : (
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10" />
                  )}

                  <div className="min-w-0">
                    <h3 className="text-white font-semibold tracking-tight text-base">{c.title}</h3>
                    {c.description ? (
                      <p className="mt-1 text-white/70 text-sm leading-relaxed">{c.description}</p>
                    ) : null}
                  </div>
                </div>

                {/* פס זהב עדין למראה פרימיום */}
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
