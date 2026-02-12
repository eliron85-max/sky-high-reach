import { useEffect, useState } from "react";
import workerRight from "@/assets/workerRightNew.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  const figureWidth = 325; // 245 * 1.33 ≈ 325
  const ropeRight = Math.round((136 / 300) * figureWidth);

  const ropeAttachOffset = 60;
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

  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* DEBUG Badge Right */}
      <div
        className="absolute"
        style={{
          right: 10,
          top: 10,
          padding: "4px 8px",
          fontSize: 12,
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 8,
          color: "#fff",
        }}
      >
        RIGHT
      </div>

      {/* Rope */}
      <div
        className="absolute"
        style={{
          right: ropeRight,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
        }}
      />

      {/* Figure */}
      <img
        src={workerRight}
        alt="Worker Right"
        draggable={false}
        className="absolute"
        style={{
          right: 0,
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
