// src/components/ServicesScrollCards.tsx
import { useEffect, useRef } from "react";

interface Item {
  title: string;
  image: string;
  href?: string; // אופציונלי - אם תוסיף, הכרטיס יהיה קליקי
}

interface Props {
  title: string;
  items: Item[];
  className?: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function ServicesScrollCards({ title, items, className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight || 1;

      const progress = 1 - rect.top / windowH;
      const clamped = clamp01(progress);

      const cards = section.querySelectorAll<HTMLDivElement>(".deck-card");

      const count = items.length;
      const mid = (count - 1) / 2;

      const vw = window.innerWidth || 1200;

      // רספונסיבי: בלפטופ זה לא יתפזר/יעוף יותר מדי
      const spread = vw >= 1440 ? 280 : vw >= 1200 ? 240 : 200; // פיזור אופקי
      const yStep = vw >= 1440 ? 46 : vw >= 1200 ? 40 : 34; // ירידה קלה

      cards.forEach((card, i) => {
        const pos = i - mid;

        const baseRotate = pos * 7; // רוטציה בסיסית
        const offsetX = pos * spread * clamped;
        const offsetY = Math.abs(pos) * yStep * clamped;

        card.style.setProperty("--x", `${offsetX}px`);
        card.style.setProperty("--y", `${offsetY}px`);
        card.style.setProperty("--r", `${baseRotate}deg`);
        card.style.setProperty("--z", String(100 - i));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [items.length]);

  return (
    <section ref={sectionRef} className={`relative w-full h-[120vh] overflow-hidden ${className}`} dir="rtl">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <h2 className="absolute top-16 text-4xl font-bold text-[#f5d58a]">{title}</h2>

        <div className="relative w-full h-full">
          {items.map((item, i) => (
            <div
              key={i}
              className="deck-card absolute left-1/2 top-1/2 select-none"
              onClick={() => {
                if (item.href) window.location.href = item.href;
              }}
              role={item.href ? "link" : undefined}
              aria-label={item.title}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 right-6 text-white text-2xl font-semibold">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .deck-card{
          width: clamp(260px, 22vw, 340px);
          height: clamp(340px, 30vw, 440px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0,0,0,.35);
          transition: transform 700ms ease, box-shadow 350ms ease, filter 350ms ease;
          transform:
            translate(-50%, -50%)
            translateX(var(--x, 0px))
            translateY(var(--y, 0px))
            rotate(var(--r, 0deg));
          z-index: var(--z, 1);
          cursor: default;
          will-change: transform;
        }

        /* "יוצאת מהחבילה" בריחוף */
        .deck-card:hover{
          transform:
            translate(-50%, -50%)
            translateX(var(--x, 0px))
            translateY(calc(var(--y, 0px) - 28px))
            rotate(0deg)
            scale(1.08);
          z-index: 999;
          box-shadow: 0 28px 70px rgba(0,0,0,.45);
          filter: saturate(1.05) contrast(1.02);
        }

        /* קליק רק אם יש href */
        .deck-card[role="link"]{
          cursor: pointer;
        }

        @media (prefers-reduced-motion: reduce){
          .deck-card{
            transition: none !important;
          }
          .deck-card:hover{
            transform:
              translate(-50%, -50%)
              translateX(var(--x, 0px))
              translateY(var(--y, 0px))
              rotate(var(--r, 0deg));
            filter: none;
          }
        }
      `}</style>
    </section>
  );
}
