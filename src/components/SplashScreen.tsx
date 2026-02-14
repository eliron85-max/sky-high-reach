import { useEffect, useState } from "react";
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

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"loading" | "fadeOut" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeOut"), 2200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onFinish();
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 40%, #0d1220 100%)",
        opacity: phase === "fadeOut" ? 0 : 1,
        transition: "opacity 0.7s ease-out",
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

      {/* Logo + text */}
      <div className="flex flex-col items-center gap-6 animate-[fadeInScale_0.8s_ease-out_both]">
        <img
          src={logoImage}
          alt="א.א פרויקטים וגובה"
          className="h-[100px] md:h-[140px] w-auto object-contain drop-shadow-[0_0_30px_rgba(201,168,76,0.4)]"
        />

        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e8d5a3] to-[#c9a84c]"
            style={{ fontFamily: "'Ploni', sans-serif" }}
          >
            א.א פרויקטים וגובה
          </h1>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        </div>

        {/* Loading bar */}
        <div className="w-48 h-[3px] rounded-full bg-white/10 overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] rounded-full"
            style={{
              animation: "loadBar 2s ease-in-out forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}