import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  image: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  imagePosition: "right" | "left";
  ctaText?: string;
  ctaHref?: string;
};

export default function StickySplitSection({
  image,
  imageAlt = "",
  title,
  subtitle,
  description,
  features,
  imagePosition,
  ctaText,
  ctaHref,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
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

  // Animation values based on scroll
  const imageScale = 1 + progress * 0.08;
  const textTranslateY = Math.max(0, (1 - progress * 2.5) * 60);
  const textOpacity = Math.min(1, progress * 3);

  const imageBlock = (
    <div className="lg:w-1/2 h-[40vh] lg:h-screen sticky top-0 overflow-hidden">
      <img
        src={image}
        alt={imageAlt}
        className="w-full h-full object-cover will-change-transform"
        style={{
          transform: `scale(${imageScale})`,
          transition: "none",
        }}
        loading="lazy"
      />
      <div
        className={cn(
          "absolute inset-0",
          imagePosition === "right"
            ? "bg-gradient-to-r from-background/60 to-transparent"
            : "bg-gradient-to-l from-background/60 to-transparent"
        )}
      />
    </div>
  );

  const textBlock = (
    <div
      className="lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-0"
      dir="rtl"
    >
      <div
        className="max-w-lg"
        style={{
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
          transition: "none",
        }}
      >
        {subtitle && (
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4 block">
            {subtitle}
          </span>
        )}

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-6">
          <span className="bg-gradient-to-l from-[#e8d5a3] via-[#c9a84c] to-[#9a7530] bg-clip-text text-transparent">
            {title}
          </span>
        </h2>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="space-y-3 mb-8">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-foreground text-sm"
                style={{
                  opacity: Math.min(1, Math.max(0, (progress - 0.2 - i * 0.1) * 5)),
                  transform: `translateX(${Math.max(0, (1 - (progress - 0.2 - i * 0.1) * 5) * 20)}px)`,
                  transition: "none",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {ctaText && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] text-sm hover:bg-[#c9a84c]/10 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} style={{ height: "150vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          {imagePosition === "right" ? (
            <>
              {textBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {textBlock}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
