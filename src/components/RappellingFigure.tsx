import { useEffect, useState } from "react";
import rappellingFigure from "@/assets/Worker.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  // 🔧 גודל הדמות (כאן אתה משנה אם תרצה)
  const figureWidth = 245;

  // 🔧 מיקום חבל שננעל מדויק כשהדמות הייתה 300 עם right=136
  const ropeRight = Math.round((136 / 300) * figureWidth) + 18;

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
      {/* Rope */}
      <div
        className="absolute"
        style={{
          right: ropeRight,
          top: 0,
          width: 1.2,
          height: figureY + 8,
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
