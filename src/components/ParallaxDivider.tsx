import { useRef, useState, useEffect, useMemo } from "react";
import { throttle } from "@/lib/throttle";
import facadeRestorationImage from "@/assets/facade-restoration.webp";

interface Props {
  image?: string;
  height?: string;
}

export function ParallaxDivider({ 
  image = facadeRestorationImage,
  height = "70vh" 
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Progress: 0 = section just entering, 1 = section leaving
      const start = windowHeight;
      const end = -rect.height;
      const range = start - end;
      const current = start - rect.top;
      
      setScrollProgress(Math.min(1, Math.max(0, current / range)));
    }, 16);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade in 0->0.4, full 0.4->0.6, fade out 0.6->1
  const opacity = useMemo(() => {
    if (scrollProgress < 0.4) return scrollProgress / 0.4;
    if (scrollProgress > 0.6) return 1 - (scrollProgress - 0.6) / 0.4;
    return 1;
  }, [scrollProgress]);

  // Slow parallax movement
  const translateY = useMemo(() => {
    return -scrollProgress * 80;
  }, [scrollProgress]);

  return (
    <div 
      ref={ref}
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
        style={{
          transform: `translateY(${translateY}px) scale(1.15)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity }}
        />
      </div>
      
      {/* Dark gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"
        style={{ opacity }}
      />
      
      {/* Gold accent overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/15 via-transparent to-[#c9a84c]/10"
        style={{ opacity }}
      />
    </div>
  );
}
