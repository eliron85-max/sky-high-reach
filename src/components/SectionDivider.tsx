import React from "react";

/**
 * Elegant gold section divider with diamond accent and gradient lines.
 * Adapts to both light and dark themes.
 */
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-4 ${className}`} aria-hidden="true">
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-[#c9a84c]/70" />

      {/* Diamond accent */}
      <div className="mx-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/40" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#c9a84c] bg-[#c9a84c]/20" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/40" />
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/50 to-[#c9a84c]/70" />
    </div>
  );
}
