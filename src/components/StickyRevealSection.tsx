import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RevealLayer = {
  image: string;
  title: string;
  subtitle?: string;
};

type Props = {
  layers: RevealLayer[];
  sectionTitle?: string;
};

export default function StickyRevealSection({ layers, sectionTitle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = el.offsetHeight - vh;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalLayers = layers.length;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(totalLayers + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Title overlay */}
        {sectionTitle && (
          <div
            className="absolute inset-x-0 top-8 z-30 text-center pointer-events-none"
            style={{ opacity: Math.max(0, 1 - progress * 3) }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light">
              <span className="bg-gradient-to-l from-[#e8d5a3] via-[#c9a84c] to-[#9a7530] bg-clip-text text-transparent">
                {sectionTitle}
              </span>
            </h2>
          </div>
        )}

        {layers.map((layer, i) => {
          const layerProgress = progress * totalLayers;
          const layerStart = i;
          const distFromLayer = layerProgress - layerStart;

          // Each layer peels up to reveal the next
          const translateY =
            distFromLayer < 0
              ? 100 // below: hidden
              : distFromLayer > 1
              ? -100 // above: peeled away
              : 0; // active

          const scale =
            distFromLayer > 1
              ? 0.85
              : distFromLayer < 0
              ? 1.05
              : 1;

          const opacity =
            distFromLayer < -0.5
              ? 0
              : distFromLayer > 1.2
              ? 0
              : 1;

          const zIndex = totalLayers - i;

          return (
            <div
              key={i}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translateY(${translateY}%) scale(${scale})`,
                opacity,
                zIndex,
                transition: "none",
              }}
            >
              {/* Image */}
              <img
                src={layer.image}
                alt={layer.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Text */}
              <div
                className="absolute bottom-[15%] inset-x-0 text-center px-4"
                dir="rtl"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3">
                  {layer.title}
                </h3>
                {layer.subtitle && (
                  <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">
                    {layer.subtitle}
                  </p>
                )}
              </div>

              {/* Layer edge shadow for peeling feel */}
              <div
                className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"
                style={{ opacity: distFromLayer > 0.5 ? 1 : 0 }}
              />
            </div>
          );
        })}

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
          style={{ opacity: progress < 0.9 ? 0.6 : 0 }}
        >
          <div className="w-[2px] h-8 bg-gradient-to-b from-[#c9a84c] to-transparent" />
        </div>
      </div>
    </div>
  );
}
