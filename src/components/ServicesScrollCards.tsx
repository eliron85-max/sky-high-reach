import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Item {
  title: string;
  image: string;
  href?: string;
}

interface Props {
  title: string;
  items: Item[];
  className?: string;
}

export default function ServicesScrollCards({ title, items, className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || 1;

      const progress = 1 - rect.top / windowH;
      const clamped = Math.max(0, Math.min(1, progress));

      const cards = sectionRef.current.querySelectorAll<HTMLAnchorElement>(".deck-card");

      const count = items.length;
      const mid = (count - 1) / 2;

      const vw = window.innerWidth || 1200;
      const spread = vw >= 1440 ? 280 : vw >= 1200 ? 240 : 200;
      const yStep = vw >= 1440 ? 46 : vw >= 1200 ? 40 : 34;

      cards.forEach((card, i) => {
        const pos = i - mid;
        const r = pos * 7;

        const x = pos * spread * clamped;
        const y = Math.abs(pos) * yStep * clamped;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
        card.style.setProperty("--r", `${r}deg`);
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
          {items.map((item, i) => {
            const isHover = hovered === i;

            return (
              <Link
                key={i}
                to={item.href || "/"}
                className={`deck-card absolute left-1/2 top-1/2 select-none ${isHover ? "is-hover" : ""}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                aria-label={item.title}
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* שכבת כהות כללית */}
                <div className="deck-dim absolute inset-0" />

                {/* שכבת הארה לכרטיס הנבחר */}
                <div className="deck-glow absolute inset-0" />

                <div className="absolute bottom-6 right-6 text-white text-2xl font-semibold drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]">
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .deck-card{
          width: clamp(260px, 22vw, 340px);
          height: clamp(340px, 30vw, 440px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0,0,0,.35);
          transition: transform 650ms ease, box-shadow 300ms ease, filter 300ms ease;
          transform:
            translate(-50%, -50%)
            translateX(var(--x, 0px))
            translateY(var(--y, 0px))
            rotate(var(--r, 0deg));
          z-index: var(--z, 1);
          cursor: pointer;
          will-change: transform;
        }

        /* כהות ברירת מחדל לכל הכרטיסים */
        .deck-dim{
          background: rgba(0,0,0,0.48);
          transition: opacity 220ms ease;
          opacity: 1;
        }

        /* הארה שמופיעה רק בהובר */
        .deck-glow{
          background:
            radial-gradient(900px 520px at 50% 28%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%),
            linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 220ms ease;
          pointer-events: none;
        }

        /* הכרטיס הנבחר: יוצא מהחבילה + הכי מואר */
        .deck-card.is-hover{
          transform:
            translate(-50%, -50%)
            translateX(var(--x, 0px))
            translateY(calc(var(--y, 0px) - 32px))
            rotate(0deg)
            scale(1.09);
          z-index: 999;
          box-shadow: 0 30px 80px rgba(0,0,0,.50);
          filter: brightness(0.85) saturate(1.05) contrast(1.03);
        }

        .deck-card.is-hover .deck-dim{
          opacity: 0.18;
        }

        .deck-card.is-hover .deck-glow{
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce){
          .deck-card{
            transition: none !important;
          }
          .deck-card.is-hover{
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
