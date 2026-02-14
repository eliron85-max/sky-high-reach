import React, { useEffect, useMemo, useState } from "react";
import { throttle } from "@/lib/throttle";

type Props = {
  collapseDistance?: number;
  mobileCollapseDistance?: number;
  children: React.ReactNode;
  after: React.ReactNode;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HeroStickyCollapse({
  collapseDistance = 650,
  mobileCollapseDistance = 450,
  children,
  after,
}: Props) {
  const [y, setY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = throttle(() => setY(window.scrollY || 0), 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const distance = isMobile ? mobileCollapseDistance : collapseDistance;
  const p = useMemo(() => clamp(y / distance, 0, 1), [y, distance]);

  // Hero animation values
  const scale = 1 - 0.15 * p;        // 1 → 0.85
  const opacity = 1 - 0.2 * p;       // 1 → 0.8
  const translateY = -50 * p;         // 0 → -50px

  const borderRadius = 40 * p;        // 0 → 40px on after section

  return (
    <div className="relative">
      {/* Scroll range wrapper */}
      <div style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
        {/* Sticky Hero */}
        <section id="hero" className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div
            className="relative h-full w-full will-change-transform transform-gpu"
            style={{
              transform: `scale(${scale}) translateY(${translateY}px)`,
              opacity,
              transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            }}
          >
            {children}
          </div>
        </section>
      </div>

      {/* After content – rises over hero */}
      <div
        className="relative bg-black"
        style={{
          borderTopLeftRadius: `${borderRadius}px`,
          borderTopRightRadius: `${borderRadius}px`,
          marginTop: `-${borderRadius}px`,
          overflow: "hidden",
        }}
      >
        {after}
      </div>
    </div>
  );
}
