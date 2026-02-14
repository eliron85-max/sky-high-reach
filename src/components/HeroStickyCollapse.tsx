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
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };
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

  // Luxury animation values
  const translateY = -30 * p;

  return (
    <div className="relative">
      {/* ✅ Wrapper height defines the scroll range — no negative margin tricks */}
      <div style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
        {/* Sticky Hero Container */}
        <section id="hero" className="sticky top-0 h-screen w-full overflow-hidden">
          {/* ✅ Opaque base to avoid any flash/bleed on first paint */}
          <div className="absolute inset-0 bg-black" />

          <div
            className="relative h-full w-full will-change-transform transform-gpu"
            style={{
              transform: `translateY(${translateY}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {children}
          </div>
        </section>
      </div>

      {/* After content */}
      <div className="relative">{after}</div>
    </div>
  );
}
