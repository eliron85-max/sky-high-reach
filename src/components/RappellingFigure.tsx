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
    <div className="fixed top-0 right-8 h-screen hidden lg:block pointer-events-none" style={{ zIndex: 30 }}>
      {/* Rope */}
      <div
        className="absolute right-1/2 top-0 w-[2px] bg-foreground/40"
        style={{
          height: figureY + 10,
          transform: "translateX(50%)",
          willChange: "height",
        }}
      />
      {/* Figure */}
      <div
        className="absolute right-0"
        style={{
          top: figureY,
          willChange: "transform",
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
