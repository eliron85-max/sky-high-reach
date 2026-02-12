// src/components/RappellingFigure.tsx
import { useEffect, useMemo, useState } from "react";
import workerRight from "@/assets/workerRightNew.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  // גודל אחיד (כמו שעשית)
  const figureWidth = 184;

  // מיקום החבל ביחס לרוחב התמונה (אותו חישוב, רק יציב)
  const ropeRight = useMemo(() => Math.round((136 / 300) * figureWidth), [figureWidth]);

  const ropeAttachOffset = 60;
  const ropeOverhang = 500;

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;

      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      // שלא "יברח" למטה מדי
      const maxY = Math.max(0, window.innerHeight - 350);

      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // גם בריסייז
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }} aria-hidden="true">
      {/* Rope */}
      <div
        className="absolute"
        style={{
          right: ropeRight,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
          opacity: 0.9,
        }}
      />

      {/* Figure */}
      <img
        src={workerRight}
        alt="Worker Right"
        draggable={false}
        className="absolute select-none"
        style={{
          right: 0,
          top: figureY,
          width: figureWidth,
          height: "auto",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
          willChange: "transform, top",
        }}
      />

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
