import { useEffect, useState, useRef } from "react";
import logoImage from "@/assets/logo-new.webp";

const SPARKLES = [
  { top: "28%", left: "38%", size: 18, delay: 0 },
  { top: "22%", left: "55%", size: 12, delay: 0.3 },
  { top: "45%", left: "60%", size: 10, delay: 0.5 },
  { top: "55%", left: "42%", size: 16, delay: 0.2 },
  { top: "35%", left: "65%", size: 8, delay: 0.7 },
  { top: "60%", left: "58%", size: 14, delay: 0.4 },
  { top: "25%", left: "48%", size: 6, delay: 0.8 },
  { top: "50%", left: "35%", size: 10, delay: 0.1 },
];

const LOAD_DURATION = 2800; // ms for 0→100

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"loading" | "fadeOut" | "done">("loading");
  const [percent, setPercent] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / LOAD_DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setPercent(Math.round(eased * 100));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setPhase("fadeOut"), LOAD_DURATION + 200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onFinish();
    }, LOAD_DURATION + 900);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center"
      style={{
        background: "#000000",
        opacity: phase === "fadeOut" ? 0 : 1,
        backdropFilter: phase === "fadeOut" ? "blur(20px)" : "none",
        WebkitBackdropFilter: phase === "fadeOut" ? "blur(20px)" : "none",
        transition: "opacity 0.7s ease-out, backdrop-filter 0.7s ease-out, -webkit-backdrop-filter 0.7s ease-out",
      }}
    >
      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <svg
          key={i}
          className="absolute animate-pulse"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: "1.5s",
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"
            fill="#c9a84c"
            fillOpacity={0.7}
          />
        </svg>
      ))}

      {/* Logo + counter */}
      <div className="flex flex-col items-center gap-8 animate-[fadeInScale_0.8s_ease-out_both]">
        <img
          src={logoImage}
          alt="א.א פרויקטים וגובה"
          className="h-[400px] md:h-[600px] w-auto object-contain drop-shadow-[0_0_60px_rgba(201,168,76,0.5)]"
        />

        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Big percentage counter */}
        <div
          className="text-[48px] md:text-[72px] font-black leading-none tracking-tighter"
          style={{
            background: "linear-gradient(180deg, #e8d5a3 0%, #c9a84c 50%, #9a7530 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(201,168,76,0.3))",
          }}
        >
          {percent}%
        </div>

        {/* Loading bar */}
        <div className="w-64 md:w-80 h-[4px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] rounded-full transition-none"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        <span className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2">Loading</span>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
