import { useEffect, useRef, useState } from "react";
import { throttle } from "@/lib/throttle";

interface Props {
  lines: string[];
}

export default function BouncingTextSection({ lines }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = throttle(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = 1 - rect.top / vh;
      setProgress(Math.max(0, Math.min(1, raw)));
    }, 16);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Flatten all chars across lines for indexing
  const allChars = lines.flatMap((line) => line.split(""));
  const totalNonSpace = allChars.filter((c) => c !== " ").length;

  let globalCharIndex = 0;

  // Parallax: text moves at ~50% scroll speed
  const parallaxY = progress * 150; // pixels the text "lags" behind

  return (
    <div
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-background">

      <div
        className="container mx-auto px-4"
        dir="rtl"
        style={{
          transform: `translateY(${parallaxY}px)`,
          willChange: "transform"
        }}>

        {lines.map((line, lineIdx) => {
          const chars = line.split("");
          return (
            <div key={lineIdx} className="flex flex-wrap justify-center gap-0 text-3xl md:text-5xl lg:text-6xl font-extrabold font-heebo leading-tight mb-2">
              {chars.map((char, charIdx) => {
                if (char === " ") {
                  return <span key={charIdx} className="w-3 md:w-4" />;
                }
                const idx = globalCharIndex++;
                const revealAt = idx / totalNonSpace;
                const isVisible = progress > revealAt;
                return (
                  <span
                    key={charIdx}
                    className="inline-block transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0.15,
                      transform: isVisible ? "translateY(0)" : "translateY(20px)",
                      backgroundImage: "linear-gradient(to bottom, #e8d5a3, #c9a84c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>);

}