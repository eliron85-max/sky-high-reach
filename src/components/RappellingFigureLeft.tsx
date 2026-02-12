// src/components/RappellingFigureLeft.tsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import workerLeft from "@/assets/workerLeftNew.png";

export default function RappellingFigureLeft() {
  const [figureY, setFigureY] = useState(0);

  const figureWidth = 184;
  const ropeLeft = useMemo(() => Math.round((136 / 300) * figureWidth), [figureWidth]);

  const ropeAttachOffset = 60;
  const ropeOverhang = 500;

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const maxY = Math.max(0, window.innerHeight - 350);
      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="hidden lg:block pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
      }}
      aria-hidden="true"
    >
      {/* Rope */}
      <div
        style={{
          position: "absolute",
          left: ropeLeft,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
          opacity: 0.9,
        }}
      />

      {/* Figure */}
      <img
        src={workerLeft}
        alt="Worker Left"
        draggable={false}
        style={{
          position: "absolute",
          left: 0,
          top: figureY,
          width: figureWidth,
          height: "auto",
          animation: "swayLeft 4s ease-in-out infinite",
          transformOrigin: "top center",
          willChange: "transform, top",
          userSelect: "none",
        }}
      />

      <style>{`
        @keyframes swayLeft {
          0% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
          100% { transform: rotate(-1.2deg); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
