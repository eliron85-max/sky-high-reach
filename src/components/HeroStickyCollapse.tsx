import React, { useEffect, useMemo, useState } from "react";
import { throttle } from "@/lib/throttle";
import facadeRestorationImage from "@/assets/facade-restoration.webp";

type Props = {
  collapseDistance?: number;
  mobileCollapseDistance?: number;
  children: React.ReactNode;
  after: React.ReactNode;
  parallaxImage?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HeroStickyCollapse({
  collapseDistance = 650,
  mobileCollapseDistance = 450,
  children,
  after,
  parallaxImage = facadeRestorationImage,
}: Props) {
  const [y, setY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = throttle(() => setY(window.scrollY || 0), 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const distance = isMobile ? mobileCollapseDistance : collapseDistance;
  const p = useMemo(() => clamp(y / distance, 0, 1), [y, distance]);

  // Luxury animation values
  const translateY = -30 * p;

  // Parallax image values - starts fading in after hero, fully visible midway
  const parallaxStart = distance * 0.3;
  const parallaxEnd = distance * 1.5;
  const parallaxProgress = useMemo(() => {
    if (y < parallaxStart) return 0;
    if (y > parallaxEnd) return 1;
    return (y - parallaxStart) / (parallaxEnd - parallaxStart);
  }, [y, parallaxStart, parallaxEnd]);

  // Parallax image fades in as hero fades, then fades out as content scrolls up
  const parallaxOpacity = useMemo(() => {
    // Fade in from 0 to 0.5 progress, fade out from 0.7 to 1.0 progress
    if (parallaxProgress < 0.5) {
      return parallaxProgress * 2; // 0 -> 1
    }
    if (parallaxProgress > 0.7) {
      return 1 - ((parallaxProgress - 0.7) / 0.3); // 1 -> 0
    }
    return 1;
  }, [parallaxProgress]);

  const parallaxTranslateY = useMemo(() => {
    // Slow parallax movement
    return -parallaxProgress * 100;
  }, [parallaxProgress]);

  return (
    <div className="relative">
      {/* Spacer to allow scrolling */}
      <div style={{ height: `calc(100vh + ${distance}px)` }} />

      {/* Parallax Background Image Layer - Fixed behind everything */}
      <div
        className="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none"
        style={{
          opacity: parallaxOpacity,
          zIndex: 0,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full will-change-transform transform-gpu"
          style={{
            transform: `translateY(${parallaxTranslateY}px) scale(1.1)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <img
            src={parallaxImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          {/* Gold accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/10 via-transparent to-[#c9a84c]/5" />
        </div>
      </div>

      {/* Sticky Hero Container */}
      <section
        id="hero"
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ 
          marginTop: `-${100 + (distance / window.innerHeight) * 100}vh`,
          zIndex: 1,
        }}
      >
        <div
          className="h-full w-full will-change-transform transform-gpu"
          style={{
            transform: `translateY(${translateY}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {children}
        </div>
      </section>

      {/* Content after hero - positioned to overlap */}
      <div className="relative z-10">{after}</div>
    </div>
  );
}
