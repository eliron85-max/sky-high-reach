import { useEffect, useRef, useState } from "react";
import { throttle } from "@/lib/throttle";

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
      // Slower, more gradual: spread progress over a larger scroll range
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Flatten all chars across lines for indexing
  const allChars = lines.flatMap((line) => line.split(""));
  const totalNonSpace = allChars.filter((c) => c !== " ").length;

  let globalCharIndex = 0;

  return (
    <div
      ref={sectionRef}
      className="relative py-32 md:py-44 lg:py-56 overflow-hidden bg-background"
    >
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
                // Much more staggered: each char waits longer before animating
                const charProgress = Math.max(
                  0,
                  Math.min(1, (progress - threshold * 0.85) / 0.15)
                );

                const translateY = (1 - charProgress) * 120;
                const scale = 0.3 + charProgress * 0.7;
                const opacity = charProgress;
                const rotate = (1 - charProgress) * (idx % 2 === 0 ? 15 : -15);

                return (
                  <span
                    key={i}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#c9a84c] to-[#a07830] dark:from-[#e8d5a3] dark:to-[#c9a84c] will-change-transform"
                    style={{
                      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity,
                      transition: "none",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h2>
          );
        })}
      </div>
    </div>
  );
}