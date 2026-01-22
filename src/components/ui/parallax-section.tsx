import { useRef, ReactNode } from "react";
import { useSharedParallax as useParallax } from "@/hooks/useSharedParallax";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  as?: "div" | "section";
  backgroundSpeed?: number;
  contentSpeed?: number;
}

export const ParallaxSection = ({
  children,
  className,
  speed = 0.3,
  as: Component = "div",
  backgroundSpeed,
  contentSpeed,
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { style } = useParallax(ref, { speed });

  return (
    <Component ref={ref} className={cn("relative", className)}>
      <div style={style}>{children}</div>
    </Component>
  );
};

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  overlay?: boolean;
  overlayClassName?: string;
}

export const ParallaxImage = ({
  src,
  alt,
  className,
  speed = 0.3,
  overlay = false,
  overlayClassName,
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { style } = useParallax(ref, { speed });

  return (
    <div ref={ref} className={cn("overflow-hidden relative", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover scale-110"
        style={style}
        loading="lazy"
        decoding="async"
      />
      {overlay && (
        <div className={cn("absolute inset-0", overlayClassName)} />
      )}
    </div>
  );
};

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxLayer = ({
  children,
  speed = 0.2,
  className,
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { style } = useParallax(ref, { speed });

  return (
    <div ref={ref} className={cn("", className)} style={style}>
      {children}
    </div>
  );
};
