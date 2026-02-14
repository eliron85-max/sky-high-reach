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
  const sectionRef = useRef<HTMLElement | null>(null);
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
      const spread = vw >= 1440 ? 280 : vw >= 1200 ? 240 : vw >= 1024 ? 160 : 120;
      const yStep = vw >= 1440 ? 46 : vw >= 1200 ? 40 : vw >= 1024 ? 30 : 24;

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
    <section ref={sectionRef} className={`relative w-full h-[120vh] overflow-hidden bg-[#1a1f2e] dark:bg-[#0d1117] ${className}`} dir="rtl">
      {/* ===== BACKGROUND IMAGE: light version for light mode, dark version for dark mode ===== */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat dark:hidden"
        style={{ backgroundImage: "url('/images/services-cards-bg-light.webp')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat hidden dark:block"
        style={{ backgroundImage: "url('/images/services-cards-bg.webp')" }}
        aria-hidden="true"
      />

      {/* ===== OVERLAY ===== */}
      <div className="absolute inset-0 -z-10 bg-white/10 dark:bg-black/20" aria-hidden="true" />

      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="absolute top-12 sm:top-16 inset-x-0 flex flex-col items-center z-10 pointer-events-none">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#c9a84c] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">{title}</h2>
          <div className="mt-3 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        </div>

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
                <div className="deck-dim absolute inset-0" />
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
          width: clamp(200px, 18vw, 340px);
          height: clamp(280px, 25vw, 440px);
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

        .deck-dim{
          background: rgba(0,0,0,0.48);
          transition: opacity 220ms ease;
          opacity: 1;
        }

        .deck-glow{
          background:
            radial-gradient(900px 520px at 50% 28%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%),
            linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 220ms ease;
          pointer-events: none;
        }

        .deck-card.is-hover{
          transform:
            translate(-50%, -50%)
            translateX(var(--x, 0px))
            translateY(calc(var(--y, 0px) - 32px))
            rotate(0deg)
            scale(1.09);
          z-index: 999;
          box-shadow: 0 30px 80px rgba(0,0,0,.50);
          filter: saturate(1.12) contrast(1.06) brightness(0.85);
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
