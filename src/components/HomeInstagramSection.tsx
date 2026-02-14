import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// Use existing project images
import img1 from "@/assets/stone-cladding-1.webp";
import img2 from "@/assets/facade-restoration.webp";
import img3 from "@/assets/stone-cladding-3.webp";
import img4 from "@/assets/special-projects.webp";
import img5 from "@/assets/stone-cladding-5.webp";
import img6 from "@/assets/height-solutions.webp";

interface FloatingCard {
  src: string;
  alt: string;
  // Position as % from center
  x: string;
  y: string;
  rotate: number;
  size: string;
  mobileSize: string;
  delay: number;
}

const cards: FloatingCard[] = [
  // Top-left
  { src: img1, alt: "חיפוי אבן", x: "-38%", y: "-20%", rotate: -12, size: "280px", mobileSize: "140px", delay: 0 },
  // Top-right
  { src: img2, alt: "שיקום מבנים", x: "35%", y: "-15%", rotate: 8, size: "260px", mobileSize: "130px", delay: 0.2 },
  // Bottom-left
  { src: img3, alt: "עבודות גובה", x: "-42%", y: "25%", rotate: 6, size: "240px", mobileSize: "120px", delay: 0.4 },
  // Bottom-right
  { src: img4, alt: "פרויקטים מיוחדים", x: "40%", y: "20%", rotate: -10, size: "270px", mobileSize: "135px", delay: 0.1 },
  // Far left middle
  { src: img5, alt: "חיפוי אבן", x: "-50%", y: "5%", rotate: -5, size: "200px", mobileSize: "100px", delay: 0.3 },
  // Far right middle
  { src: img6, alt: "פתרונות גובה", x: "50%", y: "0%", rotate: 12, size: "220px", mobileSize: "110px", delay: 0.5 },
];

const HomeInstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { t, dir } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress: 0 when section enters viewport, 1 when it leaves
      const raw = 1 - rect.top / windowH;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Breathing amplitude based on scroll progress
  const breathe = Math.sin(progress * Math.PI) * 1; // 0→1→0

  return (
    <section
      ref={sectionRef}
      dir={dir}
      className="relative w-full overflow-hidden bg-background"
      style={{ minHeight: "100vh" }}
    >
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Instagram handle */}
        <p className="text-sm md:text-base text-foreground/60 mb-4 tracking-wider">
          @aa.projects.height
        </p>

        {/* Big title */}
        <h2
          className="text-center font-extrabold leading-[0.95] select-none"
          style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            color: "hsl(var(--foreground))",
          }}
        >
          עבודות גובה
          <br />
          ברמה אחרת
        </h2>

        {/* Instagram icon */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-14 h-14 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300"
          aria-label="Instagram"
        >
          <Instagram size={24} />
        </a>
      </div>

      {/* Floating cards */}
      {cards.map((card, i) => {
        // Individual floating offset
        const floatY = Math.sin((progress * Math.PI * 2) + card.delay * 10) * 15 * breathe;
        const floatRotate = Math.sin((progress * Math.PI * 2) + card.delay * 8) * 3 * breathe;
        // Scale in from 0.7 as section scrolls into view
        const scale = 0.7 + progress * 0.3;

        return (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: `
                translate(${card.x}, ${card.y})
                translateY(${floatY}px)
                rotate(${card.rotate + floatRotate}deg)
                scale(${scale})
              `,
              transition: "transform 0.1s linear",
              opacity: 0.3 + progress * 0.7,
              zIndex: i % 2 === 0 ? 5 : 15,
            }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: `var(--card-size-${i})`,
                aspectRatio: "3/4",
              }}
            >
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
            {/* Inline CSS variable for responsive sizing */}
            <style>{`
              :root {
                --card-size-${i}: ${card.mobileSize};
              }
              @media (min-width: 768px) {
                :root {
                  --card-size-${i}: ${card.size};
                }
              }
            `}</style>
          </div>
        );
      })}
    </section>
  );
};

export default HomeInstagramSection;
