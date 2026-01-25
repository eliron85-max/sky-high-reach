import React from "react";

interface BackgroundManProps {
  imageUrl: string;
  /** Tailwind classes for opacity (e.g. "opacity-[0.07]") */
  opacityClass?: string;
  /** Tailwind classes for blur (e.g. "blur-[1px]") */
  blurClass?: string;
  /** Tailwind classes for background position (e.g. "bg-right") */
  positionClass?: string;
  /** Tailwind classes for background size (e.g. "bg-contain") */
  sizeClass?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Lightweight background wrapper used on the home page.
 * Renders a non-interactive background image layer behind its children.
 */
export default function BackgroundMan({
  imageUrl,
  opacityClass = "opacity-10",
  blurClass,
  positionClass = "bg-center",
  sizeClass = "bg-cover",
  className,
  children,
}: BackgroundManProps) {
  return (
    <div className={`relative ${className ?? ""}`.trim()}>
      <div
        aria-hidden
        className={`absolute inset-0 pointer-events-none bg-no-repeat ${positionClass} ${sizeClass} ${opacityClass} ${
          blurClass ?? ""
        }`.trim()}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
