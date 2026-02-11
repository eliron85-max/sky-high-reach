import React, { useEffect, useState } from "react";
import rappellingFigure from "@/assets/rappelling-figure.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const maxY = window.innerHeight - 160;
      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-6 h-screen hidden lg:block pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Rope */}
      <div
        className="absolute top-0 w-[2px] bg-white/50"
        style={{
          left: "50%",
          height: figureY + 10,
          transform: "translateX(-50%)",
          willChange: "height",
        }}
      />
      {/* Figure */}
      <div
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: figureY,
          willChange: "top",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
        }}
      >
        <img
          src={rappellingFigure}
          alt="פועל סנפלינג"
          className="h-[140px] w-auto object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
