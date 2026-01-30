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
  const [vh, setVh] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setVh(window.innerHeight || 800);
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

  // Keep your original logic, but without direct window access in render
  const marginTopVh = useMemo(() => {
    const safeVh = vh || 800;
    return `-${100 + (distance / safeVh) * 100}vh`;
  }, [distance, vh]);

  return (
    <div className="relative">
      {/* Spacer to allow scrolling */}
      <div style={{ height: `calc(100vh + ${distance}px)` }} />

      {/* Sticky Hero Container */}
      <section id="hero" className="sticky top-0 h-screen w-full overflow-hidden" style={{ marginTop: marginTopVh }}>
        {/* ✅ BLACK SEAL LAYER - makes the area fully opaque black and prevents hero "reflection" */}
        <div className="absolute inset-0 bg-black z-0" />

        <div
          className="relative z-10 h-full w-full will-change-transform transform-gpu"
          style={{
            transform: `translateY(${translateY}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {children}
        </div>
      </section>

      {/* ✅ BLACK TOP BAR BEFORE AFTER - kills any remaining overlap/bleed at the seam */}
      <div className="relative z-10">
        <div className="w-full bg-black h-24" />
        {after}
      </div>
    </div>
  );
}
