import { useEffect, useState, useRef, RefObject, useCallback, useMemo } from "react";

interface ParallaxElement {
  ref: RefObject<HTMLElement>;
  speed: number;
  direction: "vertical" | "horizontal";
  callback: (offset: number) => void;
}

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

// Singleton to manage all parallax elements with a single scroll listener
class ParallaxManager {
  private static instance: ParallaxManager;
  private elements: Map<string, ParallaxElement> = new Map();
  private isListening = false;
  private rafId: number | null = null;
  private lastScrollY = 0;

  static getInstance(): ParallaxManager {
    if (!ParallaxManager.instance) {
      ParallaxManager.instance = new ParallaxManager();
    }
    return ParallaxManager.instance;
  }

  private handleScroll = () => {
    // Skip if scroll position hasn't changed significantly
    const currentScrollY = window.scrollY;
    if (Math.abs(currentScrollY - this.lastScrollY) < 1) return;
    this.lastScrollY = currentScrollY;

    // Cancel any pending RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Use RAF for smooth updates
    this.rafId = requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;

      this.elements.forEach((element) => {
        if (!element.ref.current) return;

        const rect = element.ref.current.getBoundingClientRect();
        
        // Calculate how far through the viewport the element is
        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedPercent = Math.max(0, Math.min(1, scrollPercent));
        
        // Calculate parallax offset based on speed
        const parallaxOffset = (clampedPercent - 0.5) * 100 * element.speed;
        
        element.callback(parallaxOffset);
      });
    });
  };

  register(id: string, element: ParallaxElement): void {
    this.elements.set(id, element);
    
    if (!this.isListening && this.elements.size > 0) {
      window.addEventListener("scroll", this.handleScroll, { passive: true });
      this.isListening = true;
      // Initial calculation
      this.handleScroll();
    }
  }

  unregister(id: string): void {
    this.elements.delete(id);
    
    if (this.isListening && this.elements.size === 0) {
      window.removeEventListener("scroll", this.handleScroll);
      this.isListening = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  // Force update all elements (useful for initial render)
  update(): void {
    this.handleScroll();
  }
}

// Generate unique ID for each hook instance
let idCounter = 0;
const generateId = () => `parallax-${++idCounter}`;

export const useSharedParallax = (
  elementRef: RefObject<HTMLElement>,
  options: ParallaxOptions | number = {}
) => {
  const [offset, setOffset] = useState(0);
  const idRef = useRef<string>(generateId());
  
  // Support legacy number parameter
  const config = useMemo(() => 
    typeof options === "number"
      ? { speed: options, direction: "vertical" as const, disabled: false }
      : { speed: 0.5, direction: "vertical" as const, disabled: false, ...options },
    [typeof options === "number" ? options : JSON.stringify(options)]
  );

  const { speed, direction, disabled } = config;

  const handleOffsetChange = useCallback((newOffset: number) => {
    setOffset(newOffset);
  }, []);

  useEffect(() => {
    if (disabled || !elementRef.current) return;

    const manager = ParallaxManager.getInstance();
    const id = idRef.current;

    manager.register(id, {
      ref: elementRef,
      speed,
      direction,
      callback: handleOffsetChange,
    });

    // Initial update
    manager.update();

    return () => {
      manager.unregister(id);
    };
  }, [elementRef, speed, direction, disabled, handleOffsetChange]);

  const style = useMemo(() => 
    direction === "vertical"
      ? { transform: `translateY(${offset}px)`, willChange: "transform" }
      : { transform: `translateX(${offset}px)`, willChange: "transform" },
    [offset, direction]
  );

  return { offset, style };
};

// Re-export for backwards compatibility
export { useSharedParallax as useParallax };
