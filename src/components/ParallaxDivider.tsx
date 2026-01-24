import React, { useEffect, useMemo, useRef, useState } from "react";
import { throttle } from "@/lib/throttle";
import facadeRestorationImage from "@/assets/facade-restoration.webp";

interface Props {
  image?: string;
  height?: string;
  scrollDistance?: number;
}

// Smooth easing function for natural transitions
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function ParallaxDivider({
  image = facadeRestorationImage,
  height = "70vh",
  scrollDistance = 400,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on how much we've scrolled through the sticky section
      const totalHeight = rect.height + scrollDistance;
      const scrolled = windowHeight - rect.top;
      const progress = scrolled / totalHeight;

      setScrollProgress(Math.min(1, Math.max(0, progress)));
    }, 16);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDistance]);

  // Smooth opacity with extended full visibility range
  const opacity = useMemo(() => {
    // Fade in: 0% → 25%
    if (scrollProgress < 0.25) {
      return easeInOutCubic(scrollProgress / 0.25);
    }
    // Full visibility: 25% → 75%
    if (scrollProgress <= 0.75) {
      return 1;
    }
    // Fade out: 75% → 100%
    return easeInOutCubic(1 - (scrollProgress - 0.75) / 0.25);
  }, [scrollProgress]);

  return (
    <div className="relative">
      {/* Spacer - creates scrollable area */}
      <div style={{ height: `calc(${height} + ${scrollDistance}px)` }} />

      {/* Sticky Container - stays fixed in viewport */}
      <div
        ref={ref}
        className="sticky top-0 overflow-hidden z-20"
        style={{
          height,
          marginTop: `calc(-${height} - ${scrollDistance}px)`,
        }}
      >
        {/* SOLID black background - blocks everything behind */}
        <div className="absolute inset-0 bg-black" />

        {/* Background image - fixed in place */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
          style={{
            opacity,
            transform: "scale(1.05)",
            transition: "opacity 0.2s ease-out",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none"
          style={{ opacity, transition: "opacity 0.2s ease-out" }}
        />

        {/* Gold accent overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/15 via-transparent to-[#c9a84c]/10 pointer-events-none"
          style={{ opacity, transition: "opacity 0.2s ease-out" }}
        />
      </div>
    </div>
  );
}
