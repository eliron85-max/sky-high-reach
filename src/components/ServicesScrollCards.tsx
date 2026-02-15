import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, items.length - 1));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

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

      if (vw < 640) {
        // Mobile: carousel mode — show one card at a time based on activeIndex
        cards.forEach((card, i) => {
          const offset = i - activeIndex;
          const x = offset * (vw * 0.65);
          card.style.setProperty("--x", `${x}px`);
          card.style.setProperty("--y", `0px`);
          card.style.setProperty("--r", `0deg`);
          card.style.setProperty("--z", i === activeIndex ? "999" : String(100 - Math.abs(offset)));
        });
        return;
      }

      // Desktop/tablet: fan effect
      let spread: number, yStep: number, rotation: number;
      if (vw < 768) {
        spread = 70;
        yStep = 16;
        rotation = 4;
      } else {
        spread = Math.max(80, Math.min(280, (vw - 768) * (280 - 80) / (1920 - 768) + 80));
        yStep = Math.max(18, Math.min(46, (vw - 768) * (46 - 18) / (1920 - 768) + 18));
        rotation = vw >= 1200 ? 7 : vw >= 1024 ? 5 : 4;
      }

      cards.forEach((card, i) => {
        const pos = i - mid;
        const r = pos * rotation;
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
  }, [items.length, activeIndex]);

  return (
    <section ref={sectionRef} className={`relative w-full h-[120vh] overflow-hidden ${className}`} dir="rtl">
      {/* ===== BACKGROUND IMAGE: light version for light mode, dark version for dark mode ===== */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat dark:hidden"
        style={{ backgroundImage: "url('/images/services-cards-bg-light.webp')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat hidden dark:block"
        style={{ backgroundImage: "url('/images/services-cards-bg.webp')" }}
        aria-hidden="true"
      />

      {/* ===== OVERLAY ===== */}
      <div className="absolute inset-0 z-0 bg-white/10 dark:bg-black/20" aria-hidden="true" />

      <div className="sticky top-0 h-screen flex items-center justify-center z-[1]">
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

                <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 text-white text-base sm:text-2xl font-semibold drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]">
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile arrows */}
        {isMobile && (
          <div className="absolute bottom-20 inset-x-0 flex justify-center gap-8 z-20">
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="w-12 h-12 rounded-full border-2 border-[#c9a84c] bg-black/50 backdrop-blur-sm flex items-center justify-center text-[#c9a84c] transition-opacity disabled:opacity-30 shadow-lg"
              aria-label="Previous"
            >
              <ChevronRight size={24} />
            </button>
            <button
              onClick={goNext}
              disabled={activeIndex === items.length - 1}
              className="w-12 h-12 rounded-full border-2 border-[#c9a84c] bg-black/50 backdrop-blur-sm flex items-center justify-center text-[#c9a84c] transition-opacity disabled:opacity-30 shadow-lg"
              aria-label="Next"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .deck-card{
          width: clamp(220px, 55vw, 340px);
          height: clamp(320px, 75vw, 440px);
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

        @media (max-width: 639px){
          .deck-dim{
            background: rgba(0,0,0,0.22);
          }
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
            translateY(calc(var(--y, 0px) - 60px))
            rotate(0deg)
            scale(1.18);
          z-index: 999;
          box-shadow: 0 40px 90px rgba(0,0,0,.55), 0 0 30px rgba(201,168,76,0.25);
          filter: saturate(1.15) contrast(1.08) brightness(0.9);
        }

        .deck-card.is-hover .deck-dim{
          opacity: 0.18;
        }

        .deck-card.is-hover .deck-glow{
          opacity: 1;
        }

        @media (min-width: 640px){
          .deck-card{
            width: clamp(140px, 18vw, 340px);
            height: clamp(200px, 25vw, 440px);
          }
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
