import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Convert height (vh/px/etc) to px for calculations.
  const heightPx = useMemo(() => {
    if (typeof window === "undefined") return 0;
    // Use a hidden temp element to resolve any CSS length reliably.
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.height = height;
    document.body.appendChild(el);
    const px = el.getBoundingClientRect().height;
    document.body.removeChild(el);
    return px;
  }, [height]);

  useEffect(() => {
    const onScroll = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      // The section becomes active when the anchor reaches the top, and
      // remains active for (heightPx + scrollDistance).
      const start = rect.top;
      const end = rect.top + heightPx + scrollDistance;

      setIsActive(start <= 0 && end > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heightPx, scrollDistance]);

  const Visual = (
    <div
      className="overflow-hidden"
      style={{ height }}
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
  );

  return (
    <div className="relative">
      {/* Anchor: defines the scroll range in the normal document flow */}
      <div ref={anchorRef} style={{ height: heightPx ? heightPx + scrollDistance : `calc(${height} + ${scrollDistance}px)` }} />

      {/* When active, render as fixed via portal so no parent transforms/filters can break it */}
      {typeof document !== "undefined" && isActive
        ? createPortal(
            <div className="fixed left-0 right-0 top-0 z-20 pointer-events-none">
              <div className="relative pointer-events-none">{Visual}</div>
            </div>,
            document.body
          )
        : null}

      {/* When not active, render it once in-flow so it appears naturally in the timeline */}
      {!isActive ? <div className="relative z-20">{Visual}</div> : null}
    </div>
  );
}
