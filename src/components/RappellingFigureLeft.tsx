import { useEffect, useState } from "react";
import workerLeft from "@/assets/workerLeftNew.png";

export default function RappellingFigureLeft() {
  const [figureY, setFigureY] = useState(0);

  const figureWidth = 245;

  // אותו יחס כמו הימני, רק שמאל => left
  const ropeLeft = Math.round((136 / 300) * figureWidth);

  const ropeAttachOffset = 60;
  const ropeOverhang = 500;

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      const maxY = window.innerHeight - 350;
      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Rope */}
      <div
        className="absolute"
        style={{
          left: ropeLeft,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
        }}
      />

      {/* Figure */}
      <img
        src={workerLeft}
        draggable={false}
        className="absolute"
        style={{
          left: 0,
          top: figureY,
          width: figureWidth,
          height: "auto",
          animation: "sway 4s ease-in-out infinite",
          transformOrigin: "top center",
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
