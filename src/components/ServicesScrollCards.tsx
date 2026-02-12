import { useEffect, useRef } from "react";

interface Item {
  title: string;
  image: string;
}

interface Props {
  title: string;
  items: Item[];
  className?: string;
}

export default function ServicesScrollCards({ title, items, className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      const progress = 1 - rect.top / windowH;
      const clamped = Math.max(0, Math.min(1, progress));

      const cards = sectionRef.current.querySelectorAll<HTMLDivElement>(".deck-card");

      cards.forEach((card, i) => {
        const spread = 260; // מרחק פיזור אופקי
        const rotate = (i - items.length / 2) * 6; // רוטציה בסיסית
        const offsetX = (i - items.length / 2) * spread * clamped;
        const offsetY = Math.abs(i - items.length / 2) * 40 * clamped;

        card.style.transform = `
          translate(-50%, -50%)
          translateX(${offsetX}px)
          translateY(${offsetY}px)
          rotate(${rotate}deg)
        `;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  return (
    <section ref={sectionRef} className={`relative w-full h-[120vh] overflow-hidden ${className}`} dir="rtl">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <h2 className="absolute top-16 text-4xl font-bold text-[#f5d58a]">{title}</h2>

        <div className="relative w-full h-full">
          {items.map((item, i) => (
            <div
              key={i}
              className="deck-card absolute left-1/2 top-1/2
                         w-[340px] h-[440px]
                         rounded-3xl
                         shadow-2xl
                         overflow-hidden
                         transition-transform duration-700 ease-out"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 100 - i,
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 right-6 text-white text-2xl font-semibold">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
