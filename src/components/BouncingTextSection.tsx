import { useEffect, useRef, useState } from "react";

interface Props {
  lines: string[];
}

export default function BouncingTextSection({ lines }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const raw = 1 - (sectionCenter - vh * 0.4) / (vh * 0.8);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allChars = lines.flatMap((line) => line.split(""));
  const totalNonSpace = allChars.filter((c) => c !== " ").length;

  let globalCharIndex = 0;

  return (
    <div
      ref={sectionRef}
      className="relative py-32 md:py-44 lg:py-56 overflow-hidden bg-background"
    >
      {/* Subtle radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4" dir="rtl">
        {lines.map((line, lineIdx) => {
          const chars = line.split("");
          return (
            <h2
              key={lineIdx}
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-center leading-tight"
              style={{ fontFamily: "'Rubik', sans-serif", fontWeight: 700 }}
            >
              {chars.map((char, i) => {
                if (char === " ") {
                  return <span key={i} className="inline-block w-[0.3em]" />;
                }

                const idx = globalCharIndex++;
                const threshold = idx / totalNonSpace;
                const staggerStart = threshold * 0.6;
                const charProgress = Math.max(
                  0,
                  Math.min(1, (progress - staggerStart) / (1 - staggerStart))
                );

                const translateY = (1 - charProgress) * 80;
                const scale = 0.5 + charProgress * 0.5;
                const opacity = charProgress;
                const rotate = (1 - charProgress) * (idx % 2 === 0 ? 10 : -10);

                // Dynamic glow intensity per char
                const glowOpacity = charProgress * 0.7;
                const textShadow = charProgress > 0.1
                  ? `0 0 ${20 * charProgress}px rgba(201,168,76,${glowOpacity * 0.4}), 0 0 ${40 * charProgress}px rgba(201,168,76,${glowOpacity * 0.2}), 0 2px 4px rgba(0,0,0,0.5)`
                  : "none";

                return (
                  <span
                    key={i}
                    className="inline-block will-change-transform"
                    style={{
                      background: `linear-gradient(170deg, #e8d5a3 ${10 + charProgress * 20}%, #c9a84c 50%, #a07830 ${80 - charProgress * 10}%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity,
                      transition: "none",
                      filter: charProgress > 0.5 ? `drop-shadow(0 2px 8px rgba(201,168,76,${glowOpacity * 0.3}))` : "none",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h2>
          );
        })}

        {/* Gold accent line */}
        <div
          className="mx-auto mt-8 rounded-full"
          style={{
            width: `${Math.min(progress * 200, 120)}px`,
            height: "3px",
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            opacity: progress,
            transition: "width 0.3s ease-out",
          }}
        />
      </div>
    </div>
  );
}
