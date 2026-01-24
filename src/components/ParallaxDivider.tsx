import React from "react";
import facadeRestorationImage from "@/assets/facade-restoration.webp";

interface Props {
  image?: string;
  height?: string;
  scrollDistance?: number;
}

export function ParallaxDivider({
  image = facadeRestorationImage,
  height = "70vh",
  scrollDistance = 400,
}: Props) {
  return (
    <div className="relative">
      {/* Spacer - creates scrollable area */}
      <div style={{ height: `calc(${height} + ${scrollDistance}px)` }} />

      {/* Sticky Container - stays fixed in viewport, content scrolls OVER it like a curtain */}
      <div
        className="sticky top-0 overflow-hidden z-20"
        style={{
          height,
          marginTop: `calc(-${height} - ${scrollDistance}px)`,
        }}
      >
        {/* SOLID black background */}
        <div className="absolute inset-0 bg-black" />

        {/* Background image - always visible, no fade */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
          style={{ transform: "scale(1.05)" }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none" />

        {/* Gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/15 via-transparent to-[#c9a84c]/10 pointer-events-none" />
      </div>
    </div>
  );
}
