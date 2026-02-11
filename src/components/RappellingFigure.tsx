import React, { useEffect, useState } from "react";
import rappellingFigure from "@/assets/rappelling-figure.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

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

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Rope line from top to figure */}
      <div
        className="absolute bg-white/60"
        style={{
          right: 110,
          top: 0,
          width: 2,
          height: figureY + 20,
          willChange: "height",
        }}
      />

      {/* Figure image */}
      <img
        src={rappellingFigure}
        alt="פועל סנפלינג"
        draggable={false}
        className="absolute drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        style={{
          right: 0,
          top: figureY,
          width: 300,
          height: "auto",
          willChange: "top",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
        }}
      />
    </div>
  );
}
