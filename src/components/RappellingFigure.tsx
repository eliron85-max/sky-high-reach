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
        className="absolute bg-white/50"
        style={{
          right: 127,
          top: 0,
          width: 1.5,
          height: figureY + 8,
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
    </div>
  );
}
