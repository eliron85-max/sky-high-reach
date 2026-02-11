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
      {/* Rope from top of screen to the figure's attachment point */}
      <div
        className="absolute bg-white/50"
        style={{
          right: 182,
          top: 0,
          width: 1.5,
          height: figureY + 140,
          willChange: "height",
        }}
      />

      {/* Wrapper for figure + sway animation */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: figureY,
          width: 150,
          willChange: "top",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
        }}
      >
        <img
          src={rappellingFigure}
          alt="פועל סנפלינג"
          draggable={false}
          style={{
            width: 150,
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
