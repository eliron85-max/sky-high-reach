import { useEffect, useMemo, useState } from "react";
import rappellingFigure from "@/assets/Worker.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);
  const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 0));

  // 🔧 גודל הדמות
  const figureWidth = 245;

  // 🔧 מיקום החבל (נעול לפי מצב שהיה מדויק: right=136 כשהדמות 300)
  const ropeRight = Math.round((136 / 300) * figureWidth);

  // 🔧 נקודת החיבור האנכית על הדמות (אותו offset שהיה לך: +8)
  const ropeAttachOffset = 30;

  // 🔧 כמה "להמשיך" את החבל מעל המסך (כדי שלא יראו התחלה)
  const ropeOverhang = 500;

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      const maxY = window.innerHeight - 350;
      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ מקצועי: החבל מתחיל מעל המסך (שלילי), אבל האורך שלו מפצה כדי להגיע לנקודת החיבור
  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Rope (always vertical, no "end" at top) */}
      <div
        className="absolute"
        style={{
          right: ropeRight,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
          willChange: "height",
        }}
      />

      {/* Figure */}
      <img
        src={rappellingFigure}
        alt="פועל סנפלינג"
        draggable={false}
        className="absolute"
        style={{
          right: 0,
          top: figureY,
          width: figureWidth,
          height: "auto",
          willChange: "top",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
        }}
      />

      {/* Animation */}
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
          100% { transform: rotate(-1.2deg); }
        }
      `}</style>
    </div>
  );
}
