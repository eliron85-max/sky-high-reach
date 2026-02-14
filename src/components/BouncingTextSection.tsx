import { useEffect, useRef, useState } from "react";
import { throttle } from "@/lib/throttle";

interface Props {
  text: string;
}

export default function BouncingTextSection({ text }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = throttle(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start when section enters viewport, end when it's halfway up
      const raw = 1 - rect.top / vh;
      setProgress(Math.max(0, Math.min(1, raw)));
    }, 16);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Split text into characters (keep spaces)
  const chars = text.split("");
  const totalChars = chars.filter((c) => c !== " ").length;

  let charIndex = 0;

  return (
    <div
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4" dir="rtl">
        <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-center leading-tight">
          {chars.map((char, i) => {
            if (char === " ") {
              return (
                <span key={i} className="inline-block w-[0.3em]" />
              );
            }

            const idx = charIndex++;
            // Each character appears based on scroll progress
            const threshold = idx / totalChars;
            const charProgress = Math.max(
              0,
              Math.min(1, (progress - threshold * 0.7) / 0.3)
            );

            // Bounce: start from below + scaled down, land at position
            const translateY = (1 - charProgress) * 120;
            const scale = 0.3 + charProgress * 0.7;
            const opacity = charProgress;
            // Slight rotation for playfulness
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
      </div>
    </div>
  );
}
