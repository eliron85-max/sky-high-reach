import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "3/4" | "1/1";
  enableEntranceAnimation?: boolean;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "לפני",
  afterLabel = "אחרי",
  title,
  className,
  aspectRatio = "16/9",
  enableEntranceAnimation = true,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll reveal for entrance animation
  const { ref: scrollRef, isVisible } = useScrollReveal({ 
    threshold: 0.3,
    triggerOnce: true 
  });

  // Animate slider handle from left to center on first view (RTL: לפני on right, אחרי on left)
  useEffect(() => {
    if (isVisible && enableEntranceAnimation && !hasAnimated) {
      setSliderPosition(0); // Start from left (showing full "after"/אחרי)
      const timer = setTimeout(() => {
        setSliderPosition(50); // Animate to center
        setHasAnimated(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible, enableEntranceAnimation, hasAnimated]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      // RTL: Invert the percentage so dragging right reveals "before" (לפני)
      const percentage = Math.min(Math.max(100 - (x / rect.width) * 100, 0), 100);
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMove]);

  const aspectRatioClass = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
  }[aspectRatio];

  // Combine refs
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [scrollRef]);

  const showAnimation = enableEntranceAnimation && isVisible;

  return (
    <div 
      ref={setRefs}
      className={cn("w-full", className)}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden rounded-lg cursor-ew-resize select-none",
          aspectRatioClass
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* After Image (Full width, underneath) - Left side in RTL (אחרי) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Before Image (Clipped from right) - לפני on right side in RTL */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ 
            width: `${sliderPosition}%`,
            right: 0,
            left: "auto"
          }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute h-full object-cover"
            style={{ 
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
              maxWidth: "none",
              right: 0,
              left: "auto",
              top: 0,
              bottom: 0
            }}
            draggable={false}
          />
        </div>

        {/* Labels - RTL layout: לפני on right, אחרי on left */}
        <div 
          className="absolute top-3 md:top-4 right-3 md:right-4 px-3 py-1 text-xs md:text-sm font-medium rounded bg-black/50 text-white z-10"
        >
          {beforeLabel}
        </div>
        <div 
          className="absolute top-3 md:top-4 left-3 md:left-4 px-3 py-1 text-xs md:text-sm font-medium rounded bg-black/50 text-white z-10"
        >
          {afterLabel}
        </div>

        {/* Slider Handle - Simple white line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ right: `${sliderPosition}%`, left: "auto" }}
        >
          {/* Vertical Line - White */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2 shadow-lg" />
          
          {/* Handle Circle - White */}
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
              <div className="flex items-center gap-0.5">
                <svg 
                  className="w-3 h-3 md:w-4 md:h-4 text-gray-700 rotate-180" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg 
                  className="w-3 h-3 md:w-4 md:h-4 text-gray-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BeforeAfterSlider };
