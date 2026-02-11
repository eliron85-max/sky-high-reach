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
      {/* Single rope */}
      <div
        className="absolute"
        style={{
          right: 136, // 👈 תשנה כאן לפי הכיוון שסגרנו
          top: 0,
          width: 1.3,
          height: figureY + 8,
          backgroundColor: "#808080",
          willChange: "height",
        }}
      />

      {/* Figure image */}
      <img
        src={rappellingFigure}
        alt="פועל סנפלינג"
        draggable={false}
        className="absolute"
        style={{
          right: 0,
          top: figureY,
          width: 300,
          height: "auto",
          willChange: "top",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
        }}
      />

      {/* Sway animation */}
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
