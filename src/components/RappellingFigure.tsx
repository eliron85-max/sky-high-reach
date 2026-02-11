import { useEffect, useState } from "react";

type Props = {
  image: string;
  side: "left" | "right";
  figureWidth?: number;
};

export default function RappellingFigure({
  image,
  side,
  figureWidth = 245,
}: Props) {
  const [figureY, setFigureY] = useState(0);

  const ropeAttachOffset = 60;
  const ropeOverhang = 500;

  // יחס ימני שננעל כשהיה 300px
  const baseRight = Math.round((136 / 300) * figureWidth);

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
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const ropeTop = -ropeOverhang;
  const ropeHeight = figureY + ropeAttachOffset + ropeOverhang;

  const positionStyle =
    side === "right"
      ? { right: 0 }
      : { left: 0 };

  const ropePosition =
    side === "right"
      ? { right: baseRight }
      : { left: baseRight };

  return (
    <div
      className="hidden lg:block fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      {/* Rope */}
      <div
        className="absolute"
        style={{
          ...ropePosition,
          top: ropeTop,
          width: 1.2,
          height: ropeHeight,
          backgroundColor: "#808080",
        }}
      />

      {/* Figure */}
      <img
        src={image}
        draggable={false}
        className="absolute"
        style={{
          ...positionStyle,
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
