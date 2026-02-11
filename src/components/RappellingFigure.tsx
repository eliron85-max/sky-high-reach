import { useEffect, useState } from "react";
import rappellingFigure from "@/assets/Worker.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  // 🔧 גודל הדמות
  const figureWidth = 245;

  // 🔧 מיקום החבל (נעול לפי מצב מדויק שהיה: right=136 כשהדמות 300)
  const ropeRight = Math.round((136 / 300) * figureWidth);

  // 🔧 נקודת החיבור האנכית על הדמות
  const ropeAttachOffset = 60;

  // 🔧 כמה להאריך את החבל מעל המסך (כדי שלא יראו התחלה)
  const ropeOverhang = 500;

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

  // החבל מתחיל מעל המסך אך נשאר מחובר למכשיר
  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Rope */}
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
