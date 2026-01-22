import { useEffect, useState, RefObject, useCallback } from "react";
import { throttle } from "@/lib/throttle";

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

export const useParallax = (
  elementRef: RefObject<HTMLElement>, 
  options: ParallaxOptions | number = {}
) => {
  const [offset, setOffset] = useState(0);
  
  // Support legacy number parameter
  const config = typeof options === "number" 
    ? { speed: options, direction: "vertical" as const, disabled: false }
    : { speed: 0.5, direction: "vertical" as const, disabled: false, ...options };

  const { speed, direction, disabled } = config;

  const handleScroll = useCallback(() => {
    if (!elementRef.current || disabled) return;

    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far through the viewport the element is
    const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
    const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
    
    // Calculate parallax offset based on speed (-1 to 1 range)
    const parallaxOffset = (clampedPercent - 0.5) * 100 * speed;
    
    setOffset(parallaxOffset);
  }, [elementRef, speed, disabled]);

  useEffect(() => {
    if (disabled) return;

    const throttledScroll = throttle(handleScroll, 16); // ~60fps
    
    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll, disabled]);

  return {
    offset,
    style: direction === "vertical" 
      ? { transform: `translateY(${offset}px)`, willChange: "transform" }
      : { transform: `translateX(${offset}px)`, willChange: "transform" }
  };
};
